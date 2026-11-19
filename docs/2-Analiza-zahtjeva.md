# 2. Analiza zahtjeva

## 2.1 Funkcijski zahtjevi

### Prijava i korisničke uloge

| ID | Opis | Prioritet | Izvor | Kriteriji prihvacanja |
| --- | --- | --- | --- | --- |
| F-01 | Prijava putem Google racuna (OAuth). | Visok | Dogovor tima | Korisnik se prijavljuje Google racunom i nakon uspjesne prijave vidi funkcionalnosti svojih uloga; odustajanjem od prijave ostaje neprijavljen. |
| F-02 | Korisnik moze imati vise uloga, a dostupne funkcionalnosti ovise o njegovim ulogama. | Visok | Projektni zadatak | Korisniku s vise uloga dostupne su funkcionalnosti svih njegovih uloga; stranice drugih uloga nisu mu dostupne. |
| F-03 | Admin moze pretrazivati korisnike te im dodjeljivati i oduzimati uloge. | Srednji | Dogovor tima | Admin pronalazi korisnika, dodaje mu ili oduzima ulogu, a promjena vrijedi pri sljedecem zahtjevu tog korisnika. |

### Aktivnosti, izleti i događaji

| ID | Opis | Prioritet | Izvor | Kriteriji prihvacanja |
| --- | --- | --- | --- | --- |
| F-04 | Organiser moze dodati aktivnost s opisom, lokacijom i kategorijom. | Visok | Projektni zadatak | Spremljena aktivnost ima opis, lokaciju i kategoriju te se moze odabrati pri izradi izleta. |
| F-05 | Organiser moze sastaviti izlet od jedne ili vise aktivnosti u odredenom redoslijedu. Moze koristiti i vec postojece aktivnosti. | Visok | Dogovor tima | Spremljeni izlet prikazuje aktivnosti zadanim redoslijedom; ista aktivnost moze biti dio vise izleta. |
| F-06 | Organiser moze napraviti dogadaj na temelju novog ili postojeceg izleta. Dogadaj ima termin i dodijeljenog vodica. | Visok | Projektni zadatak | Spremljeni dogadaj ima izlet, termin i vodica te se prikazuje u popisu dogadaja. |
| F-07 | Organiser odreduje broj slobodnih mjesta na dogadaju i za dodatne usluge. | Visok | Projektni zadatak | Uz dogadaj i svaku dodatnu uslugu prikazuje se uneseni kapacitet i broj slobodnih mjesta. |

### Pregled i rezervacije

| ID | Opis | Prioritet | Izvor | Kriteriji prihvacanja |
| --- | --- | --- | --- | --- |
| F-08 | User moze pregledavati, pretrazivati i sortirati dogadaje prema parametrima poput naziva, datuma, cijene, mjesta polaska, kategorije, trajanja, broja slobodnih mjesta i vodica. | Visok | Projektni zadatak | Odabirom filtera i sortiranja prikazuju se samo dogadaji koji im odgovaraju, zadanim redoslijedom. |
| F-09 | User moze rezervirati dogadaj za odredeni broj osoba i odabrati dostupne dodatne usluge, npr. prijevoz ili najam opreme. | Visok | Projektni zadatak | Nakon predaje rezervacija je spremljena s brojem osoba, odabranim uslugama i pocetnim statusom te je vidljiva u korisnikovim rezervacijama. |
| F-10 | Korisnik prima potvrdu rezervacije e-postom. | Srednji | Projektni zadatak | Nakon potvrde rezervacije korisnik na svoju adresu e-poste prima poruku s osnovnim podacima o dogadaju i rezervaciji. |
| F-11 | User moze pregledavati svoje rezervacije, njihov status, podatke o izletu i aktivnosti na karti te otkazati rezervaciju. | Visok | Projektni zadatak | Korisnik vidi samo svoje rezervacije sa statusom i podacima o izletu; otkazana rezervacija dobiva status otkazane i oslobada mjesta. |
| F-12 | Organiser moze pregledavati i pretrazivati dogadaje i njihove rezervacije te potvrditi ili odbiti rezervaciju. | Visok | Projektni zadatak | Organiser mijenja status rezervacije u potvrdenu ili odbijenu, a novi status vidi i korisnik. |
| F-15 | Sustav automatski vodi racuna o raspolozivom kapacitetu i onemogucuje rezervacije nakon popunjavanja dogadaja ili dodatne usluge. | Visok | Projektni zadatak | Rezervacija koja bi premasila broj slobodnih mjesta odbija se s porukom, a popunjeni dogadaj nije moguce rezervirati. |

