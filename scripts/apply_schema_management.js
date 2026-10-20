import fs from 'fs';

// Env-Variablen aus Cockpit laden, um SUPABASE_ACCESS_TOKEN wiederzuverwenden
let token = '';
try {
  const envContent = fs.readFileSync('c:/Drive/GitHub/Cockpit/.env.local', 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2 && parts[0].trim() === 'SUPABASE_ACCESS_TOKEN') {
      token = parts.slice(1).join('=').trim().replace(/"/g, '');
    }
  });
} catch (e) {
  console.error("Konnte .env.local aus Cockpit nicht lesen:", e.message);
}

const projectRef = 'xkaitetlqfodjvbxporw';
const sql = fs.readFileSync('schema_smartexpolink_admin.sql', 'utf-8');

console.log("Sende Schema an Supabase Management API für SmartExpoLink:", projectRef);

fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: sql })
})
.then(async res => {
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
  if (res.status >= 400) process.exit(1);
})
.catch(err => {
  console.error("Fehler:", err);
  process.exit(1);
});
