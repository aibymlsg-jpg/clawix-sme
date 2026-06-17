'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { sectors } from '@/lib/sme-data';

export function SmeSectorGrid() {
  const { t } = useLanguage();

  return (
    <section id="sectors" className="scroll-mt-16 border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('home.sme.sectors.heading')}
        </h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {sectors.map((sector) => (
            <div
              key={sector.agentPack}
              className="flex flex-col rounded-[var(--radius-card)] border border-border bg-card p-6"
            >
              <span className="text-3xl" style={{ filter: 'saturate(1.1)' }}>
                {sector.emoji}
              </span>
              <h3 className="mt-3 text-base font-bold text-foreground">{sector.name}</h3>
              <div
                className="my-3 h-0.5 w-10 rounded-full"
                style={{ backgroundColor: sector.accent }}
              />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t('home.sme.sectors.handleLabel')}
              </p>
              <ul className="mt-2 flex-1 space-y-1.5">
                {sector.handle.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    · {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/explore?pack=${sector.agentPack}`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sme-amber hover:underline"
              >
                {t('home.sme.sectors.cta')}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
