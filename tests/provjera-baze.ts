// Ne mijenja podatke u bazi. Pokretanje iz src/:
// node --env-file=.env --import tsx ../tests/provjera-baze.ts
import assert from 'node:assert/strict';
import pool from '../src/connect';
import { activities } from '../src/model/activities.model';
import { trips } from '../src/model/trips.model';
import { events } from '../src/model/events.model';
import { addons } from '../src/model/addons.model';
import { users } from '../src/model/users.model';

let passed = 0;
let failed = 0;
let skipped = 0;

async function check(label: string, action: () => Promise<void>) {
  try { await action(); console.log('PROŠLO  ' + label); passed++; }
  catch (error) { console.log('NIJE PROŠLO  ' + label + ': ' + String(error)); failed++; }
}
function skip(label: string) { console.log('PRESKOČENO  ' + label + ' (nema odgovarajućih podataka)'); skipped++; }
async function firstId(table: string, where = ''): Promise<number | undefined> {
  // Tablice su fiksne u samom programu; ne umeću se korisnički ulazi.
  const allowed = new Set(['activities','activityCategories','trips','tripTags','events','addons','users']);
  if (!allowed.has(table)) throw new Error('Nedopuštena tablica');
  const response = await pool.query(`SELECT id FROM ${table} ${where} ORDER BY id LIMIT 1`);
  return response.rows[0]?.id;
}

async function main() {
  try {
    await pool.query('SELECT 1');
    console.log('Veza s PostgreSQL bazom uspostavljena. Ispitujemo samo metode koje čitaju podatke.');
    const [activityId, categoryId, tripId, tagId, eventId, addonId, userId] = await Promise.all([
      firstId('activities', 'WHERE active = true'),
      firstId('activityCategories','WHERE active = true'),
      firstId('trips','WHERE active = true'),
      firstId('tripTags','WHERE active = true'),
      firstId('events','WHERE tripId IN (SELECT id FROM trips WHERE active = true)'),
      firstId('addons','WHERE active = true'),
      firstId('users','WHERE active = true')
    ]);

    await check('getCategories', async () => assert.ok(Array.isArray(await activities.getCategories())));
    await check('filterActivities(1, 5)', async () => assert.ok(Array.isArray(await activities.filterActivities(1,5))));
    if (activityId !== undefined) await check(`getActivity(${activityId})`, async () => assert.equal((await activities.getActivity(activityId)).id,activityId));
    else skip('getActivity');
    if (categoryId !== undefined) await check(`getCategory(${categoryId})`, async () => assert.equal((await activities.getCategory(categoryId)).id,categoryId));
    else skip('getCategory');
    if (tripId !== undefined) {
      await check(`getTrip(${tripId})`, async () => assert.equal((await trips.getTrip(tripId)).id,tripId));
      await check(`getTripActivities(${tripId})`, async () => assert.ok(Array.isArray(await activities.getTripActivities(tripId))));
      await check(`getTripTags(${tripId})`, async () => assert.ok(Array.isArray(await trips.getTripTags(tripId))));
      await check(`getTripEvents(${tripId})`, async () => assert.ok(Array.isArray(await events.getTripEvents(tripId))));
    } else { skip('getTrip / getTripActivities / getTripTags / getTripEvents'); }
    if (tagId !== undefined) await check(`getTag(${tagId})`, async () => assert.equal((await trips.getTag(tagId)).id,tagId));
    else skip('getTag');
    if (addonId !== undefined) await check(`getAddon(${addonId})`, async () => assert.equal((await addons.getAddon(addonId)).id,addonId));
    else skip('getAddon');
    await check('getFilteredEvents({}, 1, 5)', async () => assert.ok(Array.isArray(await events.getFilteredEvents({},1,5))));
    if (eventId !== undefined) {
      await check(`getEvent(${eventId})`, async () => assert.equal((await events.getEvent(eventId)).id,eventId));
      await check(`getEventAddons(${eventId})`, async () => assert.ok(Array.isArray(await events.getEventAddons(eventId))));
    } else { skip('getEvent / getEventAddons'); }
    if (userId !== undefined) {
      await check(`getUser(${userId})`, async () => assert.equal((await users.getUser(userId)).id,userId));
      await check(`isUser/isAdmin/isOwner/isOrganizer/isGuide(${userId})`, async () => {
        const roles = await Promise.all([users.isUser(userId), users.isAdmin(userId), users.isOwner(userId), users.isOrganizer(userId), users.isGuide(userId)]);
        assert.ok(roles.every(value=>typeof value==='boolean'));
      });
    } else { skip('getUser / provjere uloga'); }
  } catch (error) {
    console.log('BLOKIRANO: provjera baze nije dovršena. ' + String(error));
    process.exitCode = 1;
  } finally {
    console.log(`Sažetak: prošlo ${passed}, nije prošlo ${failed}, preskočeno ${skipped}.`);
    await pool.end();
  }
  if (failed) process.exitCode = 1;
}
void main();
