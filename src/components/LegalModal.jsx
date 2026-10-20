import React from 'react';
import { X, ShieldCheck, FileText, Scale, Mail, Printer } from 'lucide-react';
import { legalTexts } from '../config/legalTexts';
import { BrandLogo } from './BrandLogo';

export function LegalModal({ isOpen, onClose, activeTab = 'impressum', setActiveTab, lang = 'de' }) {
  if (!isOpen) return null;

  const currentTexts = legalTexts[lang] || legalTexts.de;
  const currentContent = currentTexts[activeTab] || currentTexts.impressum;

  const tabs = [
    { id: 'impressum', label: lang === 'de' ? 'Impressum' : 'Imprint', icon: FileText },
    { id: 'datenschutz', label: lang === 'de' ? 'Datenschutz (DSGVO)' : 'Privacy (GDPR)', icon: ShieldCheck },
    { id: 'agb', label: lang === 'de' ? 'AGB (B2B)' : 'Terms of Service', icon: Scale },
    { id: 'kontakt', label: lang === 'de' ? 'Kontakt' : 'Contact', icon: Mail },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-accent/35 shadow-glow relative">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span className="text-xs font-mono text-accent-soft uppercase tracking-wider hidden sm:inline">
              RECHTLICHE INFORMATIONEN
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={lang === 'de' ? 'Seite drucken' : 'Print page'}
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={lang === 'de' ? 'Schließen' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-slate-800/80 flex overflow-x-auto gap-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-accent/15 border-accent text-accent'
                    : 'bg-surface border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 text-sm leading-relaxed">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {currentContent.title}
            </h2>
            <p className="text-xs font-mono text-accent-soft mt-1">
              {currentContent.subtitle}
            </p>
          </div>

          <div className="space-y-6 pt-2">
            {currentContent.sections.map((sec, idx) => (
              <div key={idx} className="rounded-2xl bg-surface/70 border border-slate-800 p-5 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {sec.heading}
                </h3>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {sec.content.map((line, lIdx) => (
                    <p key={lIdx} className="leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-background/50 rounded-b-3xl flex items-center justify-between text-xs text-slate-400">
          <span>Consulting4KMU · Roland Popp · 90579 Langenzenn</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-accent text-background font-bold hover:bg-accent-soft transition-colors"
          >
            {lang === 'de' ? 'Schließen' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
