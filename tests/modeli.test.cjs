// Testovi modela bez stvarne PostgreSQL baze.
// Pokretanje iz korijena projekta: node --test tests/modeli.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const Module = require('node:module');
const { createRequire } = Module;

const project = path.resolve(__dirname, '..');
const srcRequire = createRequire(path.join(project, 'src', 'package.json'));
let esbuild;
try { esbuild = srcRequire('esbuild'); }
catch {
  throw new Error('Nedostaje esbuild (ovisnost paketa tsx). Pokreni: cd src && npm install');
}

class FakePool {
  constructor() { this.calls = []; this.steps = []; this.releases = 0; }
  reset(...steps) { this.calls = []; this.steps = [...steps]; this.releases = 0; }
  async query(sql, params = []) {
    const statement = String(sql).replace(/\s+/g, ' ').trim();
    this.calls.push({ sql: statement, params });
    if (!this.steps.length) throw new Error('Test nije pripremio odgovor za SQL: ' + statement);
    const step = this.steps.shift();
    if (step instanceof Error) throw step;
    return (typeof step === 'function') ? step(statement, params) : step;
  }
  async connect() {
    return { query: (sql, params) => this.query(sql, params), release: () => { this.releases++; } };
  }
}
const response = (rows = [], rowCount = rows.length) => ({ rows, rowCount });
const originalLoad = Module._load;
const originalTs = Module._extensions['.ts'];
Module._load = function (request, parent, isMain) {
  if (request === 'pg') return { Pool: FakePool, default: { Pool: FakePool } };
  return originalLoad.call(this, request, parent, isMain);
};
Module._extensions['.ts'] = function(module, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const out = esbuild.transformSync(source, {
    sourcefile: filename,
    loader: 'ts',
    format: 'cjs',
    target: 'es2020'
  });
  module._compile(out.code, filename);
};
const { pool } = require('../src/connect.ts');
const { NotFoundError } = require('../src/errors.ts');
const { activities } = require('../src/model/activities.model.ts');
const { addons } = require('../src/model/addons.model.ts');
const { trips } = require('../src/model/trips.model.ts');
const { events, EventState, EventOrdering, SortDirection } = require('../src/model/events.model.ts');
const { users, Role } = require('../src/model/users.model.ts');
Module._load = originalLoad;
if (originalTs) Module._extensions['.ts'] = originalTs;
else delete Module._extensions['.ts'];

const activity = { name: 'Šetnja', description: 'Opis', locationName: 'Centar', latitude: 45.8, longitude: 16.0, durationMinutes: 90, categoryId: 2 };
const activityRow = { id: 7, name: 'Šetnja', description: 'Opis', locationname: 'Centar', latitude: '45.800000', longitude: '16.000000', durationminutes: 90, categoryid: 2, active: true, categoryname: 'Razgledavanje' };
const trip = { name: 'Rim', description: 'Opis izleta', durationMinutes: 240, meetingPointLatitude: 41.9, meetingPointLongitude: 12.5, maxParticipants: 20, basePrice: 45 };
const tripRow = { id: 12, name: 'Rim', description: 'Opis izleta', durationminutes: 240, meetingpointlatitude: '41.900000', meetingpointlongitude: '12.500000', maxparticipants: 20, baseprice: '45.00', createdat: new Date('2026-11-10T12:00:00Z'), active: true };
const user = { email: 'test@example.com', phone: null, username: 'test', firstName: 'Ime', lastName: 'Prezime', picture: null, locale: 'hr', emailVerified: true, googleId: 'google-test' };
const userRow = { ...user, id: 9, googleid: 'google-test', firstname: 'Ime', lastname: 'Prezime', emailverified: true, createdat: new Date('2026-11-10T12:00:00Z'), active: true };
function last() { return pool.calls.at(-1); }
function checkSql(regex) { assert.match(last().sql, regex); }

// AKTIVNOSTI

