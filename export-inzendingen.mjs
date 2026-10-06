// Haalt alle inzendingen van een formulier uit PocketBase en schrijft ze als JSON naar export/.
//
//   node --env-file=../me-timer/.env.migratie.local export-inzendingen.mjs taalquiz_inzendingen
//
// Heeft PB_URL, PB_ADMIN_EMAIL en PB_ADMIN_PASSWORD nodig. De map export/ staat in .gitignore:
// de inzendingen bevatten persoonsgegevens en horen niet op GitHub.

import { mkdir, writeFile } from 'node:fs/promises';

const collection = process.argv[2];
if (!collection) {
  console.error('Gebruik: export-inzendingen.mjs <collectie>');
  process.exit(1);
}

const base = process.env.PB_URL;

async function request(path, options = {}) {
  const response = await fetch(base + path, options);
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`);
  return response.json();
}

const { token } = await request('/api/collections/_superusers/auth-with-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identity: process.env.PB_ADMIN_EMAIL, password: process.env.PB_ADMIN_PASSWORD }),
});

const records = [];
for (let page = 1; ; page++) {
  const result = await request(`/api/collections/${collection}/records?perPage=500&page=${page}&sort=created`, {
    headers: { Authorization: token },
  });
  records.push(...result.items);
  if (page >= result.totalPages) break;
}

await mkdir('export', { recursive: true });
const file = `export/${collection}-${new Date().toISOString().slice(0, 10)}.json`;
await writeFile(file, JSON.stringify(records, null, 2));
console.log(`${records.length} inzendingen → ${file}`);
