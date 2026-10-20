-- ====================================================================
-- SmartExpoLink Backend & Admin Schema
-- Project: https://xkaitetlqfodjvbxporw.supabase.co
-- ====================================================================

-- 1. Admin Users Whitelist
CREATE TABLE IF NOT EXISTS public.admin_users (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'superadmin',
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.admin_users (email, role)
VALUES ('info@consulting4kmu.de', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- 2. Leads (Anfragen von der Landing Page)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'expopass',
  crm TEXT DEFAULT 'Odoo 19',
  status TEXT NOT NULL DEFAULT 'neu', -- neu, kontaktiert, freigeschaltet, archiviert
  notes TEXT
);

-- 3. Licenses (Aktive Kunden-Lizenzen für SmartExpoLink)
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT UNIQUE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'expopass', -- starter, expopass, business
  max_scans INT NOT NULL DEFAULT 300,
  used_scans INT NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, expired, suspended
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Helper Function: Automatischer Lizenzschlüssel-Generator
CREATE OR REPLACE FUNCTION public.generate_license_key()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'SEL-';
  i INT;
BEGIN
  FOR i IN 1..4 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  result := result || '-';
  FOR i IN 1..4 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  result := result || '-';
  FOR i IN 1..4 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 5. Helper Function: Is Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies: admin_users
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users" ON public.admin_users
FOR SELECT TO authenticated
USING (public.is_admin());

-- 8. RLS Policies: leads
-- Jeder darf ein Lead-Formular absenden (Anon INSERT)
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
CREATE POLICY "Public can insert leads" ON public.leads
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Nur Admins dürfen Leads lesen und ändern
DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;
CREATE POLICY "Admins can manage leads" ON public.leads
FOR ALL TO authenticated
USING (public.is_admin());

-- 9. RLS Policies: licenses
-- Nur Admins dürfen Lizenzen verwalten
DROP POLICY IF EXISTS "Admins can manage licenses" ON public.licenses;
CREATE POLICY "Admins can manage licenses" ON public.licenses
FOR ALL TO authenticated
USING (public.is_admin());

-- Öffentlicher Lesezugriff auf Lizenzen nur zur Validierung per license_key
DROP POLICY IF EXISTS "Public can validate license" ON public.licenses;
CREATE POLICY "Public can validate license" ON public.licenses
FOR SELECT TO anon, authenticated
USING (status = 'active');
