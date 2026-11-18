# Opis baze podataka

Baza je PostgreSQL. Shema je definirana u [`schema.sql`](schema.sql), a testni podaci su u [`dummy_data.sql`](dummy_data.sql). ER dijagram sa svim tablicama, atributima i vezama nalazi se u [`4-2-izleti-data-ERD.svg`](../assets/diagrams/4-2-izleti-data-ERD.svg), a njegov PlantUML izvor u [`4-2-izleti-data-ERD.puml`](../puml/4-2-izleti-data-ERD.puml).

Redoslijed odjeljaka prati redoslijed tablica u `schema.sql`.

---

## Users

Svi korisnici sustava, bez obzira na ulogu. Jedan zapis po osobi.

| Atribut | Opis |
| --- | --- |
| `email`, `googleId` | Oba `UNIQUE`. `googleId` (Googleov `sub`) je stvarni identitet za prijavu; e-pošta se može promijeniti pa se na nju ne oslanjamo. |
| `username`, `firstname`, `lastname`, `picture`, `locale` | Podaci preuzeti iz Google profila pri prijavi. Sve osim `username` je opcionalno jer Google ne jamči da će ih poslati. |
| `phone` | Opcionalan, za kontakt oko rezervacije. |
| `emailverified` | Je li Google potvrdio adresu. `DEFAULT FALSE` — ne pretpostavljamo potvrđenost. |
| `createdAt`, `active` | Vrijeme registracije i logičko brisanje računa. |

## Roles

Fiksni popis uloga: `Admin`, `User`, `Owner`, `Guide`, `Organizer`. Naziv je `UNIQUE`.

## Trips

Izlet, odnosno niz od jedne ili više aktivnosti. Izlet je predložak: nema datum ni vodiča, to pripada događaju.

| Atribut | Opis |
| --- | --- |
| `durationMinutes` | Ukupno predviđeno trajanje izleta. Opcionalno, jer se za dio izleta trajanje ne može unaprijed odrediti. |
| `meetingPointLatitude`, `meetingPointLongitude` | Mjesto polaska; odvojeno od lokacija aktivnosti jer polazište često nije prva aktivnost. |
| `maxParticipants` | Zadani gornji broj sudionika za taj izlet. `CHECK (> 0)`. |
| `basePrice` | Osnovna cijena bez dodataka. `CHECK (>= 0)` dopušta besplatne izlete. |
| `createdAt`, `active` | Vrijeme stvaranja i logičko brisanje. |

## EventStates

Stanje događaja.

## Events

Konkretno izvođenje izleta u određenom terminu. Ako se isti izlet ponavlja svakog utorka, postoji jedan zapis u `Trips` i po jedan `Events` za svaki termin. Rezervira se događaj, ne izlet.

| Atribut | Opis |
| --- | --- |
| `startDatetime` | Termin polaska. |
| `capacity` | Broj mjesta na tom konkretnom terminu. Odvojen od `Trips.maxParticipants` jer organizator za pojedini termin može ponuditi manje mjesta (manji autobus, manja grupa). |
| `tripId`, `stateId` | Izlet koji se izvodi i trenutno stanje događaja. |

## ActivityCategories

Kategorija aktivnosti (muzej, šetnja, znamenitost, hrana…). Služi za filtriranje ponude.

## Activities

Jedna konkretna stvar koja se radi na izletu, npr. posjet muzeju. Ista aktivnost može biti dio više izleta, što je glavni razlog zašto je zaseban entitet, a ne atribut izleta.

| Atribut | Opis |
| --- | --- |
| `name`, `description` | Naziv i opis koji se prikazuje korisniku, između ostalog i kao sadržaj digitalnog vodiča tijekom izleta. |
| `locationName` | Čitljiv naziv lokacije (npr. "Muzej suvremene umjetnosti"). |
| `latitude`, `longitude` | `NUMERIC(9,6)` — jedna točka, dovoljno za prikaz oznake na karti i za računanje blizine korisnika. Preciznost od 6 decimala odgovara otprilike 10 cm. |
| `durationMinutes` | **Opcionalan** — za dio aktivnosti trajanje se ne može unaprijed odrediti. |
| `categoryId` | Svaka aktivnost ima točno jednu kategoriju. |

## Addons

Katalog dodatnih usluga (prijevoz, najam opreme, ručak). Dijeljeni popis; isti dodatak nudi se na više događaja. `defaultPrice` je prijedlog cijene koji se pri dodavanju na događaj može promijeniti.

## ReservationStates

Stanje rezervacije: `Pending`, `Confirmed`, `Cancelled`, `Completed`.

## EventGuides

Vodiči dodijeljeni događaju. Više vodiča po događaju je moguće (veće grupe, različiti jezici). Uz očekivani `UNIQUE (eventId, guideId)` ima i `UNIQUE (eventId, id)` — on postoji zato da `Reservations` može imati složeni strani ključ `(eventId, eventGuideId)`, čime baza jamči da korisnik ne može odabrati vodiča koji nije dodijeljen baš tom događaju.

