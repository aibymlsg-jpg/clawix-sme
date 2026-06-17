'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n';
import { skills, type SkillCategory } from '@/lib/sme-data';

const filters: { key: 'all' | SkillCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'home.sme.skills.filters.all' },
  { key: 'documents', labelKey: 'home.sme.skills.filters.documents' },
  { key: 'communication', labelKey: 'home.sme.skills.filters.communication' },
  { key: 'finance', labelKey: 'home.sme.skills.filters.finance' },
  { key: 'calendar', labelKey: 'home.sme.skills.filters.calendar' },
  { key: 'notify', labelKey: 'home.sme.skills.filters.notify' },
];

export function SmeSkillsBrowser() {
  const { t } = useLanguage();
  const [active, setActive] = useState<'all' | SkillCategory>('all');

  const visible = active === 'all' ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="scroll-mt-16 border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('home.sme.skills.heading')}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">{t('home.sme.skills.sub')}</p>
        </div>

        {/* Filter tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                setActive(f.key);
              }}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                active === f.key
                  ? 'border-sme-amber bg-sme-amber/10 text-sme-amber'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        {/* Skill chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {visible.map((skill) => (
            <span
              key={skill.name}
              className="group inline-flex items-center gap-2 rounded-[var(--radius-badge)] border border-border bg-card px-3.5 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-sme-amber hover:text-foreground"
            >
              <span>{skill.emoji}</span>
              {skill.name}
            </span>
          ))}
        </div>

        {/* Build-your-own callout */}
        <div className="mx-auto mt-12 max-w-2xl rounded-[var(--radius-card)] border border-border bg-card p-7">
          <div className="flex items-start gap-3">
            <Wrench className="mt-0.5 size-5 text-sme-amber" />
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('home.sme.skills.build.title')}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('home.sme.skills.build.body')}
              </p>
              <Link
                href="/skills"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sme-amber hover:underline"
              >
                {t('home.sme.skills.build.cta')}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
