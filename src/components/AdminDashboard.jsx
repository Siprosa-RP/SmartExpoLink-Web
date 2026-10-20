import React, { useState, useEffect } from 'react';
import {
  Users,
  Key,
  ShieldCheck,
  TrendingUp,
  Plus,
  RefreshCw,
  Copy,
  Check,
  LogOut,
  Mail,
  Building,
  Calendar,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BrandLogo } from './BrandLogo';

export function AdminDashboard({ onBackToLanding }) {
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState('info@consulting4kmu.de');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data States
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'licenses'
  const [leads, setLeads] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  // Quick License Generation Modal State
  const [generatingForLead, setGeneratingForLead] = useState(null);
  const [licenseDays, setLicenseDays] = useState(14);
  const [licenseScans, setLicenseScans] = useState(300);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadAllData();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadAllData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword,
      });

      if (error) {
        // Fallback: Magic Link anbieten
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: authEmail.trim(),
        });
        if (otpError) {
          throw new Error(error.message);
        } else {
          setAuthError('Ein Magic Login-Link wurde an ' + authEmail + ' gesendet!');
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Login fehlgeschlagen');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [leadsRes, licensesRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('licenses').select('*').order('created_at', { ascending: false }),
      ]);

      if (leadsRes.data) setLeads(leadsRes.data);
      if (licensesRes.data) setLicenses(licensesRes.data);
    } catch (err) {
      console.error('Fehler beim Laden der Admin-Daten:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateLicense = async (lead) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let key = 'SEL-';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < 2) key += '-';
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Number(licenseDays));

    try {
      const { data, error } = await supabase.from('licenses').insert([
        {
          license_key: key,
          lead_id: lead.id,
          user_email: lead.email,
          company_name: lead.company,
          plan_type: lead.plan,
          max_scans: Number(licenseScans),
          used_scans: 0,
          valid_until: validUntil.toISOString(),
          status: 'active',
        },
      ]).select();

      if (error) throw error;

      // Status des Leads auf "freigeschaltet" setzen
      await supabase
        .from('leads')
        .update({ status: 'freigeschaltet' })
        .eq('id', lead.id);

      setGeneratingForLead(null);
      loadAllData();
    } catch (err) {
      alert('Fehler beim Erstellen der Lizenz: ' + err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  // Login Screen if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
        <div className="glass-panel-elevated max-w-md w-full p-8 rounded-3xl border border-accent/30 shadow-glow space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <BrandLogo size="md" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent mt-2">
              ADMINISTRATOR BACKEND
            </span>
            <p className="text-xs text-slate-400">
              Zugang geschützt für <span className="text-white font-mono">info@consulting4kmu.de</span>
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 text-xs text-accent-soft leading-relaxed">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Admin E-Mail
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-slate-700 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Passwort (oder leer lassen für Magic Link)
              </label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-slate-700 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-5 rounded-xl bg-accent text-background font-extrabold text-sm hover:bg-accent-soft transition-all flex items-center justify-center gap-2 shadow-glow-sm"
            >
              {authLoading ? (
                <span>Wird angemeldet...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Admin Login</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Zurück zur Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Interface
  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="glass-panel border-b border-accent/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo size="sm" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-accent/15 border border-accent/30 text-[11px] font-mono font-bold text-accent">
              ADMIN COCKPIT
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-300 hidden md:inline">
              {session.user.email}
            </span>
            <button
              type="button"
              onClick={loadAllData}
              className="p-2 rounded-xl bg-surface border border-slate-800 text-slate-300 hover:text-accent hover:border-accent transition-colors"
              title="Aktualisieren"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-accent' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onBackToLanding}
              className="px-3 py-1.5 rounded-xl bg-surface border border-slate-800 text-xs font-medium hover:border-slate-700"
            >
              Website ansehen
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20"
              title="Abmelden"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8 w-full">
        {/* KPI Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Eingegangene Leads</span>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2 font-mono">
              {leads.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Landing Page Anfragen
            </span>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Aktive Lizenzen</span>
              <Key className="w-4 h-4 text-success" />
            </div>
            <div className="text-3xl font-extrabold text-success mt-2 font-mono">
              {licenses.filter((l) => l.status === 'active').length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Freigeschaltete Messe-Pässe
            </span>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Offene Anfragen</span>
              <Clock className="w-4 h-4 text-warning" />
            </div>
            <div className="text-3xl font-extrabold text-warning mt-2 font-mono">
              {leads.filter((l) => l.status === 'neu').length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Warten auf Freischaltung
            </span>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Gesamt-Pipeline</span>
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div className="text-3xl font-extrabold text-accent mt-2 font-mono">
              {leads.filter((l) => l.plan === 'expopass').length * 49} €
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Messe-Pass Potenzial (49 €)
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'leads'
                ? 'border-accent text-accent'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leads &amp; Anfragen ({leads.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('licenses')}
            className={`pb-3 px-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'licenses'
                ? 'border-accent text-accent'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Aktive Lizenzen ({licenses.length})</span>
          </button>
        </div>

        {/* Tab 1: Leads Table */}
        {activeTab === 'leads' && (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Eingegangene Messe-Leads</h3>
              <span className="text-xs text-slate-400 font-mono">Live Sync</span>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Noch keine Leads in der Datenbank. Sende ein Test-Formular auf der Landing Page ab!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface text-xs font-mono text-slate-400 border-b border-slate-800 uppercase">
                    <tr>
                      <th className="p-4">Datum</th>
                      <th className="p-4">Kontakt &amp; Firma</th>
                      <th className="p-4">Gewählter Plan</th>
                      <th className="p-4">CRM-System</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 text-xs font-mono text-slate-400">
                          {new Date(lead.created_at).toLocaleDateString('de-DE')}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{lead.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Building className="w-3 h-3 text-accent" />
                            <span>{lead.company}</span>
                            <span>•</span>
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{lead.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                              lead.plan === 'expopass'
                                ? 'bg-accent/20 text-accent border border-accent/40'
                                : lead.plan === 'business'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {lead.plan === 'expopass'
                              ? 'Single Expo Pass (49 €)'
                              : lead.plan === 'business'
                              ? 'Business Pro (29 €)'
                              : 'Starter Trial (0 €)'}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-300">
                          {lead.crm || 'Keine Angabe'}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                              lead.status === 'freigeschaltet'
                                ? 'bg-success/20 text-success'
                                : 'bg-warning/20 text-warning'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => setGeneratingForLead(lead)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-background text-xs font-bold hover:bg-accent-soft transition-all shadow-glow-sm"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>Messe-Pass ausstellen</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Licenses Table */}
        {activeTab === 'licenses' && (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Ausgestellte SmartExpoLink Lizenzen</h3>
              <span className="text-xs text-slate-400 font-mono">Offline-Token &amp; Scan-Limits</span>
            </div>

            {licenses.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Noch keine Lizenzen generiert. Wähle einen Lead aus und stelle einen Messe-Pass aus!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface text-xs font-mono text-slate-400 border-b border-slate-800 uppercase">
                    <tr>
                      <th className="p-4">Lizenzschlüssel</th>
                      <th className="p-4">Kunde / E-Mail</th>
                      <th className="p-4">Paket</th>
                      <th className="p-4">Gültig bis</th>
                      <th className="p-4">Scans Kontingent</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {licenses.map((lic) => (
                      <tr key={lic.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="inline-flex items-center gap-2 bg-surface px-2.5 py-1 rounded-lg border border-slate-700">
                            <span className="font-mono font-bold text-accent text-xs">
                              {lic.license_key}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(lic.license_key)}
                              className="text-slate-400 hover:text-white"
                              title="Schlüssel kopieren"
                            >
                              {copiedKey === lic.license_key ? (
                                <Check className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{lic.company_name}</div>
                          <div className="text-xs text-slate-400">{lic.user_email}</div>
                        </td>
                        <td className="p-4 text-xs font-mono uppercase text-slate-300">
                          {lic.plan_type}
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-300">
                          {new Date(lic.valid_until).toLocaleDateString('de-DE')}
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-300">
                          {lic.used_scans} / {lic.max_scans} Scans
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-success/20 text-success">
                            {lic.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Quick License Generator Modal */}
      {generatingForLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel-elevated rounded-3xl max-w-md w-full p-6 border border-accent/40 shadow-glow space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-accent" />
              <span>Messe-Pass ausstellen</span>
            </h3>

            <p className="text-xs text-slate-300">
              Generiert einen eindeutigen 16-stelligen SmartExpoLink-Lizenzschlüssel für{' '}
              <strong className="text-white">{generatingForLead.name}</strong> ({generatingForLead.company}).
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gültigkeitsdauer (Tage)
                </label>
                <input
                  type="number"
                  value={licenseDays}
                  onChange={(e) => setLicenseDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-slate-700 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Maximales KI-Scan-Kontingent
                </label>
                <input
                  type="number"
                  value={licenseScans}
                  onChange={(e) => setLicenseScans(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-slate-700 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setGeneratingForLead(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={() => handleCreateLicense(generatingForLead)}
                className="px-4 py-2 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-soft shadow-glow-sm"
              >
                Lizenz jetzt erzeugen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Clock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
