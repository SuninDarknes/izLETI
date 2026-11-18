# 2. Analiza zahtjeva

## 2.1 Funkcijski zahtjevi

### Prijava i korisničke uloge

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-01 | Prijava putem Google računa (OAuth). | Visok | Dogovor tima | Korisnik se prijavljuje Google računom i nakon uspješne prijave vidi funkcionalnosti svojih uloga; odustajanjem od prijave ostaje neprijavljen. |
| F-02 | Korisnik može imati više uloga, a dostupne funkcionalnosti ovise o njegovim ulogama. | Visok | Projektni zadatak | Korisniku s više uloga dostupne su funkcionalnosti svih njegovih uloga; stranice drugih uloga nisu mu dostupne. |
| F-03 | Admin može pretraživati korisnike te im dodjeljivati i oduzimati uloge. | Srednji | Dogovor tima | Admin pronalazi korisnika, dodaje mu ili oduzima ulogu, a promjena vrijedi pri sljedećem zahtjevu tog korisnika. |

### Aktivnosti, izleti i događaji

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-04 | Organiser može dodati aktivnost s opisom, lokacijom i kategorijom. | Visok | Projektni zadatak | Spremljena aktivnost ima opis, lokaciju i kategoriju te se može odabrati pri izradi izleta. |
| F-05 | Organiser može sastaviti izlet od jedne ili više aktivnosti u određenom redoslijedu. Može koristiti i već postojeće aktivnosti. | Visok | Dogovor tima | Spremljeni izlet prikazuje aktivnosti zadanim redoslijedom; ista aktivnost može biti dio vise izleta. |
| F-06 | Organiser može napraviti događaj na temelju novog ili postojećeg izleta. Događaj ima termin i dodijeljenog vodiča. | Visok | Projektni zadatak | Spremljeni događaj ima izlet, termin i vodiča te se prikazuje u popisu događaja. |
| F-07 | Organiser određuje broj slobodnih mjesta na događaju i za dodatne usluge. | Visok | Projektni zadatak | Uz događaj i svaku dodatnu uslugu prikazuje se uneseni kapacitet i broj slobodnih mjesta. |

### Pregled i rezervacije

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-08 | User može pregledavati, pretraživati i sortirati događaje prema parametrima poput naziva, datuma, cijene, mjesta polaska, kategorije, trajanja, broja slobodnih mjesta i vodiča. | Visok | Projektni zadatak | Odabirom filtera i sortiranja prikazuju se samo događaji koji im odgovaraju, zadanim redoslijedom. |
| F-09 | User može rezervirati događaj za određeni broj osoba i odabrati dostupne dodatne usluge, npr. prijevoz ili najam opreme. | Visok | Projektni zadatak | Nakon predaje rezervacija je spremljena s brojem osoba, odabranim uslugama i početnim statusom te je vidljiva u korisnikovim rezervacijama. |
| F-10 | Korisnik prima potvrdu rezervacije e-poštom. | Srednji | Projektni zadatak | Nakon potvrde rezervacije korisnik na svoju adresu e-pošte prima poruku s osnovnim podacima o događaju i rezervaciji. |
| F-11 | User može pregledavati svoje rezervacije, njihov status, podatke o izletu i aktivnosti na karti te otkazati rezervaciju. | Visok | Projektni zadatak | Korisnik vidi samo svoje rezervacije sa statusom i podacima o izletu; otkazana rezervacija dobiva status otkazane i oslobađa mjesta. |
| F-12 | Organiser može pregledavati i pretraživati događaje i njihove rezervacije te potvrditi ili odbiti rezervaciju. | Visok | Projektni zadatak | Organiser mijenja status rezervacije u potvrđenu ili odbijenu, a novi status vidi i korisnik. |
| F-15 | Sustav automatski vodi računa o raspoloživom kapacitetu i onemogućuje rezervacije nakon popunjavanja događaja ili dodatne usluge. | Visok | Projektni zadatak | Rezervacija koja bi premašila broj slobodnih mjesta odbija se s porukom, a popunjeni događaj nije moguće rezervirati. |

