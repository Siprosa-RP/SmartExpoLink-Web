import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function LeadCaptureModal({ isOpen, onClose, initialPlan, t }) {
  const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'expopass');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [crm, setCrm] = useState('Odoo 19');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setSelectedPlan(initialPlan);
    }
    setSubmitted(false);
  }, [initialPlan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="glass-panel-elevated rounded-3xl max-w-lg w-full p-7 border border-accent/35 shadow-glow relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <BrandLogo size="sm" />
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-success/20 border border-success/40 flex items-center justify-center text-success mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">{t.modal.successTitle}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{t.modal.successText}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-accent text-background font-bold text-sm"
            >
              OK
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-extrabold text-white">{t.modal.title}</h3>
            <p className="text-sm text-slate-300 mt-1 mb-6">{t.modal.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.modal.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-700 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.modal.companyLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Muster GmbH"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-700 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.modal.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@firma.de"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-700 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.modal.planLabel}
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-700 text-sm text-white focus:outline-none focus:border-accent"
                  >
                    <option value="starter">Starter Trial (0 € · 20 Scans)</option>
                    <option value="expopass">Single Expo Pass (49 € · 14 Tage)</option>
                    <option value="business">Business Pro (29 € / Monat · CRM Sync)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.modal.crmLabel}
                  </label>
                  <select
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-700 text-sm text-white focus:outline-none focus:border-accent"
                  >
                    <option value="Odoo 19">Odoo ERP / CRM</option>
                    <option value="HubSpot">HubSpot CRM</option>
                    <option value="Salesforce">Salesforce</option>
                    <option value="Excel / CSV">Excel / CSV / vCard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-5 rounded-xl bg-accent text-background font-extrabold text-sm hover:bg-accent-soft transition-all flex items-center justify-center gap-2 shadow-glow-sm"
              >
                <span>{t.modal.submitBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
