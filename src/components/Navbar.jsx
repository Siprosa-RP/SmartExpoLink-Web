import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Navbar({ lang, setLang, t, onOpenModal }) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-accent/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#" className="focus:outline-none">
          <BrandLogo size="md" showTagline={true} />
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-accent transition-colors">
            {t.nav.features}
          </a>
          <a href="#personas" className="hover:text-accent transition-colors">
            {t.nav.workflows}
          </a>
          <a href="#roi" className="hover:text-accent transition-colors">
            {t.nav.roi}
          </a>
          <a href="#pricing" className="hover:text-accent transition-colors">
            {t.nav.pricing}
          </a>
          <a href="#faq" className="hover:text-accent transition-colors">
            {t.nav.faq}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Language Switcher (.de / .com) */}
          <button
            type="button"
            onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-accent/20 text-xs font-mono text-slate-200 hover:border-accent transition-colors"
            title="Switch Language (DE / EN)"
          >
            <Globe className="w-3.5 h-3.5 text-accent" />
            <span className={lang === 'de' ? 'text-accent font-bold' : 'text-slate-400'}>DE</span>
            <span className="text-slate-600">/</span>
            <span className={lang === 'en' ? 'text-accent font-bold' : 'text-slate-400'}>EN</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('expopass')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-soft transition-all shadow-glow-sm"
          >
            <span>{t.nav.cta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
