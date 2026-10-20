import React, { useState } from 'react';
import { Check, Sparkles, HelpCircle, Loader2 } from 'lucide-react';

export function PricingSection({ t, onOpenModal }) {
  const [loadingPlan, setLoadingPlan] = useState('');

  const handlePlanClick = async (planId) => {
    // Bei Starter Trial: Modal öffnen
    if (planId === 'starter') {
      onOpenModal(planId);
      return;
    }

    // Bei Bezahlplänen (Expo Pass 49 € oder Business Pro 29 €): Direkt zu Stripe Checkout
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback aufs Modal falls API lokal/offline
        onOpenModal(planId);
      }
    } catch (err) {
      console.warn('Stripe Redirect Fallback zu Modal:', err);
      onOpenModal(planId);
    } finally {
      setLoadingPlan('');
    }
  };

  return (
    <div className="py-24 bg-surface/40 border-t border-slate-800/80 space-y-28">
      {/* 3-Tier Pricing Cards */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            {t.pricing.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            {t.pricing.title}
          </h2>
          <p className="text-slate-300 mt-3 text-base">{t.pricing.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {t.pricing.plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all ${
                plan.highlighted
                  ? 'glass-panel-elevated border-2 border-accent shadow-glow lg:-translate-y-2'
                  : 'glass-panel border border-slate-800'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent text-background text-xs font-mono font-extrabold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.pricing.popularBadge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {plan.id === 'business' && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                      {t.pricing.bestValueBadge}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>

                <p className="text-sm text-slate-300 mt-3 pb-6 border-b border-slate-800">
                  {plan.desc}
                </p>

                <ul className="space-y-3.5 my-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-1" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={loadingPlan === plan.id}
                onClick={() => handlePlanClick(plan.id)}
                className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-accent text-background hover:bg-accent-soft shadow-glow-sm'
                    : 'bg-surface-elevated text-white border border-accent/30 hover:border-accent'
                }`}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Weiterleitung zu Stripe...</span>
                  </>
                ) : (
                  <span>{plan.cta}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <HelpCircle className="w-6 h-6 text-accent" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.faq.title}
          </h2>
        </div>

        <div className="space-y-4">
          {t.faq.items.map((item, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-6 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-2">{item.q}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