### Statistika, karta i digitalni vodič

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-13 | Owner može pregledavati statistiku broja rezervacija, popunjenosti izleta, prihoda, najtraženijih aktivnosti i dodatnih usluga. | Srednji | Projektni zadatak | Stranica statistike prikazuje navedene podatke za odabrano razdoblje, usklađene s podacima u bazi. |
| F-14 | Prikaz korisnikove lokacije te lokacija aktivnosti i znamenitosti na karti. | Srednji | Projektni zadatak | Karta prikazuje aktivnosti izleta kao oznake; ako korisnik dopusti geolokaciju, prikazuje se i njegov položaj. |
| F-16 | Owner može izvesti odabrane statističke podatke u standardnom formatu (npr. CSV). | Nizak | Projektni zadatak | Preuzeta datoteka otvara se u programu za tablice i sadrži iste podatke kao prikaz statistike. |
| F-17 | Tijekom izleta aplikacija na mobilnom uređaju prema GPS lokaciji prepoznaje blizinu aktivnosti izleta i prikazuje osnovne informacije o njoj. | Srednji | Projektni zadatak | Kada je korisnik unutar zadanog radijusa od aktivnosti izleta, prikazuju se njezin naziv, opis i zanimljivosti. |

## 2.2 Nefunkcijski zahtjevi

| ID | Opis | Prioritet | Izvor | Način provjere |
| --- | --- | --- | --- | --- |
| NF-02 | Sučelje treba biti responzivno na računalima, tabletima i mobilnim uređajima. | Srednji | Projektni zadatak | Pregled glavnih tijekova (pretraživanje, rezervacija, karta) na širini mobitela, tableta i računala. |
| NF-03 | Aplikacija treba podržavati istovremeni rad više korisnika. | Srednji | Projektni zadatak | Ispitni scenarij: više istovremenih rezervacija zadnjih slobodnih mjesta ne smije premašiti kapacitet događaja. |

Za responzivnost i istovremeni rad još nisu određene brojčane vrijednosti (npr. broj istovremenih korisnika).

## 2.3 Dionici i akteri

| ID aktera | Uloga | Relevantni zahtjevi |
| --- | --- | --- |
| A-01 | User - pregled i rezervacija događaja | F-08, F-09, F-10, F-11, F-14, F-17 |
| A-02 | Organiser - upravljanje aktivnostima, izletima, događajima i rezervacijama | F-04, F-05, F-06, F-07, F-12 |
| A-03 | Admin - upravljanje korisničkim ulogama | F-03 |
| A-04 | Owner - pregled i izvoz statistike | F-13, F-16 |
| A-05 | Google OAuth - vanjski sustav za prijavu (sekundarni akter) | F-01 |

Vodič je povezan s događajem, ali njegove ovlasti u aplikaciji još nisu definirane pa zasad nije akter.

## 2.4 Ograničenja i pretpostavke

| ID | Tip | Opis ograničenja ili pretpostavke | Izvor | Posljedica / provjera |
| --- | --- | --- | --- | --- |
| C-01 | Ograničenje | Prijava isključivo putem Google OAutha; nema lokalnih lozinki. | Dogovor tima | Nema registracije ni oporavka lozinke; uloge se vežu uz Google račun. |
| C-02 | Ograničenje | Tehnologije: PostgreSQL, TypeScript, Node.js, Express, EJS, Bootstrap. | Dogovor tima | Server-side renderirane stranice; pristup bazi kroz model sloj u `src/model`. |
| C-03 | Ograničenje | Aplikacija mora raditi na mobilnom uređaju tijekom izleta. | Projektni zadatak | Digitalni vodič je dio web aplikacije i koristi geolokaciju preglednika. |
| AS-01 | Pretpostavka | Svaka aktivnost ima valjane koordinate. | Procjena tima | Provjeriti pri unosu aktivnosti; bez koordinata aktivnost se ne prikazuje na karti. |
| AS-02 | Pretpostavka | Korisnik na izletu dopušta pristup lokaciji i ima mobilnu vezu. | Procjena tima | Ako geolokacija nije dopuštena, prikazati kartu i popis aktivnosti bez automatskog prepoznavanja blizine. |
| AS-03 | Pretpostavka | Karta će koristiti OpenStreetMap i Leaflet. | Procjena tima | Nije konačno potvrđeno; potvrditi prije izrade F-14. |