### Statistika, karta i digitalni vodic

| ID | Opis | Prioritet | Izvor | Kriteriji prihvacanja |
| --- | --- | --- | --- | --- |
| F-13 | Owner moze pregledavati statistiku broja rezervacija, popunjenosti izleta, prihoda, najtrazenijih aktivnosti i dodatnih usluga. | Srednji | Projektni zadatak | Stranica statistike prikazuje navedene podatke za odabrano razdoblje, uskladene s podacima u bazi. |
| F-14 | Prikaz korisnikove lokacije te lokacija aktivnosti i znamenitosti na karti. | Srednji | Projektni zadatak | Karta prikazuje aktivnosti izleta kao oznake; ako korisnik dopusti geolokaciju, prikazuje se i njegov polozaj. |
| F-16 | Owner moze izvesti odabrane statisticke podatke u standardnom formatu (npr. CSV). | Nizak | Projektni zadatak | Preuzeta datoteka otvara se u programu za tablice i sadrzi iste podatke kao prikaz statistike. |
| F-17 | Tijekom izleta aplikacija na mobilnom uredaju prema GPS lokaciji prepoznaje blizinu aktivnosti izleta i prikazuje osnovne informacije o njoj. | Srednji | Projektni zadatak | Kada je korisnik unutar zadanog radijusa od aktivnosti izleta, prikazuju se njezin naziv, opis i zanimljivosti. |

## 2.2 Nefunkcijski zahtjevi

| ID | Opis | Prioritet | Izvor | Nacin provjere |
| --- | --- | --- | --- | --- |
| NF-01 | Funkcionalnosti su dostupne ovisno o korisnickim ulogama. | Visok | Projektni zadatak | Ispitni scenarij: korisnik bez uloge pokusava otvoriti stranice i API rute druge uloge i biva odbijen. |
| NF-02 | Sucelje treba biti responzivno na racunalima, tabletima i mobilnim uredajima. | Srednji | Projektni zadatak | Pregled glavnih tijekova (pretrazivanje, rezervacija, karta) na sirini mobitela, tableta i racunala. |
| NF-03 | Aplikacija treba podrzavati istovremeni rad vise korisnika. | Srednji | Projektni zadatak | Ispitni scenarij: vise istovremenih rezervacija zadnjih slobodnih mjesta ne smije premasiti kapacitet dogadaja. |

Za responzivnost i istovremeni rad jos nisu odredene brojcane vrijednosti (npr. broj istovremenih korisnika).

## 2.3 Dionici i akteri

| ID aktera | Uloga | Relevantni zahtjevi |
| --- | --- | --- |
| A-01 | User - pregled i rezervacija dogadaja | F-08, F-09, F-10, F-11, F-14, F-17 |
| A-02 | Organiser - upravljanje aktivnostima, izletima, dogadajima i rezervacijama | F-04, F-05, F-06, F-07, F-12 |
| A-03 | Admin - upravljanje korisnickim ulogama | F-03 |
| A-04 | Owner - pregled i izvoz statistike | F-13, F-16 |
| A-05 | Google OAuth - vanjski sustav za prijavu (sekundarni akter) | F-01 |

Vodic je povezan s dogadajem, ali njegove ovlasti u aplikaciji jos nisu definirane pa zasad nije akter.

## 2.4 Ogranicenja i pretpostavke

