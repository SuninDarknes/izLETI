// Provjera podudarnosti stanja događaja u TypeScript modelu i testnim podacima.
// Pokretanje: node --test tests/uskladenost.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const model = fs.readFileSync(path.join(root, 'src/model/events.model.ts'), 'utf8');
const dummy = fs.readFileSync(path.join(root, 'docs/baza/dummy_data.sql'), 'utf8');
const block = model.match(/export enum EventState\s*\{([\s\S]*?)\}/);
const seed = dummy.match(/INSERT INTO EventStates\s*\(name\)\s*VALUES([\s\S]*?);/i);
if (!block || !seed) throw new Error('Nije pronađen EventState ili INSERT INTO EventStates');
const enumStates = [...block[1].matchAll(/=\s*"([^"]+)"/g)].map(x=>x[1].toLowerCase()).sort();
const seedStates = [...seed[1].matchAll(/\(\s*'([^']+)'\s*\)/g)].map(x=>x[1].toLowerCase()).sort();
test('KS-01 EventState vrijednosti odgovaraju zapisima u dummy_data.sql', () => {
  assert.deepEqual(enumStates, seedStates,
    'EventState i EventStates u testnim podacima ne sadrže iste nazive stanja');
});
