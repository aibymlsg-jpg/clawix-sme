'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Copy, Loader2, MonitorPlay } from 'lucide-react';
import { authFetch, getAccessToken } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useLanguage } from '@/i18n';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProjectorItem {
  name: string;
  path: string;
}

/** Message protocol for projector iframe → parent communication. */
interface ProjectorSaveMessage {
  type: 'projector:save';
  filename: string;
  content: string; // base64 for binary, plain text for text files
  encoding?: 'base64' | 'text';
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProjectorPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ProjectorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [saveKind, setSaveKind] = useState<'saving' | 'saved' | 'error' | ''>('');
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activeHtml, setActiveHtml] = useState<string | null>(null);
  const [loadingHtml, setLoadingHtml] = useState(false);
  const [guideOpen, setGuideOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCopy = useCallback(() => {
    const prompt = t('projector.samplePrompt');
    void navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [t]);

  const fetchItems = useCallback(async () => {
    try {
      const res = await authFetch<{ success: boolean; data: ProjectorItem[] }>(
        '/api/v1/workspace/projector',
      );
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError(t('projector.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  // Listen for postMessage from iframe (save to workspace)
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type !== 'projector:save') return;

      const msg = event.data as ProjectorSaveMessage;
      const outputPath = `/Output/Projector/${msg.filename}`;

      try {
        setSaveKind('saving');
        setSaveStatus(t('projector.saving', { file: msg.filename }));

        const accessToken = await getAccessToken();
        if (!accessToken) throw new Error(t('projector.notAuthenticated'));
        const apiBase = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';

        // Convert content to blob
        let blob: Blob;
        if (msg.encoding === 'base64') {
          const byteChars = atob(msg.content);
          const byteArr = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteArr[i] = byteChars.charCodeAt(i);
          }
          blob = new Blob([byteArr]);
        } else {
          blob = new Blob([msg.content], { type: 'text/plain' });
        }

        // Upload via workspace upload endpoint (FormData — no JSON content-type)
        const formData = new FormData();
        formData.append('file', blob, msg.filename);

        const res = await fetch(
          `${apiBase}/api/v1/workspace/files/upload?path=${encodeURIComponent(outputPath)}&overwrite=true`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}` },
            body: formData,
          },
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error((body as { message?: string }).message ?? t('projector.uploadFailed'));
        }

        setSaveKind('saved');
        setSaveStatus(t('projector.saved', { path: outputPath }));
        setTimeout(() => {
          setSaveStatus('');
          setSaveKind('');
        }, 3000);

        // Notify iframe that save succeeded
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'projector:save-result', success: true, path: outputPath },
          '*',
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : t('projector.saveFailed');
        setSaveKind('error');
        setSaveStatus(t('projector.errorPrefix', { message }));
        setTimeout(() => {
          setSaveStatus('');
          setSaveKind('');
        }, 5000);

        iframeRef.current?.contentWindow?.postMessage(
          { type: 'projector:save-result', success: false, error: message },
          '*',
        );
      }
    };

    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, [t]);

  const openItem = useCallback(
    async (name: string) => {
      setLoadingHtml(true);
      setActiveItem(name);
      setActiveHtml(null);
      setSaveStatus('');
      setSaveKind('');
      try {
        const res = await authFetch<{
          success: boolean;
          data: { name: string; html: string };
        }>(`/api/v1/workspace/projector/${encodeURIComponent(name)}`);
        setActiveHtml(res.data.html);
      } catch {
        setError(t('projector.loadItemError', { name }));
        setActiveItem(null);
      } finally {
        setLoadingHtml(false);
      }
    },
    [t],
  );

  const closeViewer = useCallback(() => {
    setActiveItem(null);
    setActiveHtml(null);
    setSaveStatus('');
    setSaveKind('');
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{t('projector.title')}</h1>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            {t('projector.eyebrow')}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{t('projector.subtitle')}</p>
      </div>

      {/* Step-by-step guide */}
      <Collapsible open={guideOpen} onOpenChange={setGuideOpen}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{t('projector.guideTitle')}</span>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={guideOpen ? 'Collapse guide' : 'Expand guide'}
            >
              <ChevronDown
                className={cn(
                  'size-4 transition-transform duration-200',
                  guideOpen && 'rotate-180',
                )}
              />
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="mt-3 flex flex-col gap-5 rounded-xl border border-border/60 bg-card/50 p-5">
            <p className="text-sm text-muted-foreground">{t('projector.guideIntro')}</p>

            {/* Steps grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(
                [
                  { title: t('projector.step1Title'), body: t('projector.step1Body') },
                  { title: t('projector.step2Title'), body: t('projector.step2Body') },
                  { title: t('projector.step3Title'), body: t('projector.step3Body') },
                  { title: t('projector.step4Title'), body: t('projector.step4Body') },
                  { title: t('projector.step5Title'), body: t('projector.step5Body') },
                  { title: t('projector.step6Title'), body: t('projector.step6Body') },
                ] as { title: string; body: string }[]
              ).map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background/60 p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold leading-tight">{step.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>

            {/* Sample prompt */}
            <div className="rounded-lg border border-border/50 bg-muted/30">
              <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
                  {t('projector.samplePromptLabel')}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    'flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[10px] transition-colors',
                    copied ? 'text-green-400' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  {copied ? t('projector.copied') : t('projector.copyPrompt')}
                </button>
              </div>
              <pre className="whitespace-pre-wrap px-4 py-3 text-xs leading-relaxed text-foreground/80">
                {t('projector.samplePrompt')}
              </pre>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <MonitorPlay className="mb-3 size-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t('projector.empty')}</p>
        </div>
      )}

      {/* Card grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <button
              key={item.name}
              className={cn(
                'group flex cursor-pointer items-center gap-2 rounded-lg border border-l-[3px] border-l-primary/50 bg-card px-4 py-3 text-left text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary/40 hover:border-l-primary hover:bg-primary/10 hover:shadow-[0_8px_24px_-8px_rgba(217,119,6,0.4)]',
                activeItem === item.name && 'border-l-primary bg-primary/15 ring-1 ring-primary/40',
              )}
              onClick={() => void openItem(item.name)}
            >
              <MonitorPlay className="size-4 shrink-0 text-primary/70 transition-transform duration-200 group-hover:scale-110" />
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Projector modal */}
      <Dialog
        open={activeItem !== null}
        onOpenChange={(open) => {
          if (!open) closeViewer();
        }}
      >
        <DialogContent
          showCloseButton
          className="flex h-[85vh] !w-[70vw] !max-w-none flex-col gap-0 p-0 overflow-hidden [&>[data-slot=dialog-close]]:z-50 [&>[data-slot=dialog-close]]:bg-background/80 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:p-1"
        >
          <DialogTitle className="sr-only">{activeItem ?? t('projector.title')}</DialogTitle>

          {/* Save status bar */}
          {saveStatus && (
            <div
              className={cn(
                'px-4 py-2 text-xs font-medium',
                saveKind === 'error'
                  ? 'bg-destructive/20 text-destructive'
                  : saveKind === 'saving'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-green-500/20 text-green-400',
              )}
            >
              {saveStatus}
            </div>
          )}

          {loadingHtml ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : activeHtml ? (
            // Sandbox: agent-generated HTML must run in an opaque origin so a
            // compromised projector output cannot reach the dashboard's
            // cookies, localStorage, JWT, or DOM. `allow-same-origin` is
            // intentionally omitted — combined with `allow-scripts` it would
            // negate the sandbox entirely. Projector tools that need to
            // persist files communicate via `postMessage` (handled above);
            // anything that needs to fetch resources must be proxied through
            // the API rather than running cross-origin fetches from here.
            <iframe
              ref={iframeRef}
              srcDoc={activeHtml}
              sandbox="allow-scripts allow-forms allow-modals allow-downloads allow-popups allow-popups-to-escape-sandbox"
              className="h-full w-full border-0"
              title={activeItem ?? t('projector.title')}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
