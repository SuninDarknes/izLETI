# 1. Opseg projekta

## 1.1 Problem i cilj projekta

Turisticke agencije i organizatori izleta nude velik broj aktivnosti na razlicitim lokacijama i u razlicitim terminima. Korisnicima treba jednostavan pregled ponude, cijena i slobodnih mjesta, a organizatorima podrska pri upravljanju terminima, kapacitetima, vodicima i dodatnim uslugama.

izLETI je aplikacija za pregled i rezervaciju turistickih izleta i aktivnosti. Korisnici mogu pronaci dogadaj koji ih zanima i rezervirati ga, a organizatori mogu pripremati izlete i upravljati rezervacijama. Tijekom samog izleta aplikacija na mobilnom uredaju sluzi kao jednostavan digitalni vodic koji prikazuje informacije o lokacijama u blizini korisnika.

Aktivnosti i izleti mogu se ponovno koristiti. Tako ista aktivnost moze biti dio vise izleta, a isti izlet moze se odrzati u vise razlicitih termina.

### Osnovni pojmovi

- **Aktivnost** - pojedina aktivnost ili mjesto koje se posjecuje, npr. muzej ili vidikovac. Ima opis i lokaciju.
- **Izlet** - jedna ili vise aktivnosti slozenih odredenim redoslijedom.
- **Dogadaj** - odrzavanje izleta u odredenom terminu, s dodijeljenim vodicem i dostupnim dodatnim uslugama (npr. prijevoz ili oprema).

Rezervira se dogadaj, a ne izlet opcenito.

## 1.2 Ciljani korisnici i dionici

Korisnik moze imati vise uloga.

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
| --- | --- |
| User | Pregledava i pretrazuje dogadaje, rezervira ih, bira dodatne usluge te pregledava i otkazuje svoje rezervacije. Tijekom izleta dobiva informacije o lokacijama u blizini. |
| Organiser | Dodaje aktivnosti, izlete i dogadaje, odreduje kapacitete, dodjeljuje vodica te potvrduje ili odbija rezervacije. |
| Admin | Pretrazuje korisnike i dodjeljuje im ili oduzima uloge. |
| Owner (voditelj agencije) | Pregledava statistiku rezervacija, popunjenosti, prihoda i popularnosti aktivnosti i dodatnih usluga te je izvozi. |
| Vodic | Dodjeljuje se dogadaju; njegove zasebne mogucnosti u aplikaciji jos nisu odredene. |

## 1.3 Granice projekta

**Ukljuceno:**

- Prijava putem Google racuna.
- Pregled, pretrazivanje i rezervacija dogadaja uz automatsku provjeru kapaciteta.
- Dodatne usluge uz rezervaciju, poput prijevoza ili najma opreme.
- Potvrda rezervacije e-postom.
- Pregled i otkazivanje vlastitih rezervacija.
- Upravljanje aktivnostima, izletima i dogadajima.
- Pregled i obrada rezervacija za organizatore.
- Dodjeljivanje korisnickih uloga.
- Pregled i izvoz statistike.
- Prikaz aktivnosti, znamenitosti i lokacije korisnika na karti te informacije o lokacijama u blizini tijekom izleta.

**Jos nije odredeno ili je odgodeno:**

- Pravila otkazivanja i tocan tijek promjene statusa rezervacije.
- Zasebne mogucnosti vodica u aplikaciji.
- Hoce li biti moguce ocjenjivati vodice (nije dio projektnog zadatka, moguce prosirenje).
- Tocan format izvoza statistike.
- Nacin vodenja evidencije ostalih resursa organizatora (osim vodica i dodatnih usluga).

**Vanjske ovisnosti:**

- Google OAuth - prijava korisnika.
- Usluga za slanje e-poste - potvrde rezervacija.
- Kartografska usluga (OpenStreetMap + Leaflet, nije konacno potvrdeno) - prikaz karte.
- GPS/geolokacija preglednika na mobilnom uredaju - odredivanje blizine lokacija.
- PostgreSQL baza podataka.

## 1.4 Postojeci pristupi i opravdanost projekta

Organizator izleta svoju ponudu moze objaviti na web stranici, a rezervacije primati porukama ili telefonom, dok se kapaciteti i vodici vode zasebno. izLETI objedinjuje ponudu, rezervacije s automatskom provjerom slobodnih mjesta i pregled statistike na jednom mjestu, a korisniku tijekom izleta daje informacije o lokacijama koje posjecuje. Prva recenica je primjer korisnickog scenarija, a ne izmjereni podatak o stvarnim agencijama.
