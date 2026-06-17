'use client';

import { useLanguage } from '@/i18n';

const PILLAR_COUNT = 6;

export function SmeTrustSection() {
  const { t } = useLanguage();
  const pillars = Array.from({ length: PILLAR_COUNT }, (_, i) => ({
    icon: t(`home.sme.trust.pillars.${i}.icon`),
    title: t(`home.sme.trust.pillars.${i}.title`),
    body: t(`home.sme.trust.pillars.${i}.body`),
  }));

  return (
    <section id="trust" className="scroll-mt-16 border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('home.sme.trust.heading')}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">{t('home.sme.trust.sub')}</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-card)] border-l-[3px] border-sme-jade bg-card p-6"
            >
              <span className="text-2xl">{pillar.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-foreground">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
