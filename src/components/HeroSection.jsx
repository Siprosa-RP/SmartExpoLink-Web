import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Camera,
  Mic,
  Languages,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export function HeroSection({ t, onOpenModal }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-28">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-accent/10 blur-[130px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              {t.hero.titleLine1}{' '}
              <span className="text-gradient-ice">{t.hero.titleHighlight}</span>{' '}
              {t.hero.titleLine2}
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onOpenModal('starter')}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-accent text-background font-extrabold text-base hover:bg-accent-soft transition-all shadow-glow"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl glass-panel text-slate-100 font-semibold text-base hover:border-accent/40 transition-all"
              >
                <span>{t.hero.secondaryCta}</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 grid sm:grid-cols-3 gap-3">
              {t.hero.trustItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Interactive SmartExpoLink Card Scanner Mockup */}
          <div className="lg:col-span-5">
            <div className="glass-panel-elevated rounded-3xl p-6 shadow-glow relative border border-accent/30">
              {/* Top Status Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-accent">
                    {t.hero.mockup.liveBadge}
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  OFFLINE BUFFER OK
                </span>
              </div>

              {/* Scanned Business Card Preview */}
              <div className="rounded-2xl bg-background/90 border border-accent/20 p-4 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-slate-400">
                      {t.hero.mockup.cardOriginal}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {t.hero.mockup.cardCompany}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-accent mt-1">
                      <Languages className="w-4 h-4 shrink-0" />
                      <span>{t.hero.mockup.cardTranslated}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent font-mono text-xs font-bold">
                    HOT LEAD · 94%
                  </span>
                </div>

                {/* Supplier Audit & Booth Chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {t.hero.mockup.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-elevated border border-slate-700 text-xs text-slate-200"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attached Media & Voice Note */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface border border-slate-800 mb-4">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="flex -space-x-1">
                    <span className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                      <Mic className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <span>{t.hero.mockup.photoLabel}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">00:24s</span>
              </div>

              {/* 1-Click ERP / CRM Sync Footer */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.hero.mockup.syncStatus}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-white bg-emerald-600/40 px-2 py-0.5 rounded">
                  DONE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
