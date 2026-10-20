import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateLicenseKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let key = 'SEL-';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 2) key += '-';
  }
  return key;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Falls STRIPE_WEBHOOK_SECRET konfiguriert ist, signieren
    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Erfolgreiche Zahlung verarbeiten
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email || session.metadata?.customerEmail;
    const companyName = session.customer_details?.name || session.metadata?.companyName || 'Messekunde';
    const plan = session.metadata?.plan || (session.mode === 'subscription' ? 'business' : 'expopass');

    console.log(`Zahlung erfolgreich für ${customerEmail} (Plan: ${plan})`);

    // 1. Lizenzschlüssel erzeugen
    const licenseKey = generateLicenseKey();
    const validUntil = new Date();
    
    if (plan === 'expopass') {
      validUntil.setDate(validUntil.getDate() + 14); // 14 Tage Expo Pass
    } else {
      validUntil.setDate(validUntil.getDate() + 31); // 1 Monat Abo
    }

    const maxScans = plan === 'expopass' ? 300 : 999999;

    // 2. In Supabase `licenses` Tabelle eintragen
    const { data: licenseData, error: licError } = await supabase.from('licenses').insert([
      {
        license_key: licenseKey,
        user_email: customerEmail,
        company_name: companyName,
        plan_type: plan,
        max_scans: maxScans,
        used_scans: 0,
        valid_until: validUntil.toISOString(),
        status: 'active',
      },
    ]);

    if (licError) {
      console.error('Fehler beim Speichern der Lizenz in Supabase:', licError);
    } else {
      console.log(`Lizenz ${licenseKey} erfolgreich in Supabase hinterlegt!`);
    }

    // 3. Lead-Status aktualisieren (falls vorhanden)
    if (customerEmail) {
      await supabase
        .from('leads')
        .update({ status: 'freigeschaltet' })
        .eq('email', customerEmail);
    }
  }

  return res.status(200).json({ received: true });
}
