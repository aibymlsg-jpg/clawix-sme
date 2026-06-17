'use client';

import { useLanguage } from '@/i18n';

const STEP_COUNT = 3;

export function SmeHowItWorks() {
  const { t } = useLanguage();
  const steps = Array.from({ length: STEP_COUNT }, (_, i) => ({
    label: t(`home.sme.how.steps.${i}.label`),
    title: t(`home.sme.how.steps.${i}.title`),
    body: t(`home.sme.how.steps.${i}.body`),
  }));

  return (
    <section id="how" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('home.sme.how.heading')}
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-[var(--radius-card)] border-t-4 border-sme-amber bg-card p-7"
            >
              <span className="pointer-events-none absolute -right-2 top-2 select-none text-[120px] font-extrabold leading-none text-sme-mist/40">
                {i + 1}
              </span>
              <p className="relative text-xs font-semibold uppercase tracking-widest text-sme-amber">
                {step.label}
              </p>
              <h3 className="relative mt-3 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
