/**
 * Integracijski testovi metoda koje mijenjaju PostgreSQL podatke.
 * Pokretati samo na lokalnoj bazi izleti_test.
 * Poziva postojeće modele bez izmjene izvornog koda.
 * Na kraju fizički uklanja samo zapise koje je ova skripta stvorila.
 */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import pool from '../src/connect';
import { activities } from '../src/model/activities.model';
import { trips } from '../src/model/trips.model';
import { addons } from '../src/model/addons.model';
import { events, EventState, EventOrdering, SortDirection } from '../src/model/events.model';
import { users, Role } from '../src/model/users.model';

const run = randomUUID().replaceAll('-', '').slice(0, 10);
const prefix = `IT_${run}_`;
const testEmail = `it-${run}@example.invalid`;
const testGoogleId = `it-google-${run}`;
const ids: {
    category?: number; activity1?: number; activity2?: number;
    tag?: number; addon1?: number; addon2?: number;
    trip?: number; event?: number; user?: number;
} = {};

let passed = 0;
let failed = 0;
let cleanupOk = false;

function required(id: number | undefined, label: string): number {
    assert.ok(Number.isSafeInteger(id) && id! > 0, `Nema ID-a: ${label}`);
    return id!;
}

async function step(name: string, fn: () => Promise<void>): Promise<void> {
    try {
        await fn();
        passed++;
        console.log(`PROŠLO | ${name}`);
    } catch (err) {
        failed++;
        console.error(`NIJE PROŠLO | ${name}`);
        console.error(err);
        throw err; // Ne nastavljaj s testovima koji ovise o neuspjelom koraku.
    }
}

async function verifyTestDatabase(): Promise<void> {
    const host = (process.env.DB_HOST ?? 'localhost').toLowerCase();
    const database = process.env.DB_NAME;
    if (!['localhost', '127.0.0.1', '::1'].includes(host) || database !== 'izleti_test') {
        throw new Error('SIGURNOSNA PROVJERA: dopušteno je samo DB_HOST=localhost i DB_NAME=izleti_test.');
    }
    const result = await pool.query<{ database: string }>('SELECT current_database() AS database');
    if (result.rows[0]?.database !== 'izleti_test') {
        throw new Error('Spoj je uspostavljen na neočekivanu bazu. Testiranje prekinuto.');
    }
    const role = await pool.query("SELECT id FROM roles WHERE LOWER(name) = 'user'");
    const organizer = await pool.query("SELECT id FROM roles WHERE LOWER(name) = 'organizer'");
    const scheduled = await pool.query("SELECT id FROM eventstates WHERE LOWER(name) = 'scheduled'");
    if (!role.rowCount || !organizer.rowCount || !scheduled.rowCount) {
        throw new Error('Nedostaju osnovni podaci (uloge User/Organizer ili stanje Scheduled). Učitaj dummy_data.sql.');
    }
    console.log(`Spojeno na lokalnu bazu izleti_test. Oznaka zapisa: ${prefix}`);
}

