# 3. Obrasci uporabe

Oznake F-01, F-02 itd. odnose se na [analizu zahtjeva](Analiza-zahtjeva.md). Prioriteti zahtjeva navedeni su u odjeljku 2.1.

## 3.1 Dijagram obrazaca uporabe

Dijagram jos nije izraden.

## 3.2 Specifikacije obrazaca uporabe

### UC-01: Prijava

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Korisnik aplikacije (sekundarni: Google OAuth) |
| **Povezani zahtjevi** | F-01, F-02 |
| **Preduvjeti** | Korisnik ima Google racun i nije prijavljen. |
| **Glavni uspjesni tok** | 1. Korisnik odabire prijavu Google racunom.<br>2. Aplikacija preusmjerava korisnika na Google.<br>3. Korisnik se prijavljuje i dopusta pristup.<br>4. Aplikacija dohvaca korisnikove podatke i uloge te prikazuje funkcionalnosti njegovih uloga. |
| **Alternativni tokovi / Iznimke** | **3a - Korisnik odustaje ili prijava ne uspije:** aplikacija ostaje na pocetnoj stranici i korisnik ostaje neprijavljen.<br>**4a - Prva prijava:** aplikacija stvara novi korisnicki racun s pocetnom ulogom (pocetna uloga jos nije odredena). |
| **Posljedice (ishod)** | Korisnik je prijavljen i vidi funkcionalnosti svojih uloga. |

### UC-02: Pretrazivanje dogadaja

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | User |
| **Povezani zahtjevi** | F-08 |
| **Preduvjeti** | Nema. |
| **Glavni uspjesni tok** | 1. Korisnik otvara popis dogadaja.<br>2. Unosi filtere (naziv, datum, cijena, mjesto polaska, kategorija, trajanje, slobodna mjesta, vodic) i odabire sortiranje.<br>3. Aplikacija prikazuje dogadaje koji odgovaraju filterima. |
| **Alternativni tokovi / Iznimke** | **3a - Nema rezultata:** aplikacija javlja da nema dogadaja za zadane filtere i nudi ponistavanje filtera. |
| **Posljedice (ishod)** | Korisnik pronalazi dogadaje koji ga zanimaju. |

### UC-03: Rezervacija dogadaja

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | User |
| **Povezani zahtjevi** | F-09, F-10, F-15 |
| **Preduvjeti** | Korisnik je prijavljen; dogadaj je planiran i ima slobodnih mjesta. |
| **Glavni uspjesni tok** | 1. Korisnik odabire dogadaj i otvara obrazac za rezervaciju.<br>2. Unosi broj osoba i po zelji bira dostupne dodatne usluge.<br>3. Predaje rezervaciju.<br>4. Aplikacija provjerava slobodna mjesta na dogadaju i za odabrane usluge.<br>5. Aplikacija sprema rezervaciju s pocetnim statusom i prikazuje potvrdu predaje. |
| **Alternativni tokovi / Iznimke** | **4a - Nema dovoljno mjesta:** aplikacija javlja koliko je mjesta slobodno, ne sprema rezervaciju i korisnik moze promijeniti broj osoba ili usluge.<br>**4b - Dogadaj se popunio u meduvremenu:** aplikacija odbija rezervaciju i javlja da je dogadaj popunjen.<br>**5a - Spremanje nije uspjelo:** aplikacija javlja gresku i ne prikazuje laznu potvrdu. |
| **Posljedice (ishod)** | Rezervacija je spremljena, a broj slobodnih mjesta smanjen. Potvrda e-postom salje se nakon potvrde organizatora (UC-07). |