## Reservations

Rezervacija jednog korisnika na jednom događaju.

| Atribut | Opis |
| --- | --- |
| `numPeople` | Broj osoba. `CHECK (> 0)`. Zbroj po aktivnim rezervacijama uspoređuje se s `Events.capacity` pri provjeri slobodnih mjesta. |
| `userId`, `eventId`, `stateId` | Tko rezervira, što, i u kojem je stanju. |
| `eventGuideId` | Vodič kojeg je korisnik odabrao, preko složenog stranog ključa vezan uz isti događaj (vidi `EventGuides`). |
| `createdAt` | Vrijeme predaje rezervacije. |

## TripTags

Tagovi izleta (priroda, avantura, obitelj…). Služe za lakše pretraživanje. Odvojeni su od kategorija aktivnosti jer opisuju izlet kao cjelinu i izlet ih može imati više.

## EventAddons

Dodatak ponuđen na konkretnom događaju.

| Atribut | Opis |
| --- | --- |
| `description` | Opis je namjerno ovdje, a ne na `Addons`, jer isti generički dodatak na različitim događajima znači različite stvari — npr. "Prijevoz" na jednom događaju je "autobus iz Karlovca u 16:30", a na drugom nešto sasvim drugo. |
| `price`, `capacity` | Cijena i broj raspoloživih jedinica na tom događaju. `CHECK (capacity >= 0)` dopušta privremeno zatvaranje usluge bez brisanja. |

Parcijalni `UNIQUE (eventId, addonId) WHERE active` sprječava da isti dodatak bude dvaput aktivan na istom događaju, ali dopušta ponovno dodavanje ranije uklonjenog.

## UserRole

Spojna tablica korisnik <--> uloga. Postoji jer jedan korisnik može imati više uloga istovremeno (npr. Owner i Admin), a istu ulogu ima više korisnika. `UNIQUE (roleId, userId)` sprječava dvostruku dodjelu iste uloge.

## TripActivity

Spojna tablica izlet <--> aktivnost, s atributom `sequenceOrder` jer je redoslijed obilaska bitan. Dva ograničenja: `UNIQUE (tripId, sequenceOrder)` sprječava dvije aktivnosti na istom mjestu u nizu, a `UNIQUE (tripId, activityId)` istu aktivnost dvaput u istom izletu.

## TripTag

Spojna tablica izlet <--> tag. `UNIQUE (tripId, tagId)` sprječava da isti tag bude dvaput dodijeljen istom izletu.

## ReservationAddon

Dodatne usluge odabrane uz rezervaciju, s količinom. `UNIQUE (eventAddonId, reservationId)` sprječava dvostruki unos iste usluge; umjesto toga se povećava `quantity`.

## Languages

Jezici kojima vodič može voditi izlet.

## GuideLanguage

Spojna tablica vodič <--> jezik. Pokazuje na `Users`, ne na zasebnu tablicu vodiča, jer je "vodič" uloga korisnika, a ne poseban entitet.

## GuideRatings

Ocjena vodiča, `CHECK (rating BETWEEN 1 AND 5)` uz opcionalni komentar.

Vezana je na `reservationId`, a ne izravno na korisnika i vodiča. Razlog: rezervacija je dokaz da je osoba stvarno bila na tom izletu, pa se preko nje jednoznačno dobiva i tko ocjenjuje i koga ocjenjuje (preko `Reservations.eventGuideId`), a nitko ne može ocijeniti vodiča kojeg nije imao.

Parcijalni `UNIQUE (reservationId) WHERE active` dopušta najviše jednu aktivnu ocjenu po rezervaciji, uz mogućnost da se stara ocjena deaktivira i napiše nova.

## TripRatings

Ocjena izleta. Građena je jednako kao `GuideRatings` — ista ograničenja i isto vezanje na `reservationId`, samo se ocjenjuje izlet umjesto vodiča.

---

## Pravila integriteta koja provodi sama baza

| Mehanizam | Pravilo |
| --- | --- |
| `CHECK` ograničenja | Ocjene su 1–5; broj osoba i maksimalan broj sudionika veći su od nule; cijene i kapaciteti nisu negativni. |
| Složeni strani ključ `Reservations (eventId, eventGuideId) → EventGuides (eventId, id)` | Odabrani vodič nužno je dodijeljen upravo onom događaju koji se rezervira. |
| Trigger `trg_check_addon_event` | Prije unosa ili izmjene u `ReservationAddon` provjerava da rezervirani dodatak pripada događaju te rezervacije. Ista vrsta provjere kao gore, ali se ne može izraziti stranim ključem jer `ReservationAddon` do događaja dolazi dvama neovisnim putovima. |
| `GENERATED ALWAYS AS IDENTITY` | Ručni upis ID-a javlja grešku umjesto da tiho naruši sekvencu. |

Svrha je da se neispravno stanje ne može pohraniti ni u slučaju greške u aplikacijskom sloju, umjesto oslanjanja isključivo na provjere u `src/model/`.
