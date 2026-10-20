import React from 'react';
import { BrandLogo } from './BrandLogo';

export function Footer({ t, onOpenLegal, lang = 'de' }) {
  const legalItems = [
    { id: 'impressum', label: lang === 'de' ? 'Impressum' : 'Imprint' },
    { id: 'datenschutz', label: lang === 'de' ? 'Datenschutz (DSGVO)' : 'Privacy Policy (GDPR)' },
    { id: 'agb', label: lang === 'de' ? 'AGB (B2B)' : 'Terms of Service' },
    { id: 'kontakt', label: lang === 'de' ? 'Kontakt & Support' : 'Contact & Support' },
  ];

  return (
    <footer className="border-t border-slate-800/80 bg-background py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-800/80">
          <div className="max-w-md space-y-3">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed">{t.footer.tagline}</p>
            <p className="text-xs font-mono text-accent">{t.footer.domains}</p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-slate-300">
            {legalItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenLegal(item.id)}
                className="hover:text-accent font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="space-y-1">
            <p>
              © {new Date().getFullYear()} Consulting4KMU · Roland Popp · Widukindstraße 29, 90579 Langenzenn.
            </p>
            <p className="text-[11px] text-slate-600">
              USt-IdNr.: DE236954123 · {t.footer.rights}
            </p>
          </div>
          <span className="font-mono text-slate-400 text-[11px]">
            Odoo 19 · HubSpot · Salesforce · Siprosa Cockpit Ready
          </span>
        </div>
      </div>
    </footer>
  );
}
