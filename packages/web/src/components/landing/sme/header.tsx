'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/language-toggle';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n';

const navLinks = [
  { href: '#how', key: 'home.sme.nav.howItWorks' },
  { href: '#agents', key: 'home.sme.nav.agents' },
  { href: '#skills', key: 'home.sme.nav.skills' },
  { href: '#trust', key: 'home.sme.nav.trust' },
] as const;

export function SmeHeader() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        scrolled
          ? 'border-b border-border bg-[var(--clr-midnight)]/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🏗</span>
          <span className="text-base font-extrabold tracking-tight text-foreground">
            {t('home.sme.brand')}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <Button asChild variant="outline">
            <Link href="/login">{t('home.sme.nav.signIn')}</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">{t('home.sme.nav.tryFree')}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground"
            onClick={() => {
              setOpen(!open);
            }}
            aria-expanded={open}
            aria-label={open ? t('home.sme.nav.closeMenu') : t('home.sme.nav.openMenu')}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <div className={cn('md:hidden', open ? 'block' : 'hidden')}>
        <div className="space-y-1 border-t border-border bg-[var(--clr-midnight)] px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="block py-2 text-base text-muted-foreground hover:text-foreground"
              onClick={() => {
                setOpen(false);
              }}
            >
              {t(link.key)}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-4">
            <Button asChild variant="outline">
              <Link href="/login">{t('home.sme.nav.signIn')}</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">{t('home.sme.nav.tryFree')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
