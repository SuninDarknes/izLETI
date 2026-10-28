# Analiza zahtjeva

## Funkcijski zahtjevi

### Prijava i korisničke uloge

- **F-01** – Prijava putem Google računa (OAuth).
- **F-02** – Korisnik može imati više uloga, a dostupne funkcionalnosti ovise o njegovim ulogama.
- **F-03** – Admin može pretraživati korisnike te im dodjeljivati i oduzimati uloge.

### Aktivnosti, izleti i događaji

- **F-04** – Organiser može dodati aktivnost s opisom, lokacijom i kategorijom.
- **F-05** – Organiser može sastaviti izlet od jedne ili više aktivnosti u određenom redoslijedu. Može koristiti i već postojeće aktivnosti.
- **F-06** – Organiser može napraviti događaj na temelju novog ili postojećeg izleta. Događaj ima termin i dodijeljenog vodiča.
- **F-07** – Organiser određuje broj slobodnih mjesta na događaju i za dodatne usluge.

### Pregled i rezervacije

- **F-08** – User može pregledavati, pretraživati i sortirati događaje prema parametrima poput naziva, datuma, cijene, mjesta polaska, kategorije i vodiča.
- **F-09** – User može rezervirati događaj i odabrati dostupne dodatne usluge, npr. prijevoz ili najam opreme.
- **F-10** – Korisnik prima obavijest o rezervaciji e-poštom.
- **F-11** – User može pregledavati svoje rezervacije, njihov status, podatke o izletu i aktivnosti na karti te otkazati rezervaciju.
- **F-12** – Organiser može pregledavati i pretraživati događaje i njihove rezervacije te potvrditi ili odbiti rezervaciju.

### Statistika i karta

- **F-13** – Owner može pregledavati statistiku broja rezervacija, popunjenosti izleta, prihoda, najtraženijih aktivnosti i dodatnih usluga.
- **F-14** – Predviđen je prikaz korisnikove lokacije te lokacija aktivnosti i znamenitosti na karti.

## Nefunkcijski zahtjevi

- **NF-01** – Funkcionalnosti su dostupne ovisno o korisničkim ulogama.
- **NF-02** – Sučelje treba biti responzivno na računalima, tabletima i mobilnim uređajima.
- **NF-03** – Aplikacija treba podržavati istovremeni rad više korisnika.

Za responzivnost i istovremeni rad još nisu određeni detaljni kriteriji provjere ni brojčane vrijednosti.

## Korisnici i ostali akteri

- **User** – pregled i rezervacija događaja.
- **Organiser** – upravljanje aktivnostima, izletima, događajima i rezervacijama.
- **Admin** – upravljanje korisničkim ulogama.
- **Owner** – pregled statistike.
- **Google OAuth** – vanjski sustav za prijavu.

Vodič je povezan s događajem, ali njegove ovlasti u aplikaciji još nisu definirane.

## Tehnologije

- Prijava: Google OAuth.
- Baza: PostgreSQL.
- Backend: TypeScript, Node.js, Express, EJS.
- Frontend: Bootstrap.
- Karta: OpenStreetMap i Leaflet su navedeni kao mogućnost, ali nisu konačno potvrđeni.

## Za dodatnu razradu

- Pravila otkazivanja i prijelazi između statusa rezervacije (*pending*, odbijena, prihvaćena, izlet gotov).
- Zasebna uloga vodiča i moguće ocjenjivanje vodiča.
- Format izvoza statistike (spominje se CSV, ali nije konačno određen).
- Kada se šalje obavijest e-poštom i što ona sadrži.
- Točan broj osoba u rezervaciji i način provjere kapaciteta.

U projektnom zadatku dodatno se spominju automatsko sprječavanje rezervacija preko kapaciteta, podaci poput trajanja i potrebnog broja vodiča te GPS prepoznavanje blizine točaka interesa. Ti dijelovi još nisu detaljno razrađeni.

Prioriteti pojedinih zahtjeva još nisu određeni.
