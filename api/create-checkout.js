import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product Price Mapping
const PRICE_MAP = {
  expopass: process.env.STRIPE_PRICE_EXPOPASS || 'price_1USdJFCoCvBuk2QAZwtqybqS', // 49,00 € Einmalkauf
  business: process.env.STRIPE_PRICE_BUSINESS || 'price_1USdJGCoCvBuk2QAAnqSVBwX', // 29,00 € / Monat Abo
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { plan = 'expopass', customerEmail = '', companyName = '', successUrl, cancelUrl } = req.body;

  const priceId = PRICE_MAP[plan];
  if (!priceId) {
    return res.status(400).json({ error: 'Ungültiger Plan ausgewählt' });
  }

  const isSubscription = plan === 'business';
  const origin = req.headers.origin || 'https://smartexpolink.com';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Automatische B2B USt-IdNr. Abfrage & Validierung
      tax_id_collection: {
        enabled: true,
      },
      // Automatische Steuerberechnung (Stripe Tax)
      automatic_tax: {
        enabled: true,
      },
      // Bei Einmalkauf (Single Expo Pass) automatische B2B-PDF-Rechnung erstellen
      ...(isSubscription
        ? {}
        : {
            invoice_creation: {
              enabled: true,
              invoice_data: {
                description: 'SmartExpoLink Single Expo Pass (14 Tage Volllizenz)',
                metadata: { companyName, plan },
              },
            },
          }),
      customer_email: customerEmail ? customerEmail.trim().toLowerCase() : undefined,
      metadata: {
        plan,
        companyName,
        customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : undefined,
      },
      success_url: successUrl || `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/#pricing`,
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('Stripe Checkout Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
