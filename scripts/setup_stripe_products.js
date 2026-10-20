import Stripe from 'stripe';

const sk = process.env.STRIPE_SECRET_KEY;
if (!sk) {
  console.error('Bitte STRIPE_SECRET_KEY als Umgebungsvariable übergeben.');
  process.exit(1);
}

const stripe = new Stripe(sk);

async function setupProducts() {
  console.log('--- Initialisiere SmartExpoLink Produkte in Stripe ---');

  // 1. Single Expo Pass (49 € einmalig)
  const expoProduct = await stripe.products.create({
    name: 'SmartExpoLink Single Expo Pass',
    description: '14 Tage Volllizenz für 1 Messe: Bis zu 300 KI-Scans, Asien-Übersetzer, Lieferanten-Audit, 3 Standnutzer.',
    metadata: {
      plan_type: 'expopass',
      valid_days: '14',
      max_scans: '300',
    },
  });

  const expoPrice = await stripe.prices.create({
    product: expoProduct.id,
    unit_amount: 4900, // 49.00 EUR
    currency: 'eur',
    tax_behavior: 'exclusive',
  });

  console.log('Created Expo Pass:', {
    productId: expoProduct.id,
    priceId: expoPrice.id,
    amount: '49,00 €',
  });

  // 2. Business Pro (29 € / Monat Abo)
  const businessProduct = await stripe.products.create({
    name: 'SmartExpoLink Business Pro',
    description: 'Unbegrenzte KI-Scans, direkter 1-Klick-Sync zu Odoo 19, HubSpot & Salesforce, Team-Dashboard.',
    metadata: {
      plan_type: 'business',
      max_scans: '999999',
    },
  });

  const businessPrice = await stripe.prices.create({
    product: businessProduct.id,
    unit_amount: 2900, // 29.00 EUR
    currency: 'eur',
    recurring: {
      interval: 'month',
    },
    tax_behavior: 'exclusive',
  });

  console.log('Created Business Pro:', {
    productId: businessProduct.id,
    priceId: businessPrice.id,
    amount: '29,00 € / Monat',
  });
}

setupProducts().catch(console.error);
