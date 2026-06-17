'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Check, Loader2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n';
import { heroScenarios } from '@/lib/sme-data';

const pills = [
  '🏗 quotes & contracts',
  '🏠 property listings',
  '🏢 maintenance logs',
  '🍜 stock & reorders',
  '📊 month-end close',
  '🔒 self-hosted',
];

function StatusIcon({ status }: { status: 'done' | 'running' | 'queued' }) {
  if (status === 'done') return <Check className="size-3.5 text-sme-jade" />;
  if (status === 'running') return <Loader2 className="size-3.5 animate-spin text-sme-amber" />;
  return <MoreHorizontal className="size-3.5 text-muted-foreground" />;
}

function TaskPanel() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroScenarios.length);
    }, 4000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const scenario = heroScenarios[index];
  if (!scenario) return null;

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[0_0_80px_rgba(245,166,35,0.08)]">
      <div className="border-l-2 border-sme-amber p-5">
        <div key={index} className="sme-fade font-mono text-[13px] leading-relaxed">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {t('home.sme.hero.requestLabel')} · {scenario.label}
          </p>
          <p className="mt-3 text-foreground">&ldquo;{scenario.request}&rdquo;</p>

          <div className="mt-5 space-y-2.5">
            {scenario.rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-sme-amber">●</span>
                <span className="flex-1 text-muted-foreground">
                  <span className="text-foreground">{row.agent}</span> · {row.task}
                </span>
                <StatusIcon status={row.status} />
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-4 text-xs">
            <span className="text-muted-foreground">
              {t('home.sme.hero.confidenceLabel')}{' '}
              <span className="text-sme-amber">{scenario.confidence}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-badge)] bg-sme-coral/15 px-2 py-0.5 text-sme-coral">
              🔴 {t('home.sme.hero.reviewBadge')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SmeHero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_0%,rgba(245,166,35,0.10),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sme-amber">
              {t('home.sme.hero.eyebrow')}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t('home.sme.hero.title')}
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">{t('home.sme.hero.body')}</p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href="/conversations">
                  {t('home.sme.hero.ctaPrimary')}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="link" size="lg" className="text-foreground">
                <a href="#how">{t('home.sme.hero.ctaSecondary')} ↓</a>
              </Button>
            </div>
          </div>

          {/* Right — animated task panel */}
          <div className="lg:pl-6">
            <TaskPanel />
          </div>
        </div>

        {/* Pill badges */}
        <div className="mt-14 flex flex-wrap justify-center gap-2.5">
          {pills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