| ID | Tip | Opis ogranicenja ili pretpostavke | Izvor | Posljedica / provjera |
| --- | --- | --- | --- | --- |
| C-01 | Ogranicenje | Prijava iskljucivo putem Google OAutha; nema lokalnih lozinki. | Dogovor tima | Nema registracije ni oporavka lozinke; uloge se vezu uz Google racun. |
| C-02 | Ogranicenje | Tehnologije: PostgreSQL, TypeScript, Node.js, Express, EJS, Bootstrap. | Dogovor tima | Server-side renderirane stranice; pristup bazi kroz model sloj u `src/model`. |
| C-03 | Ogranicenje | Aplikacija mora raditi na mobilnom uredaju tijekom izleta. | Projektni zadatak | Digitalni vodic je dio web aplikacije i koristi geolokaciju preglednika. |
| AS-01 | Pretpostavka | Svaka aktivnost ima valjane koordinate. | Procjena tima | Provjeriti pri unosu aktivnosti; bez koordinata aktivnost se ne prikazuje na karti. |
| AS-02 | Pretpostavka | Korisnik na izletu dopusta pristup lokaciji i ima mobilnu vezu. | Procjena tima | Ako geolokacija nije dopustena, prikazati kartu i popis aktivnosti bez automatskog prepoznavanja blizine. |
| AS-03 | Pretpostavka | Karta ce koristiti OpenStreetMap i Leaflet. | Procjena tima | Nije konacno potvrdeno; potvrditi prije izrade F-14. |

### Otvorena pitanja

- Pravila otkazivanja i prijelazi izmedu statusa rezervacije (zadatak: zahtjev, potvrdena, otkazana, realizirani izlet; baza: *pending*, odbijena, prihvacena, izlet gotov).
- Zasebna uloga vodica i moguce ocjenjivanje vodica.
- Format izvoza statistike (spominje se CSV).
- Kada se salje obavijest e-postom i sto ona sadrzi.
- Nacin evidencije ostalih resursa organizatora i radijus za prepoznavanje blizine lokacije.

## 2.5 Znacajne promjene zahtjeva

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
|  | F-15, F-16, F-17 | Dodani zahtjevi iz projektnog zadatka koji su bili navedeni samo kao otvorena pitanja (kapacitet, izvoz statistike, GPS digitalni vodic). | Projektni zadatak |
|  | Svi | Dodani prioriteti, izvori i kriteriji prihvacanja. | Predlozak dokumentacije kolegija |

## 2.6 Sljedivost zahtjeva

| ID zahtjeva | Obrazac uporabe | Arhitekturna realizacija | Ispitivanje ili provjera |
| --- | --- | --- | --- |
| F-01 | UC-01 | *na cekanju* (Google login) | *na cekanju* |
| F-02 | UC-01, UC-08 | `users.model.ts` | *na cekanju* |
| F-03 | UC-08 | `/admin` | *na cekanju* |
| F-04 | UC-05 | `activites.routes.ts`, `activities.model.ts` | *na cekanju* |
| F-05 | UC-05 | `trips.routes.ts` | *na cekanju* |
| F-06 | UC-06 | `events.routes.ts` | *na cekanju* |
| F-07 | UC-06 | `events.routes.ts` | *na cekanju* |
| F-08 | UC-02 | `events.routes.ts` (`/events`) | *na cekanju* |
| F-09 | UC-03 | `events.routes.ts` (`/events/:id/reserve`) | *na cekanju* |
| F-10 | UC-03, UC-07 | *na cekanju* (slanje e-poste) | *na cekanju* |
| F-11 | UC-04, UC-10 | `reservations.routes.ts` | *na cekanju* |
| F-12 | UC-07 | `reservations.routes.ts` | *na cekanju* |
| F-13 | UC-09 | `/dashboard` | *na cekanju* |
| F-14 | UC-10, UC-11 | *na cekanju* (karta) | *na cekanju* |
| F-15 | UC-03 | *na cekanju* (provjera slobodnih mjesta) | *na cekanju* |
| F-16 | UC-09 | `/dashboard` | *na cekanju* |
| F-17 | UC-11 | *na cekanju* (digitalni vodic) | *na cekanju* |

## 2.7 Pregled zahtjeva

| Kontrolna tocka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 |  |  |
| Demo 2 |  |  |
| Zavrsni pregled |  |  |
