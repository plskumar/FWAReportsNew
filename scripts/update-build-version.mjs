import { readFile, writeFile } from 'node:fs/promises';

const versionPath = new URL('../build-version.json', import.meta.url);
const current = JSON.parse(await readFile(versionPath, 'utf8'));
const parts = String(current.version || '1.0.0.0').split('.').map(Number);
while (parts.length < 4) parts.push(0);
parts[3] = (parts[3] || 0) + 1;

const builtAt = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'short',
  timeStyle: 'medium',
  hour12: false,
  timeZone: 'UTC'
}).format(new Date()).replace(',', '') + ' UTC';

await writeFile(versionPath, `${JSON.stringify({ version: parts.join('.'), builtAt }, null, 2)}\n`);
