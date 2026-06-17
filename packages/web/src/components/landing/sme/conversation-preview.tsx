'use client';

/**
 * HITL GATE — CLAWIX SME PLATFORM RULE
 *
 * No agent output may be sent, posted, filed, or forwarded
 * without explicit human approval at a ReviewGate component.
 *
 * Consequential actions include:
 *   - Sending any email, WhatsApp, or SMS to an external party
 *   - Posting any journal entry or financial record
 *   - Submitting any form or portal data
 *   - Generating any client-facing document (quote, contract, invoice)
 *
 * The ReviewGate must always render with:
 *   - The full draft content
 *   - Confidence score
 *   - Source document references
 *   - Three options: Approve / Edit / Discard
 *
 * Never auto-approve. Never skip the gate on a retry.
 *
 * NOTE: This is a static marketing mockup — no live action is taken here.
 */

import { useLanguage } from '@/i18n';

const recent = [
  { title: 'March close pack', status: '✅' },
  { title: 'Unit 12B listing', status: '✅' },
  { title: 'Saturday reorder', status: '✅' },
  { title: 'Plumbing – Blk C', status: '🔴' },
];

const activeAgents = ['QuoteCraft', 'StockSense', 'BookBot'];
const loadedSkills = ['document-reader', 'template-writer', 'email-drafter'];

export function SmeConversationPreview() {
  const { t } = useLanguage();

  return (
    <section id="preview" className="scroll-mt-16 border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('home.sme.preview.heading')}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">{t('home.sme.preview.sub')}</p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[0_0_80px_rgba(245,166,35,0.08)]">
          <div className="grid md:grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <aside className="border-b border-border p-4 text-sm md:border-b-0 md:border-r">
              <button
                type="button"
                className="w-full rounded-md bg-sme-amber px-3 py-2 text-sm font-semibold text-[var(--clr-midnight)]"
              >
                + {t('home.sme.preview.newConversation')}
              </button>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('home.sme.preview.recent')}
              </p>
              <ul className="mt-2 space-y-1.5">
                {recent.map((c) => (
                  <li
                    key={c.title}
                    className="flex items-center justify-between text-muted-foreground"
                  >
                    <span className="truncate">· {c.title}</span>
                    <span>{c.status}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('home.sme.preview.agents')}
              </p>
              <ul className="mt-2 space-y-1.5">
                {activeAgents.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sme-jade">●</span> {a}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('home.sme.preview.skills')}
              </p>
              <ul className="mt-2 space-y-1.5">
                {loadedSkills.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
                  >
                    <span className="text-sme-jade">✓</span> {s}
                  </li>
                ))}
              </ul>
            </aside>

            {/* Chat area */}
            <div className="p-6">
              <div className="ml-auto max-w-md rounded-2xl rounded-tr-sm bg-sme-amber px-4 py-3 text-sm text-[var(--clr-midnight)]">
                Draft a quote for the Wong&rsquo;s kitchen renovation — tiles, labour, 15% margin.
              </div>

              <p className="mt-4 text-xs italic text-muted-foreground">
                {t('home.sme.preview.routing')}
              </p>

              <div className="mt-3 max-w-md rounded-2xl rounded-tl-sm border border-border bg-[var(--clr-midnight)] px-4 py-3">
                <p className="text-xs font-semibold text-sme-amber">📋 QuoteCraft</p>
                <div className="mt-2 space-y-0.5 font-mono text-[13px] text-foreground">
                  <p>Tiles: HK$12,400</p>
                  <p>Labour: HK$8,200</p>
                  <p>Margin (15%): HK$3,090</p>
                  <p className="text-sme-amber">Total: HK$23,690</p>
                </div>
              </div>

              {/* Review gate */}
              <div className="mt-4 max-w-md rounded-[var(--radius-card)] border border-sme-coral/40 bg-sme-coral/10 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-sme-coral">
                  🔴 {t('home.sme.preview.reviewBadge')}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-sme-jade px-3 py-1.5 text-xs font-semibold text-[var(--clr-midnight)]"
                  >
                    ✅ {t('home.sme.preview.approve')}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
                  >
                    ✏️ {t('home.sme.preview.edit')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
