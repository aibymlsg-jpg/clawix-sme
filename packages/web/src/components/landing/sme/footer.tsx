'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n';

export function SmeFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const productLinks = [
    { href: '#how', label: t('home.sme.footer.linkHow') },
    { href: '#sectors', label: t('home.sme.footer.linkPacks') },
    { href: '/skills', label: t('home.sme.footer.linkSkills') },
    { href: '/login', label: t('home.sme.footer.linkSignIn') },
  ];

  const companyLinks = [
    { href: 'https://aibyml.com', label: t('home.sme.footer.linkAbout'), external: true },
    { href: 'https://clawix.aibyml.com', label: t('home.sme.footer.linkPlatform'), external: true },
    {
      href: 'https://github.com/aibyml-ngo/clawix',
      label: t('home.sme.footer.linkGithub'),
      external: true,
    },
  ];

  return (
    <footer className="border-t border-border bg-[var(--clr-midnight)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏗</span>
            <span className="text-base font-extrabold text-foreground">{t('home.sme.brand')}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t('home.sme.footer.blurb')}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('home.sme.footer.tagline')}</p>
        </div>

        {/* Product */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('home.sme.footer.product')}
          </p>
          <ul className="mt-3 space-y-2">
            {productLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('home.sme.footer.company')}
          </p>
          <ul className="mt-3 space-y-2">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>{t('home.sme.footer.copyright', { year })}</span>
          <span>{t('home.sme.footer.region')}</span>
        </div>
      </div>
    </footer>
  );
}
