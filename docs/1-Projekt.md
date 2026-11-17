# 1. Opseg projekta

## 1.1 Problem i cilj projekta

Organizatori izleta nude velik broj aktivnosti na različitim lokacijama i u različitim terminima. Korisnicima treba jednostavan pregled ponude, cijena i slobodnih mjesta, a organizatorima podrška pri upravljanju terminima, kapacitetima, vodičima i dodatnim uslugama.

izLETI je aplikacija za pregled i rezervaciju turističkih izleta i aktivnosti. Korisnici mogu pronaći događaj koji ih zanima i rezervirati ga, a organizatori mogu pripremati izlete i upravljati rezervacijama. Tijekom samog izleta aplikacija na mobilnom uređaju služi kao jednostavan digitalni vodič koji prikazuje informacije o lokacijama u blizini korisnika.

Aktivnosti i izleti mogu se ponovno koristiti. Tako ista aktivnost može biti dio više izleta, a isti izlet može se održati u više različitih termina.

### Osnovni pojmovi

- **Aktivnost** - pojedina aktivnost ili mjesto koje se posjećuje, npr. muzej ili vidikovac. Ima opis i lokaciju.
- **Izlet** - jedna ili više aktivnosti složenih određenim redoslijedom.
- **Događaj** - održavanje izleta u određenom terminu, s dodijeljenim vodičem i dostupnim dodatnim uslugama (npr. prijevoz ili oprema).

Rezervira se događaj, a ne izlet općenito.

## 1.2 Ciljani korisnici i dionici

Korisnik može imati više uloga.

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
| --- | --- |
| User | Pregledava i pretražuje događaje, rezervira ih, bira dodatne usluge te pregledava i otkazuje svoje rezervacije. Tijekom izleta dobiva informacije o lokacijama u blizini. |
| Organiser | Dodaje aktivnosti, izlete i događaje, određuje kapacitete, dodjeljuje vodica te potvrđuje ili odbija rezervacije. |
| Admin | Pretražuje korisnike i dodjeljuje im ili oduzima uloge. |
| Owner (voditelj agencije) | Pregledava statistiku rezervacija, popunjenosti, prihoda i popularnosti aktivnosti i dodatnih usluga te je izvozi. |
| Vodič | Dodjeljuje se događaju; njegove zasebne mogućnosti u aplikaciji još nisu određene. |

## 1.3 Granice projekta

**Uključeno:**

- Prijava putem Google računa.
- Pregled, pretraživanje i rezervacija događaja uz automatsku provjeru kapaciteta.
- Dodatne usluge uz rezervaciju, poput prijevoza ili najma opreme.
- Potvrda rezervacije e-poštom.
- Pregled i otkazivanje vlastitih rezervacija.
- Upravljanje aktivnostima, izletima i događajima.
- Pregled i obrada rezervacija za organizatore.
- Dodjeljivanje korisničkih uloga.
- Pregled i izvoz statistike.
- Prikaz aktivnosti, znamenitosti i lokacije korisnika na karti te informacije o lokacijama u blizini tijekom izleta.
- Ocjenjivanje vodiča.
- Ocjenjivanje izleta.

**Još nije određeno ili je odgođeno:**

- Pravila otkazivanja i točan tijek promjene statusa rezervacije.
- Zasebne mogućnosti vodiča u aplikaciji.
- Točan format izvoza statistike.
- Način vođenja evidencije ostalih resursa organizatora (osim vodiča i dodatnih usluga).

**Vanjske ovisnosti:**

- Google OAuth - prijava korisnika.
- Usluga za slanje e-pošte - potvrde rezervacija.
- Kartografska usluga (OpenStreetMap + Leaflet, nije konačno potvrđeno) - prikaz karte.
- GPS/geolokacija preglednika na mobilnom uređaju - određivanje blizine lokacija.
- PostgreSQL baza podataka.

## 1.4 Postojeći pristupi i opravdanost projekta

Organizator izleta svoju ponudu može objaviti na web stranici, a rezervacije primati porukama ili telefonom, dok se kapaciteti i vodiči vode zasebno. izLETI objedinjuje ponudu, rezervacije s automatskom provjerom slobodnih mjesta i pregled statistike na jednom mjestu, a korisniku tijekom izleta daje informacije o lokacijama koje posjećuje. Prva rečenica je primjer korisničkog scenarija, a ne izmjereni podatak o stvarnim agencijama.