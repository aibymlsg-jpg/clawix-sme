'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n';

export function SmeCtaBanner() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t('home.sme.cta.title')}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          {t('home.sme.cta.body')}
        </p>
        <div className="mt-9 flex justify-center">
          <Button asChild size="lg">
            <Link href="/conversations">
              {t('home.sme.cta.button')}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
