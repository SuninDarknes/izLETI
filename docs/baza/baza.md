# Opis baze podataka

## ENTITETI

#### User
Korisnici ukljucujuci i organizatore, administratore, vlasnike, vodice...

#### Languages
Jezici koje vodič može govoriti.

#### GuideLanguage
Spojna M:N tablica - koji korisnik (vodič) govori koji jezik.

#### Roles
Uloge koje administrator pridodjeljuje korisnicima: user, organiser, admin, owner, guide...

#### Reservations
Rezervacije događaja. Svaka rezervacija ima odabranog vodiča (guideId — korisnik bira jednog od vodiča dostupnih na tom eventu preko HasGuide). Sadrži i optional FK-ove guideRatingId i tripRatingId prema GuideRating/TripRating tablicama, popunjene nakon što je izlet realiziran i korisnik ostavi ocjenu.

#### GuideRating
Ocjena vodiča (rating, comment, createdAt). Svaka rezervacija može imati najviše jednu takvu ocjenu, preko Reservations.guideRatingId.

#### TripRating
Ocjena izleta (rating, comment, createdAt). Svaka rezervacija može imati najviše jednu takvu ocjenu, preko Reservations.tripRatingId.

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
Dodatci, npr. prijevoz, iznajmljivanje planinarske opreme, ručak... Dijeljeni katalog — isti dodatak (npr. "Prijevoz busom") može se ponuditi na više različitih događaja.

#### EventAddons
Dodatci koji su dostupni na određenom događaju.