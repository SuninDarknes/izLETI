# Opis baze podataka

## ENTITETI

#### User
Korisnici ukljucujuci i organizatore, administratore, vlasnike, vodice...

#### Roles
Uloge koje administrator pridodjeljuje korisnicima: user, organiser, admin, owner, guide...

#### Reservations
Rezervacije događaja

#### ReservationStates
Stanje rezervacije: pending, odbijena, prihvacena, izlet gotov

#### Activities
Aktivnosti koje predstavljaju jednu stvar koja se radi na izletu, npr. posjet muzeju moderne umjetnosti, planinarenje na Ravnu Goru... Aktivnosti se pridružuje i lokacija kako bi se mogle prikazati na karti. Mogu se ponovno koristiti u razlicitim izletima.

#### ActivityCategory
Kategorija aktivnosti, npr. muzej, šetnja, znamentiost, hrana... Svaka aktivnost ima samo jednu kategoriju

#### Trip
Izlet koji se sastoji od niza jedne ili više aktivnosti.

#### TripTags
Tagovi izleta, izlet može imati više tagova, npr. priroda, šetnja, avantura... Služe za lakše pretraživanje izleta.

#### Events
Događaji su "instance" izleta. Npr. ako se isti izlet "Razgledavanja gornjeg grada Zagreba" ponavlja svakog utorka, organizator ce napraviti samo jedan izlet, a za svaki tjedan novi događaj.

#### EventStates
Stanje događaja: hidden, planned, cancelled, done...

#### Addons
Dodatci, npr. prijevoz, iznajmljivanje planinarske opreme, ručak... Dijeljeni katalog — isti dodatak (npr. "Prijevoz busom") može se ponuditi na više različitih izleta preko TripAddon veze, slično kao Activities.

#### EventAddons
Dodatci koji su dostupni za pojedini dogadaj. Prilikom kreiranja izleta dodaju se svi moguci dodatci, no nisu svi dostupni za svaki dogadaj (npr. mozda za isti izlet u ponedjeljak postoji opcija prijevoza autobusom, dok u srijedu sa vlakom)