test('CT-01 createActivity: upis i ID', async () => {
  pool.reset(response([{id:7}]));
  assert.equal(await activities.createActivity(activity), 7);
  checkSql(/INSERT INTO activities.*active.*true/i);
  assert.deepEqual(last().params, ['Šetnja', 'Opis', 'Centar', 16, 45.8, 90, 2]);
});
test('CT-02 getActivity: pretvorba koordinata', async () => {
  pool.reset(response([activityRow]));
  assert.deepEqual(await activities.getActivity(7), { id:7, ...activity, categoryName:'Razgledavanje' });
});
test('CT-03 getActivity: nepostojeći ID', async () => {
  pool.reset(response([]));
  await assert.rejects(activities.getActivity(999), NotFoundError);
});
test('CT-04 editActivity: promjena i nepostojeći ID', async () => {
  pool.reset(response([],1), response([],0));
  await activities.editActivity({id:7,...activity});
  checkSql(/UPDATE activities/i);
  await assert.rejects(activities.editActivity({id:999,...activity}), NotFoundError);
});
test('CT-05 deleteActivity: meko brisanje', async () => {
  pool.reset(response([],1));
  await activities.deleteActivity(7);
  checkSql(/SET active = false/i);
});
test('CT-06 filterActivities: stranica i filter', async () => {
  pool.reset(response([activityRow]));
  const a = await activities.filterActivities(2, 3, 2, 'Šet');
  assert.equal(a.length, 1);
  assert.deepEqual(last().params, [2, 'Šet', 3, 3]);
  checkSql(/ORDER BY a.name/i);
});
test('CT-07 filterActivities: nedopuštena paginacija', async () => {
  pool.reset();
  for (const [p, n] of [[0,10],[1,0],[1,1001]])
    await assert.rejects(activities.filterActivities(p, n), /Invalid paging parameters/);
  assert.equal(pool.calls.length, 0);
});
test('CT-08 getTripActivities: vraća rezultate redoslijedom baze', async () => {
  pool.reset(response([activityRow, {...activityRow,id:8,name:'Muzej'}]));
  const rows = await activities.getTripActivities(12);
  assert.deepEqual(rows.map(x=>x.id), [7,8]);
  checkSql(/ORDER BY ta.sequenceOrder/i);
});
test('CT-09 kategorije: create, get, edit, delete, getCategories', async () => {
  pool.reset(response([{id:2}]), response([{id:2,name:'Priroda',active:true}]),response([],1),response([],1),response([{id:2,name:'Priroda',active:true}]));
  assert.equal(await activities.createCategory({name:'Priroda'}),2);
  assert.deepEqual(await activities.getCategory(2),{id:2,name:'Priroda'});
  await activities.editCategory({id:2,name:'Priroda'});
  await activities.deleteCategory(2);
  assert.deepEqual(await activities.getCategories(),[{id:2,name:'Priroda'}]);
});
test('CT-10 getCategory: nepostojeći ID', async () => {
  pool.reset(response([]));
  await assert.rejects(activities.getCategory(999), NotFoundError);
});

// DODACI

test('CT-11 createAddon i getAddon: cijena iz NUMERIC', async () => {
  pool.reset(response([{id:4}]),response([{id:4,name:'Ručak',defaultprice:'12.50',active:true}]));
  assert.equal(await addons.createAddon({name:'Ručak',defaultPrice:12.5}),4);
  assert.deepEqual(await addons.getAddon(4),{id:4,name:'Ručak',defaultPrice:12.5});
});
test('CT-12 getAddon: nepostojeći ID', async () => {
  pool.reset(response([]));
  await assert.rejects(addons.getAddon(999), NotFoundError);
});
test('CT-13 editAddon i deleteAddon', async () => {
  pool.reset(response([],1),response([],1));
  await addons.editAddon({id:4,name:'Ručak',defaultPrice:13});
  await addons.deleteAddon(4);
  checkSql(/SET active = false/i);
});
test('CT-14 addons.exists: postoji/ne postoji', async () => {
  pool.reset(response([{id:4}]),response([]));
  assert.equal(await addons.exists(4),true);
  assert.equal(await addons.exists(999),false);
});

// IZLETI

