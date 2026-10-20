import React, { useState } from 'react';
import { XCircle, CheckCircle2, Calculator } from 'lucide-react';

export function RoiCalculator({ t }) {
  const [contactsCount, setContactsCount] = useState(120);
  const [hourlyRate, setHourlyRate] = useState(65);

  // 6 minutes manual post-processing saved per contact (typing, sorting sample photos, translating, CRM import)
  const savedHours = Math.round((contactsCount * 6) / 60);
  // Saved labor + €550 average organizer badge scanner rental saved
  const savedEuros = savedHours * hourlyRate + 550 - 49;

  return (
    <section id="roi" className="py-20 bg-surface/50 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Old Way vs. SmartExpoLink Way */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">
              {t.painComparison.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              {t.painComparison.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="rounded-2xl bg-red-950/15 border border-red-500/25 p-7">
              <h3 className="text-lg font-bold text-red-300 mb-5 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{t.painComparison.oldWayTitle}</span>
              </h3>
              <ul className="space-y-3.5">
                {t.painComparison.oldWayItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-red-400 font-bold mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SmartExpoLink Way */}
            <div className="rounded-2xl glass-panel-elevated border border-accent/35 p-7 shadow-glow-sm">
              <h3 className="text-lg font-bold text-accent mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <span>{t.painComparison.newWayTitle}</span>
              </h3>
              <ul className="space-y-3.5">
                {t.painComparison.newWayItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-100">
                    <span className="text-success font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Trade Show ROI Calculator */}
        <div className="glass-panel rounded-3xl p-8 lg:p-10 border border-accent/25">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent mb-2">
            <Calculator className="w-4 h-4" />
            <span>{t.roi.tag}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
            {t.roi.title}
          </h3>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-300">{t.roi.contactsLabel}</span>
                  <span className="font-mono font-bold text-accent text-base">
                    {contactsCount} Leads / Cards
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={contactsCount}
                  onChange={(e) => setContactsCount(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-300">{t.roi.hourlyRateLabel}</span>
                  <span className="font-mono font-bold text-accent text-base">
                    {hourlyRate} € / h
                  </span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="150"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-5 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-background/90 border border-slate-800 p-5">
                <div className="text-xs text-slate-400">{t.roi.savedHoursTitle}</div>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {savedHours} h
                </div>
                <div className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {t.roi.savedHoursSub}
                </div>
              </div>

              <div className="rounded-2xl bg-accent/10 border border-accent/40 p-5">
                <div className="text-xs text-accent-soft">{t.roi.savedMoneyTitle}</div>
                <div className="text-3xl font-extrabold text-accent mt-1 font-mono">
                  {savedEuros.toLocaleString('de-DE')} €
                </div>
                <div className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                  {t.roi.savedMoneySub}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
