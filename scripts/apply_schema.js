import https from 'https';
import fs from 'fs';

const SUPABASE_URL = 'https://xkaitetlqfodjvbxporw.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrYWl0ZXRscWZvZGp2Ynhwb3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjQ5Njg5NywiZXhwIjoyMTA4MDcyODk3fQ.oyCqclxzvnkLApHbnCOoWODDNCLO5HDvN3t9XBaoMkc';

const sql = fs.readFileSync('schema_smartexpolink_admin.sql', 'utf8');

const postData = JSON.stringify({ query: sql });

const options = {
  hostname: 'xkaitetlqfodjvbxporw.supabase.co',
  port: 443,
  path: '/pg/query',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'apikey': SERVICE_ROLE_KEY,
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log(`HTTP Status: ${res.statusCode}`);
    console.log(`Response: ${body}`);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.write(postData);
req.end();