### Otvorena pitanja

- Pravila otkazivanja i prijelazi između statusa rezervacije
- Format izvoza statistike (spominje se CSV).
- Kada se šalje obavijest e-poštom i što ona sadrži.
- Mogućnost ocijenjivanja vodića i izleta
- Način evidencije ostalih resursa organizatora i radijus za prepoznavanje blizine lokacije.

## 2.5 Značajne promjene zahtjeva

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
| 2.11.2026. | F-15, F-16, F-17 | Dodani zahtjevi iz projektnog zadatka koji su bili navedeni samo kao otvorena pitanja (kapacitet, izvoz statistike, GPS digitalni vodič). | Projektni zadatak |
| 2.11.2026. | Svi | Dodani prioriteti, izvori i kriteriji prihvaćanja. | Predložak dokumentacije kolegija |
| 18.11.2026. | NF-01 | Uklonjen NF-01 jer je uspostavljeno da je ekvivalentan F-02 | 

## 2.6 Sljedivost zahtjeva

| ID zahtjeva | Obrazac uporabe | Arhitekturna realizacija | Stanje | Ispitivanje ili provjera |
| --- | --- | --- | --- | --- |
| F-01 | UC-01 | `auth.routes.ts` | Implementirano | *na čekanju* |
| F-02 | UC-01, UC-08 | `users.model.ts` | Implementirano | *na čekanju* |
| F-03 | UC-08 | `/admin` | Implementirano | *na čekanju* |
| F-04 | UC-05 | `activities.routes.ts`, `activities.model.ts` | Implementirano | *na čekanju* |
| F-05 | UC-05 | `trips.routes.ts` | Nije implementirano | *na čekanju* |
| F-06 | UC-06 | `events.routes.ts` | Nije implementirano | *na čekanju* |
| F-07 | UC-06 | `events.routes.ts` | Nije implementirano | *na čekanju* |
| F-08 | UC-02 | `events.routes.ts` (`/events`) | Djelomično - hardkoidrani frontend | *na čekanju* |
| F-09 | UC-03 | `events.routes.ts` (`/events/:id/reserve`) | Nije implementirano | *na čekanju* |
| F-10 | UC-03, UC-07 | *na čekanju* (slanje e-poste) | Nije implementirano | *na čekanju* |
| F-11 | UC-04, UC-10 | `reservations.routes.ts` | Nije implementirano | *na čekanju* |
| F-12 | UC-07 | `reservations.routes.ts` | Nije implementirano | *na čekanju* |
| F-13 | UC-09 | `/dashboard` | Nije implementirano | *na čekanju* |
| F-14 | UC-10, UC-11 | *na čekanju* (karta) | Nije implementirano | *na čekanju* |
| F-15 | UC-03 | *na čekanju* (provjera slobodnih mjesta) | Nije implementirano | *na čekanju* |
| F-16 | UC-09 | `/dashboard` | Nije implementirano | *na čekanju* |
| F-17 | UC-11 | *na čekanju* (digitalni vodič) | Nije implementirano | *na čekanju* |

## 2.7 Pregled zahtjeva

| Kontrolna tocka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 |  |  |
| Demo 2 |  |  |
| Zavrsni pregled |  |  |