test('CT-15 createTrip: transakcija i redoslijed aktivnosti', async () => {
  pool.reset(response(),response([{id:12}]),response([],1),response([],1),response([],1),response());
  assert.equal(await trips.createTrip(trip,[7,8],[3]),12);
  assert.match(pool.calls[0].sql,/^BEGIN$/);
  assert.match(pool.calls.at(-1).sql,/^COMMIT$/);
  const seq = pool.calls.filter(x=>/INSERT INTO TripActivity/i.test(x.sql));
  assert.deepEqual(seq.map(x=>x.params[0]),[0,1]);
  assert.equal(pool.releases,1);
});
test('CT-16 createTrip: ROLLBACK nakon greške', async () => {
  pool.reset(response(),response([{id:12}]),new Error('FK violation'),response());
  await assert.rejects(trips.createTrip(trip,[999],[]),/FK violation/);
  assert.match(pool.calls.at(-1).sql,/^ROLLBACK$/);
  assert.equal(pool.releases,1);
});
test('CT-17 getTrip: pripaja aktivnosti i tagove', async () => {
  pool.reset(response([tripRow]),response([activityRow]),response([{id:3,name:'Povijest'}]));
  const result = await trips.getTrip(12);
  assert.equal(result.id,12);
  assert.deepEqual(result.activities.map(x=>x.id),[7]);
  assert.deepEqual(result.tags,[{id:3,name:'Povijest'}]);
  assert.equal(result.basePrice,45);
});
test('CT-18 getTrip: nepostojeći ID', async () => {
  pool.reset(response([]));
  await assert.rejects(trips.getTrip(999), NotFoundError);
});
test('CT-19 editTrip i removeTrip', async () => {
  pool.reset(response([],1),response([],1));
  await trips.editTrip({id:12,...trip});
  await trips.removeTrip(12);
  checkSql(/SET active = false/i);
});
test('CT-20 tagovi: create, get, edit, delete', async () => {
  pool.reset(response([{id:3}]),response([{id:3,name:'Povijest'}]),response([],1),response([],1));
  assert.equal(await trips.createTag({name:'Povijest'}),3);
  assert.deepEqual(await trips.getTag(3),{id:3,name:'Povijest'});
  await trips.editTag({id:3,name:'Povijest'});
  await trips.deleteTag(3);
});
test('CT-21 tagovi izleta: dodaj, dohvati i makni', async () => {
  pool.reset(response([],1),response([{id:3,name:'Povijest'}]),response([],1));
  await trips.addTag(12,3);
  assert.deepEqual(await trips.getTripTags(12),[{id:3,name:'Povijest'}]);
  await trips.removeTag(12,3);
});
test('CT-22 removeTag: nema veze', async () => {
  pool.reset(response([],0));
  await assert.rejects(trips.removeTag(12,999),NotFoundError);
});
test('CT-23 trips.exists: postoji/ne postoji', async () => {
  pool.reset(response([{id:12}]),response([]));
  assert.equal(await trips.exists(12),true);
  assert.equal(await trips.exists(999),false);
});

// DOGAĐAJI

test('CT-24 createEvent: transakcija i dodatak', async () => {
  const newEvent = {startDateTime:new Date('2027-05-10T10:00:00Z'), capacity:15, state:EventState.Scheduled};
  const item = {addonId:4,description:'Ručak',price:12.5,capacity:10};
  pool.reset(response(),response([{id:12}]),response([{id:21}]),response([{id:21}]),response([{id:4}]),response([],1),response());
  assert.equal(await events.createEvent(newEvent,12,[item]),21);
  assert.match(pool.calls.at(-1).sql,/^COMMIT$/);
  assert.ok(pool.calls.some(x=>/INSERT INTO eventAddons/i.test(x.sql)));
  assert.equal(pool.releases,1);
});
test('CT-25 createEvent: nepostojeći izlet uz ROLLBACK', async () => {
  pool.reset(response(),response([]),response());
  await assert.rejects(events.createEvent({startDateTime:new Date(),capacity:10,state:EventState.Scheduled},999,[]),NotFoundError);
  assert.match(pool.calls.at(-1).sql,/^ROLLBACK$/);
  assert.equal(pool.releases,1);
});
test('CT-26 getFilteredEvents: kombinirani filtri', async () => {
  pool.reset(response([{id:21},{id:22}]));
  const items = await events.getFilteredEvents({nameContains:'Rim',tagIds:[3,4],states:[EventState.Scheduled],priceFrom:0},2,5,{ordering:EventOrdering.byDate,direction:SortDirection.Descending});
  assert.deepEqual(items,[21,22]);
  assert.deepEqual(last().params,['%Rim%',0,[3,4],['scheduled'],5,5]);
  checkSql(/ORDER BY e.startDateTime DESC/i);
});
test('CT-27 getFilteredEvents: neispravna paginacija i sortiranje', async () => {
  pool.reset();
  await assert.rejects(events.getFilteredEvents({},0,10),/Invalid paging parameters/);
  await assert.rejects(events.getFilteredEvents({},1,10,{ordering:'DROP TABLE',direction:SortDirection.Ascending}),/Invalid sort parameters/);
  assert.equal(pool.calls.length,0);
});
test('CT-28 getTripEvents: ID-ovi događaja', async () => {
  pool.reset(response([{id:12}]),response([{id:21},{id:22}]));
  assert.deepEqual(await events.getTripEvents(12),[21,22]);
});
test('CT-29 getEvent: nepostojeći ID', async () => {
  pool.reset(response([]));
  await assert.rejects(events.getEvent(999),NotFoundError);
});
test('CT-30 editEvent i setEventState', async () => {
  const newEvent = {startDateTime:new Date('2027-05-10T10:00:00Z'), capacity:15, state:EventState.Scheduled};
  pool.reset(response([],1),response([],1));
  await events.editEvent({id:21,...newEvent});
  await events.setEventState(21,EventState.Cancelled);
  assert.deepEqual(last().params,[21,'cancelled']);
});
test('CT-31 getEventAddons: aktivni dodatak i NUMERIC', async () => {
  pool.reset(response([{id:21}]),response([{id:5,addonid:4,name:'Ručak',description:'Obrok',price:'12.50',capacity:10}]));
  assert.deepEqual(await events.getEventAddons(21),[{id:5,addonId:4,name:'Ručak',description:'Obrok',price:12.5,capacity:10}]);
  checkSql(/ea.active = true/i);
});
test('CT-32 addEventAddon: nepostojeći dodatak', async () => {
  pool.reset(response([{id:21}]),response([]));
  await assert.rejects(events.addEventAddon(21,{addonId:999,description:'X',price:0,capacity:1}),NotFoundError);
});
test('CT-33 events.exists: postoji/ne postoji', async () => {
  pool.reset(response([{id:21}]),response([]));
  assert.equal(await events.exists(21),true);
  assert.equal(await events.exists(999),false);
});

