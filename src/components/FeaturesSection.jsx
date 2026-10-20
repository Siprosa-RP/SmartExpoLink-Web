import React, { useState } from 'react';
import {
  Zap,
  Globe,
  ShieldCheck,
  Camera,
  MapPin,
  WifiOff,
  CheckCircle2,
  Briefcase,
  ShoppingBag,
} from 'lucide-react';

const iconMap = {
  Zap,
  Globe,
  ShieldCheck,
  Camera,
  MapPin,
  WifiOff,
};

export function FeaturesSection({ t }) {
  const [activePersona, setActivePersona] = useState('sales');

  return (
    <div className="py-24 space-y-28">
      {/* 6 Core Features Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            {t.features.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            {t.features.title}
          </h2>
          <p className="text-slate-300 mt-3 text-base">{t.features.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.items.map((feat, idx) => {
            const IconComponent = iconMap[feat.icon] || Zap;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 hover:border-accent/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-surface-elevated text-accent-soft border border-slate-800">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dual Persona Section: Exhibitors (Sales) vs. Visitors (Procurement) */}
      <section id="personas" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            {t.personas.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            {t.personas.title}
          </h2>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-surface border border-slate-800">
            <button
              type="button"
              onClick={() => setActivePersona('sales')}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                activePersona === 'sales'
                  ? 'bg-accent text-background shadow-glow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{t.personas.salesTab}</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePersona('procurement')}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                activePersona === 'procurement'
                  ? 'bg-accent text-background shadow-glow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.personas.procurementTab}</span>
            </button>
          </div>
        </div>

        {/* Active Persona Content Card */}
        <div className="glass-panel-elevated rounded-3xl p-8 lg:p-10 border border-accent/30">
          <h3 className="text-2xl font-extrabold text-white mb-6">
            {activePersona === 'sales'
              ? t.personas.sales.headline
              : t.personas.procurement.headline}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {(activePersona === 'sales'
              ? t.personas.sales.points
              : t.personas.procurement.points
            ).map((pt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-slate-800"
              >
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200 leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