### UC-04: Pregled i otkazivanje rezervacije

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | User |
| **Povezani zahtjevi** | F-11 |
| **Preduvjeti** | Korisnik je prijavljen i ima barem jednu rezervaciju. |
| **Glavni uspjesni tok** | 1. Korisnik otvara svoje rezervacije.<br>2. Odabire rezervaciju i pregledava status te podatke o izletu i aktivnostima.<br>3. Po potrebi odabire otkazivanje i potvrduje ga.<br>4. Aplikacija mijenja status u otkazanu i oslobada mjesta. |
| **Alternativni tokovi / Iznimke** | **2a - Prikaz na karti:** korisnik otvara kartu aktivnosti (UC-10).<br>**3a - Korisnik odustaje od otkazivanja:** rezervacija ostaje nepromijenjena.<br>**4a - Otkazivanje nije dopusteno:** aplikacija objasnjava razlog (pravila otkazivanja jos nisu definirana). |
| **Posljedice (ishod)** | Korisnik je pregledao rezervaciju ili je rezervacija otkazana. |

### UC-05: Unos aktivnosti i izleta

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Organiser |
| **Povezani zahtjevi** | F-04, F-05 |
| **Preduvjeti** | Korisnik je prijavljen i ima ulogu Organiser. |
| **Glavni uspjesni tok** | 1. Organizator otvara izradu izleta.<br>2. Dodaje novu aktivnost (opis, lokacija, kategorija) ili bira postojecu.<br>3. Slaze aktivnosti zadanim redoslijedom i unosi podatke o izletu.<br>4. Sprema izlet. |
| **Alternativni tokovi / Iznimke** | **2a - Nedostaju podaci aktivnosti:** aplikacija oznacava neispunjena polja i ne sprema aktivnost.<br>**4a - Izlet nema nijednu aktivnost:** aplikacija javlja gresku i ne sprema izlet. |
| **Posljedice (ishod)** | Izlet je spremljen, a aktivnosti se mogu koristiti i u drugim izletima. |

### UC-06: Kreiranje dogadaja

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Organiser |
| **Povezani zahtjevi** | F-06, F-07 |
| **Preduvjeti** | Korisnik je prijavljen i ima ulogu Organiser. |
| **Glavni uspjesni tok** | 1. Organizator bira postojeci izlet ili izraduje novi (UC-05).<br>2. Odreduje termin dogadaja i dodjeljuje vodica.<br>3. Unosi kapacitet dogadaja te dostupne dodatne usluge i njihove kapacitete.<br>4. Sprema dogadaj. |
| **Alternativni tokovi / Iznimke** | **2a - Nema slobodnog vodica u terminu:** aplikacija javlja da vodic nije dostupan i organizator bira drugog vodica ili termin. |
| **Posljedice (ishod)** | Dogadaj je spremljen i, ako je planiran, vidljiv korisnicima. |

### UC-07: Obrada rezervacije

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Organiser |
| **Povezani zahtjevi** | F-12, F-10 |
| **Preduvjeti** | Korisnik je prijavljen i ima ulogu Organiser; postoji rezervacija koja ceka obradu. |
| **Glavni uspjesni tok** | 1. Organizator otvara dogadaj i njegove rezervacije.<br>2. Odabire rezervaciju.<br>3. Potvrduje je ili odbija.<br>4. Aplikacija mijenja status rezervacije; kod potvrde salje korisniku potvrdu e-postom. |
| **Alternativni tokovi / Iznimke** | **4a - Slanje e-poste nije uspjelo:** status je promijenjen, a aplikacija biljezi da potvrda nije poslana.<br>**4b - Odbijena rezervacija:** oslobadaju se rezervirana mjesta. |
| **Posljedice (ishod)** | Rezervacija je potvrdena ili odbijena, a korisnik vidi novi status. |