// KORISNICI

test('CT-34 createUser: zadana uloga i transakcija', async () => {
  pool.reset(response(),response([{id:9}]),response([],1),response());
  assert.equal(await users.createUser(user),9);
  assert.deepEqual(pool.calls[2].params,[9,'user']);
  assert.match(pool.calls.at(-1).sql,/^COMMIT$/);
});
test('CT-35 createUser: ponovljene uloge se uklanjaju', async () => {
  pool.reset(response(),response([{id:9}]),response([],1),response([],1),response());
  assert.equal(await users.createUser(user,[Role.User,Role.Admin,Role.User]),9);
  const roleInserts = pool.calls.filter(x=>/INSERT INTO userRole/i.test(x.sql));
  assert.deepEqual(roleInserts.map(x=>x.params[1]),['user','admin']);
});
test('CT-36 createUser: nepoznata uloga poništava unos', async () => {
  pool.reset(response(),response([{id:9}]),response([],0),response());
  await assert.rejects(users.createUser(user,['invalid']),/Unknown role/);
  assert.match(pool.calls.at(-1).sql,/^ROLLBACK$/);
  assert.equal(pool.releases,1);
});
test('CT-37 getUser: pretvorba naziva polja', async () => {
  pool.reset(response([userRow]));
  const result = await users.getUser(9);
  assert.equal(result.googleId,'google-test');
  assert.equal(result.firstName,'Ime');
  assert.equal(result.lastName,'Prezime');
});
test('CT-38 getUserByGoogleId: nepostojeći račun', async () => {
  pool.reset(response([]));
  await assert.rejects(users.getUserByGoogleId('missing'),NotFoundError);
});
test('CT-39 editUser, deleteUser, reactivateUser', async () => {
  pool.reset(response([],1),response([],1),response([],1));
  await users.editUser({id:9,phone:null,username:'test',firstName:'Ime',lastName:'Prezime',picture:null,locale:'hr',emailVerified:true});
  await users.deleteUser(9);
  assert.match(last().sql,/active = false/i);
  await users.reactivateUser(9);
  assert.match(last().sql,/active = true/i);
});
test('CT-40 addRole i removeRole', async () => {
  pool.reset(response([],1),response([],1));
  await users.addRole(9,Role.Guide);
  await users.removeRole(9,Role.Guide);
  assert.deepEqual(last().params,[9,'guide']);
});
test('CT-41 role provjere: user, admin, owner, organizer, guide', async () => {
  pool.reset(response([{one:1}]),response([]),response([]),response([]),response([{one:1}]));
  assert.equal(await users.isUser(9),true);
  assert.equal(await users.isAdmin(9),false);
  assert.equal(await users.isOwner(9),false);
  assert.equal(await users.isOrganizer(9),false);
  assert.equal(await users.isGuide(9),true);
  assert.deepEqual(pool.calls.map(x=>x.params[1]),['user','admin','owner','organizer','guide']);
});
test('CT-42 getEvent: povezuje izlet i dodatke', async () => {
  const eventRow = {id:21,startdatetime:new Date('2027-05-10T10:00:00Z'),capacity:15,state:'scheduled',tripid:12};
  const eventAddon = {id:5,addonid:4,name:'Ručak',description:'Obrok',price:'12.50',capacity:10};
  pool.reset(response([eventRow]),response([tripRow]),response([{id:21}]),response([activityRow]),response([{id:3,name:'Povijest'}]),response([eventAddon]));
  const result = await events.getEvent(21);
  assert.equal(result.id,21);
  assert.equal(result.state,'scheduled');
  assert.equal(result.trip.id,12);
  assert.equal(result.trip.activities[0].id,7);
  assert.equal(result.availableAddons[0].price,12.5);
});