async function cleanup(): Promise<void> {
    // Ovdje se ne koristi model.delete* jer su to soft-delete metode.
    // Redove brišemo fizički samo ako su vezani uz naše jedinstvene oznake i ID-eve.
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        if (ids.trip && ids.event) {
            const guard = [ids.event, ids.trip, `${prefix}%`];
            await client.query(`
                DELETE FROM eventaddons WHERE eventid = $1
                AND EXISTS (
                    SELECT 1 FROM events e JOIN trips t ON t.id = e.tripid
                    WHERE e.id = $1 AND e.tripid = $2 AND t.name LIKE $3
                )`, guard);
            await client.query(`
                DELETE FROM events WHERE id = $1 AND tripid = $2
                AND EXISTS (SELECT 1 FROM trips WHERE id = $2 AND name LIKE $3)`, guard);
        }
        if (ids.trip) {
            const guard = [ids.trip, `${prefix}%`];
            await client.query(`DELETE FROM tripactivity WHERE tripid = $1 AND EXISTS
                (SELECT 1 FROM trips WHERE id = $1 AND name LIKE $2)`, guard);
            await client.query(`DELETE FROM triptag WHERE tripid = $1 AND EXISTS
                (SELECT 1 FROM trips WHERE id = $1 AND name LIKE $2)`, guard);
            await client.query('DELETE FROM trips WHERE id = $1 AND name LIKE $2', guard);
        }
        for (const id of [ids.activity1, ids.activity2]) {
            if (id) await client.query('DELETE FROM activities WHERE id = $1 AND name LIKE $2', [id, `${prefix}%`]);
        }
        for (const id of [ids.addon1, ids.addon2]) {
            if (id) await client.query('DELETE FROM addons WHERE id = $1 AND name LIKE $2', [id, `${prefix}%`]);
        }
        if (ids.category) {
            await client.query('DELETE FROM activitycategories WHERE id = $1 AND name LIKE $2', [ids.category, `${prefix}%`]);
        }
        if (ids.tag) {
            await client.query('DELETE FROM triptags WHERE id = $1 AND name LIKE $2', [ids.tag, `${prefix}%`]);
        }
        if (ids.user) {
            const guard = [ids.user, testEmail];
            await client.query(`DELETE FROM userrole WHERE userid = $1 AND EXISTS
                (SELECT 1 FROM users WHERE id = $1 AND email = $2)`, guard);
            await client.query('DELETE FROM users WHERE id = $1 AND email = $2', guard);
        }
        await client.query('COMMIT');
        cleanupOk = true;
        console.log('ČIŠĆENJE | Uklonjeni testni zapisi (bez diranja postojećih zapisa).');
    } catch (err) {
        await client.query('ROLLBACK').catch(() => undefined);
        console.error('ČIŠĆENJE NIJE USPJELO. Sačuvaj oznaku i ID-eve ispod:', { prefix, ids });
        console.error(err);
        process.exitCode = 1;
    } finally {
        client.release();
    }
}