### UC-08: Dodjeljivanje korisnickih uloga

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Admin |
| **Povezani zahtjevi** | F-02, F-03 |
| **Preduvjeti** | Korisnik je prijavljen i ima ulogu Admin. |
| **Glavni uspjesni tok** | 1. Administrator pretrazuje korisnike.<br>2. Odabire korisnika i dodjeljuje mu ili oduzima ulogu.<br>3. Aplikacija sprema promjenu. |
| **Alternativni tokovi / Iznimke** | **1a - Korisnik nije pronaden:** aplikacija prikazuje prazan rezultat.<br>**2a - Admin sam sebi oduzima ulogu Admin:** aplikacija trazi potvrdu. |
| **Posljedice (ishod)** | Korisnikove uloge su azurirane. |

### UC-09: Pregled i izvoz statistike

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Owner |
| **Povezani zahtjevi** | F-13, F-16 |
| **Preduvjeti** | Korisnik je prijavljen i ima ulogu Owner. |
| **Glavni uspjesni tok** | 1. Owner otvara stranicu statistike.<br>2. Odabire razdoblje.<br>3. Aplikacija prikazuje broj rezervacija, popunjenost, prihode te najtrazenije aktivnosti i dodatne usluge. |
| **Alternativni tokovi / Iznimke** | **3a - Izvoz:** Owner odabire izvoz i preuzima podatke u standardnom formatu (npr. CSV).<br>**3b - Nema podataka za razdoblje:** aplikacija prikazuje prazne vrijednosti uz obavijest. |
| **Posljedice (ishod)** | Prikazana je statistika, a po potrebi preuzeta datoteka s podacima. |

### UC-10: Prikaz lokacija na karti

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | User |
| **Povezani zahtjevi** | F-11, F-14 |
| **Preduvjeti** | Aktivnosti izleta imaju valjane koordinate. |
| **Glavni uspjesni tok** | 1. Korisnik otvara prikaz rezervacije ili izleta.<br>2. Otvara kartu.<br>3. Aplikacija prikazuje aktivnosti i znamenitosti izleta kao oznake te korisnikov polozaj. |
| **Alternativni tokovi / Iznimke** | **3a - Korisnik ne dopusti lokaciju:** karta prikazuje samo aktivnosti bez korisnikova polozaja. |
| **Posljedice (ishod)** | Prikazane su lokacije na karti. |

### UC-11: Digitalni vodic tijekom izleta

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | User |
| **Povezani zahtjevi** | F-14, F-17 |
| **Preduvjeti** | Korisnik ima potvrdenu rezervaciju za dogadaj koji je u tijeku i koristi aplikaciju na mobilnom uredaju. |
| **Glavni uspjesni tok** | 1. Korisnik otvara izlet u tijeku i dopusta pristup lokaciji.<br>2. Aplikacija prati korisnikovu GPS lokaciju i prikazuje je na karti s aktivnostima izleta.<br>3. Kada korisnik dode u blizinu aktivnosti, aplikacija prikazuje njezin naziv, opis i zanimljivosti. |
| **Alternativni tokovi / Iznimke** | **1a - Korisnik ne dopusti lokaciju:** aplikacija prikazuje kartu i popis aktivnosti, a informacije korisnik otvara rucno.<br>**2a - GPS signal nije dostupan:** aplikacija javlja da lokacija trenutno nije poznata i nastavlja kada se signal vrati. |
| **Posljedice (ishod)** | Korisnik dobiva informacije o lokacijama koje posjecuje. |

## 3.3 Provjera dosljednosti obrazaca uporabe

Povezivanje zahtjev - obrazac uporabe - ispitivanje odrzava se samo u [tablici sljedivosti zahtjeva](Analiza-zahtjeva.md#26-sljedivost-zahtjeva).

| Provjera | Stanje |
| --- | --- |
| Zahtjev | Svaki obrazac uporabe povezan je s postojecim zahtjevom iz 2.1. |
| Akter | Akteri odgovaraju ulogama iz 2.3; vodic nije akter dok mu se ne odrede ovlasti. |
| Aplikacija | Opisi su trenutacno oblikovanje; azurirati kad se odrede pravila otkazivanja, pocetna uloga i statusi rezervacije. |
