'use client';

import { useLanguage } from '@/i18n';

export function SmeContextStrip() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">{t('home.sme.context.line1')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('home.sme.context.line2')}</p>
      </div>
    </section>
  );
}
