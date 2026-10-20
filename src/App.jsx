import React, { useState, useEffect } from 'react';
import { translations } from './config/translations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RoiCalculator } from './components/RoiCalculator';
import { FeaturesSection } from './components/FeaturesSection';
import { PricingSection } from './components/PricingSection';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState('de');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('expopass');

  // Legal Modal State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState('impressum');

  useEffect(() => {
    // Automatically choose language based on domain (.com -> en, .de -> de)
    const host = window.location.hostname.toLowerCase();
    if (host.endsWith('.com') && !navigator.language.toLowerCase().startsWith('de')) {
      setLang('en');
    }

    // Hash handler for direct legal links (#impressum, #datenschutz, #agb, #kontakt)
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (['impressum', 'datenschutz', 'privacy', 'agb', 'terms', 'kontakt', 'contact'].includes(hash)) {
        if (hash === 'privacy') setActiveLegalTab('datenschutz');
        else if (hash === 'terms') setActiveLegalTab('agb');
        else if (hash === 'contact') setActiveLegalTab('kontakt');
        else setActiveLegalTab(hash);
        setLegalModalOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const t = translations[lang] || translations.de;

  const handleOpenLeadModal = (planId = 'expopass') => {
    setSelectedPlan(planId);
    setLeadModalOpen(true);
  };

  const handleOpenLegalModal = (tabId = 'impressum') => {
    setActiveLegalTab(tabId);
    setLegalModalOpen(true);
    window.location.hash = tabId;
  };

  const handleCloseLegalModal = () => {
    setLegalModalOpen(false);
    if (window.location.hash) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-100">
      <Navbar lang={lang} setLang={setLang} t={t} onOpenModal={handleOpenLeadModal} />
      <main className="flex-1">
        <HeroSection t={t} onOpenModal={handleOpenLeadModal} />
        <RoiCalculator t={t} />
        <FeaturesSection t={t} />
        <PricingSection t={t} onOpenModal={handleOpenLeadModal} />
      </main>
      <Footer t={t} onOpenLegal={handleOpenLegalModal} lang={lang} />
      
      {/* Lead / Pricing Order Modal */}
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        initialPlan={selectedPlan}
        t={t}
      />

      {/* Mandatory German/EU Legal Modal (Impressum, DSGVO, B2B-AGB) */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={handleCloseLegalModal}
        activeTab={activeLegalTab}
        setActiveTab={setActiveLegalTab}
        lang={lang}
      />
    </div>
  );
}