async function main(): Promise<void> {
    // Provjera ide prije bilo kakvog upisa i prije try/finally koji radi cleanup.
    await verifyTestDatabase();
    console.log('Početak integracijskih testova upisa.');
    try {
        await step('IT-01 Kategorija: create, get, edit, getCategories', async () => {
            ids.category = await activities.createCategory({ name: `${prefix}kategorija` });
            const id = required(ids.category, 'category');
            assert.equal((await activities.getCategory(id)).name, `${prefix}kategorija`);
            await activities.editCategory({ id, name: `${prefix}nova-kategorija` });
            assert.equal((await activities.getCategory(id)).name, `${prefix}nova-kategorija`);
            assert.ok((await activities.getCategories()).some(c => c.id === id));
        });

        await step('IT-02 Aktivnosti: create, get, edit, filter', async () => {
            const categoryId = required(ids.category, 'category');
            ids.activity1 = await activities.createActivity({
                name: `${prefix}setnja`, description: 'Test', locationName: 'Zagreb',
                latitude: 45.815, longitude: 15.982, durationMinutes: 40, categoryId
            });
            ids.activity2 = await activities.createActivity({
                name: `${prefix}muzej`, description: 'Test', locationName: 'Zagreb',
                latitude: 45.816, longitude: 15.983, durationMinutes: 30, categoryId
            });
            const id = required(ids.activity1, 'activity1');
            assert.equal((await activities.getActivity(id)).name, `${prefix}setnja`);
            await activities.editActivity({
                id, name: `${prefix}setnja-uredena`, description: 'Uređeno', locationName: 'Zagreb',
                latitude: 45.815, longitude: 15.982, durationMinutes: 50, categoryId
            });
            assert.equal((await activities.getActivity(id)).durationMinutes, 50);
            const filtered = await activities.filterActivities(1, 10, categoryId, prefix);
            assert.ok(filtered.some(a => a.id === id));
            assert.ok(filtered.some(a => a.id === ids.activity2));
        });

        await step('IT-03 Tag: create, get, edit', async () => {
            ids.tag = await trips.createTag({ name: `${prefix}tag` });
            const id = required(ids.tag, 'tag');
            assert.equal((await trips.getTag(id)).name, `${prefix}tag`);
            await trips.editTag({ id, name: `${prefix}tag-novi` });
            assert.equal((await trips.getTag(id)).name, `${prefix}tag-novi`);
        });

        await step('IT-04 Dodaci: create, get, edit', async () => {
            ids.addon1 = await addons.createAddon({ name: `${prefix}hrana`, defaultPrice: 5.5 });
            ids.addon2 = await addons.createAddon({ name: `${prefix}prijevoz`, defaultPrice: 9 });
            const id = required(ids.addon1, 'addon1');
            assert.equal((await addons.getAddon(id)).defaultPrice, 5.5);
            await addons.editAddon({ id, name: `${prefix}hrana-uredena`, defaultPrice: 6.75 });
            assert.equal((await addons.getAddon(id)).defaultPrice, 6.75);
        });

        const tripInput = {
            name: `${prefix}izlet`, description: 'Integracijski test izleta', durationMinutes: 100,
            meetingPointLatitude: 45.815, meetingPointLongitude: 15.982,
            maxParticipants: 8, basePrice: 20
        };

        await step('IT-05 Izlet: createTrip, getTrip, redoslijed aktivnosti i tagovi', async () => {
            ids.trip = await trips.createTrip(tripInput,
                [required(ids.activity2, 'activity2'), required(ids.activity1, 'activity1')],
                [required(ids.tag, 'tag')]);
            const trip = await trips.getTrip(required(ids.trip, 'trip'));
            assert.equal(trip.name, tripInput.name);
            assert.deepEqual(trip.activities.map(a => a.id), [ids.activity2, ids.activity1]);
            assert.deepEqual(trip.tags.map(t => t.id), [ids.tag]);
        });

        await step('IT-06 Izlet: editTrip, removeTag, addTag', async () => {
            const id = required(ids.trip, 'trip');
            await trips.editTrip({ ...tripInput, id, name: `${prefix}izlet-ureden` });
            assert.equal((await trips.getTrip(id)).name, `${prefix}izlet-ureden`);
            await trips.removeTag(id, required(ids.tag, 'tag'));
            assert.equal((await trips.getTripTags(id)).length, 0);
            await trips.addTag(id, required(ids.tag, 'tag'));
            assert.equal((await trips.getTripTags(id)).length, 1);
        });

        await step('IT-07 createTrip: neuspjeh poništava transakciju', async () => {
            const badName = `${prefix}neuspjeli-izlet`;
            await assert.rejects(trips.createTrip({ ...tripInput, name: badName }, [-987654321], []));
            const result = await pool.query('SELECT id FROM trips WHERE name = $1', [badName]);
            assert.equal(result.rowCount, 0, 'Nakon ROLLBACK ne smije ostati izlet');
        });

        const start = new Date('2030-06-01T10:00:00');
        await step('IT-08 Događaj: createEvent i getEvent s dodatkom', async () => {
            ids.event = await events.createEvent(
                { startDateTime: start, capacity: 6, state: EventState.Scheduled },
                required(ids.trip, 'trip'),
                [{ addonId: required(ids.addon1, 'addon1'), description: 'Testni obrok', price: 7, capacity: 6 }]
            );
            const event = await events.getEvent(required(ids.event, 'event'));
            assert.equal(event.trip.id, ids.trip);
            assert.equal(event.capacity, 6);
            assert.equal(event.availableAddons.length, 1);
            assert.equal(event.availableAddons[0].addonId, ids.addon1);
            assert.equal(String(event.state).toLowerCase(), 'scheduled');
        });

        await step('IT-09 Događaj: addEventAddon, getTripEvents, filtriranje', async () => {
            const eventId = required(ids.event, 'event');
            await events.addEventAddon(eventId, {
                addonId: required(ids.addon2, 'addon2'), description: 'Testni transfer', price: 10, capacity: 5
            });
            assert.equal((await events.getEventAddons(eventId)).length, 2);
            assert.ok((await events.getTripEvents(required(ids.trip, 'trip'))).includes(eventId));
            const result = await events.getFilteredEvents(
                { nameContains: prefix }, 1, 10,
                { ordering: EventOrdering.byDate, direction: SortDirection.Ascending }
            );
            assert.ok(result.includes(eventId));
        });

        await step('IT-10 Događaj: editEvent i setEventState', async () => {
            const id = required(ids.event, 'event');
            await events.editEvent({ id, startDateTime: start, capacity: 5, state: EventState.Completed });
            assert.equal((await events.getEvent(id)).capacity, 5);
            assert.equal(String((await events.getEvent(id)).state).toLowerCase(), 'completed');
            await events.setEventState(id, EventState.Scheduled);
            assert.equal(String((await events.getEvent(id)).state).toLowerCase(), 'scheduled');
        });

        await step('IT-11 createEvent: nepoznati dodatak poništava transakciju', async () => {
            const tripId = required(ids.trip, 'trip');
            const before = await pool.query<{ total: string }>('SELECT COUNT(*) AS total FROM events WHERE tripid = $1', [tripId]);
            await assert.rejects(events.createEvent(
                { startDateTime: start, capacity: 2, state: EventState.Scheduled }, tripId,
                [{ addonId: -987654321, description: 'Ne postoji', price: 1, capacity: 1 }]
            ));
            const after = await pool.query<{ total: string }>('SELECT COUNT(*) AS total FROM events WHERE tripid = $1', [tripId]);
            assert.equal(after.rows[0].total, before.rows[0].total, 'Nakon ROLLBACK nije smio ostati novi događaj');
        });

        const userData = {
            email: testEmail, googleId: testGoogleId, phone: null, username: `${prefix}korisnik`,
            firstName: 'Test', lastName: 'Korisnik', picture: null, locale: 'hr', emailVerified: true
        };

        await step('IT-12 Korisnik: create, get, getUserByGoogleId i isUser', async () => {
            ids.user = await users.createUser(userData, [Role.User]);
            const id = required(ids.user, 'user');
            assert.equal((await users.getUser(id)).email, testEmail);
            assert.equal((await users.getUserByGoogleId(testGoogleId)).id, id);
            assert.equal(await users.isUser(id), true);
            assert.equal(await users.isOrganizer(id), false);
        });

        await step('IT-13 Korisnik: edit, addRole, removeRole, delete, reactivate', async () => {
            const id = required(ids.user, 'user');
            await users.editUser({ id, phone: null, username: `${prefix}korisnik-novi`,
                firstName: 'Nova', lastName: 'Vrijednost', picture: null, locale: 'hr', emailVerified: true });
            assert.equal((await users.getUser(id)).firstName, 'Nova');
            await users.addRole(id, Role.Organizer);
            assert.equal(await users.isOrganizer(id), true);
            await users.removeRole(id, Role.Organizer);
            assert.equal(await users.isOrganizer(id), false);
            await users.deleteUser(id);
            assert.equal(await users.isUser(id), false);
            await assert.rejects(users.getUser(id));
            await users.reactivateUser(id);
            assert.equal(await users.isUser(id), true);
        });

        await step('IT-14 createUser: nepoznata uloga poništava transakciju', async () => {
            const badEmail = `it-${run}-bad@example.invalid`;
            await assert.rejects(
                users.createUser({ ...userData, email: badEmail, googleId: `${testGoogleId}-bad` },
                    [Role.User, '__nepostojeca__' as Role]),
                /Unknown role/
            );
            const result = await pool.query('SELECT id FROM users WHERE email = $1', [badEmail]);
            assert.equal(result.rowCount, 0, 'Nakon ROLLBACK korisnik ne smije postojati');
        });

        await step('IT-15 Soft delete: izlet, aktivnosti, kategorija, tagovi i dodaci', async () => {
            await trips.removeTrip(required(ids.trip, 'trip'));
            await assert.rejects(trips.getTrip(required(ids.trip, 'trip')));
            await activities.deleteActivity(required(ids.activity1, 'activity1'));
            await assert.rejects(activities.getActivity(required(ids.activity1, 'activity1')));
            await activities.deleteActivity(required(ids.activity2, 'activity2'));
            await trips.deleteTag(required(ids.tag, 'tag'));
            await assert.rejects(trips.getTag(required(ids.tag, 'tag')));
            await addons.deleteAddon(required(ids.addon1, 'addon1'));
            await assert.rejects(addons.getAddon(required(ids.addon1, 'addon1')));
            await addons.deleteAddon(required(ids.addon2, 'addon2'));
            await activities.deleteCategory(required(ids.category, 'category'));
            await assert.rejects(activities.getCategory(required(ids.category, 'category')));
        });
    } finally {
        await cleanup();
    }
}

main().catch((err) => {
    if (failed === 0) {
        console.error('Testiranje nije ni započelo ili je prekinuto prije testova:', err);
    }
    process.exitCode = 1;
}).finally(async () => {
    console.log(`SAŽETAK | prošlo: ${passed} | nije prošlo: ${failed} | čišćenje: ${cleanupOk ? 'OK' : 'NIJE POTVRĐENO'}`);
    await pool.end().catch((err) => {
        console.error('Zatvaranje veze s bazom nije uspjelo:', err);
        process.exitCode = 1;
    });
});
