## TEMELJNA PRAVILA

- komunicirajte s timom, pogotovo s onima s kojima direktno suradujete (npr. baza i backend)
- ako ides nesto raditi sto ti nije eksplicitno zadano, prvo napisi u grupu sto ces raditi i zasto
- svaki feature koji dodajete radite na zasebnom branch-u te ga kad je gotov mergeajte u main branch (unutar samog brancha radite sto god hocete)
- radite cim cesce commitove, nemojte za 3 dana posla napravit 1 commit!
- ako vise ljudi rade na istom file-u probajte komunicirati i mozda raditi na istom branchu da izbjegnemo ogromni merge conflict
- ako se ne slazete sa mojim uputama i preporukama molim recite mi, vjv sam u krivu :)

## OPIS PRODUKTA

- login uz pomoc Googla-a
- nesto drugacije sucelje ovisno o ulogama (korisnik moze imati vise uloga)
  - User - moze pregledavati i rezervirati dogadaje
  - Admin - zadaje uloge ostalim korisnicima
  - Organiser - dodaje aktivnosti, izlete, dogadaje 
  - Owner - vidi statistike (broj izleta, profit, bla bla)
  - ?Vodic?

- Postoje tri glavna objekta:
  - **aktivnost**: jedna specificna stvar koju cete raditi na izletu, (npr. muzej umjetnosti)... Imaju lokaciju i opis na bazi cega se prikazuju korisniku na karti.
  - **izlet**: skup od jedne ili vise aktivnosti u nekom slijedu (npr. Tura po Medimurju: 1. Riznica medimurja, 2. Vidikovac Maderkin breg, 3. Mlin na muri)
  - **dogadaj**: "instanca" izleta, odnosno izlet povezan sa specificnim datumom, vodicom i dodatnim opcijama (prevoz, oprema...)

  - Cilj ovakve organizacije podataka je da organizator moze cim vise toga ponovno koristiti. Moze biti vise razlicitih izleta koji posjecuju isti muzej (aktivnost), a isti izlet moze se ponoviti puno puta (kao razliciti dogadaj)

### User

- pretrazivanje i sortiranje dostupnih dogadaja po raznim parametrima (naziv, datum od-do, cijena od-do, mjesto polaska, kategorija, vodic...)
- rezervacija dogadaja i odabir zeljenih dodatnih usluga (prijevoz, najam opreme...)
- obavijest o rezervaciji na mail
- pregled rezervacija:
  - stanje rezervacije
  - opis izleta i osnovne informacije
  - pregled aktivnosti na karti
  - otkazivanje rezervacije
- ?? nakon dogadaja ocjenjuje vodica ??

### Organizator

- moze dodavati aktivnosti, izlete, dogadaje
- kad dodaje izlete moze napraviti nove aktivnosti ili izabrati neke koje su vec napravljene
  - slicno kada radi dogadaje moze napraviti novi izlet ili koristiti stari
- dogadaju dodjeljuje vodic-a
- moze pregledati i pretrazivati dogadaje, vidjeti rezervacije te ih podvrditi/odbiti
- unaprijed unosi broj slobodnih mjesta na dogadaju i za dodatne usluge


### Owner

- ima posebnu stranicu za statistiku gdje vidi razne podatke (broj rezervacija, popunjenost
pojedinih izleta, ostvarenog prihoda, najtrazenije aktivnosti i dodatne usluge)
- izvod statistike u CSV ili tak nest

### Admin

- ima admin panel gdje moze pretrazivati korisnike i dodavati im ili oduzimati uloge

### ??Vodic??

- za vrijeme izleta moze vidjeti popis korisnika, te mozda njihovu lokaciju ili kontakt..


## TEHNOLOGIJA
- login - OAuth Google sign in
- baza - Postgress
- backend - TypeScript, NodeJS, ExpressJS, EJS
- frontend - Bootstrap, ?OpenStreetMap + Leaflet?

## ULOGE U TIMU

Jedna osoba moze imati vise uloga, jednu ulogu moze imati vise ljudi :) Previse nas je na timu, a i neke stvari su teze od drugih (npr. na bazi bude radilo barem dvoje ljudi i svi budemo morali sudjelovati jer sve ovisi o bazi). Neke od stvari koje jos treba raditi su: 
- dizajn baze
- programiranje procedura/view-ova za bazu - neke bitnije ili kompliciranije naredbe za bazu mozemo napisati u obliku procedura da ih mozemo samo pozvati sa odgovarajucim argumentima umijesto da uvijek pisemo iznova komplicirani SELECT (npr. filtriranje izleta, dobavljanje statistika)
- dizajn (UI)
- backend - model (klase koje sluze kao "API" izmedu backenda i baze)
- backend - route-ovi (API izmedu frontenda i backenda)
- frontend - html, bootstrap
- frontend - prikazivanje lokacije korisnika i znamenitosti na karti
- dokumentacija
- vjv jos toga kaj mi neje palo na pamet :)

### Team

- Jakov Biskup - Team lead, Full stack
- Florijan Gotal - DevOps
- Ivor Trstenjak
- Jana Furdi
- Erik Miksic - dizajn baze
- Drazen Grguric
- Cubek Luka

## Routes

#### GET
**/** pocetna
**/events** popis (i pretrazivanje) dogadaja
**/events/:id** pregled jednog dogadaja
**/events/:id/reserve** obrazac za rezervaciju
**/reservations** popis rezervacija
**/reservations/:id** pregled rezervacije (i karta za pracenje izleta ako je izlet u tijeku?)

**/activites** aktivnosti
**/activites/:id**
**/activites/:id/edit**
**/activites/add**
**/trips** izleti
**/trips/:id**
**/trips/:id/edit**
**/trips/add**
**/events** dogadaji
**/events/:id**
**/events/:id/edit**
**/events/add**

**/admin** stranica za dodjeljivanje uloga
**/dashboard** stranica za statistike


## TODO prvi tjedan (ubuduce kroz GitHub issues ali jos nemamo to :)
- procitati upute **(svi)**
- dodati profesora i asistenta i sve nas u GitHub **(Gotal)**
- pogledati basic github tutorial (i cheetsheet u docs/upute), klonirati GitHub repository na svoj kompjuter **(svi)**
- procitati ovaj file i razmisliti koji dio bi htjeli raditi **(svi)**
  - razmisljati o svemu sto bi trebali spremati u bazu
  - prouciti tehnologije koje budemo koristili, pogotovo ako su vam nove
- napraviti discord server **(ko hoce)**
- napisati GitHub issues nakon ka se jos dogovorimo za detalje **(Jakov + ko hoce)**
- zmisliti ime tima **(svi)**

## TODO drugi tjedan
- napraviti bazu