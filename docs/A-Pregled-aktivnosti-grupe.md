# A. Pregled aktivnosti grupe

## A.1 Evidencija sastanaka

| Datum i sudionici | Glavna tema | Donesena odluka ili zadatak  | Poveznica na zadatak ili  rezultat, ako postoji |
| --- | --- | --- | --- |
| 12.10.2026.<br>Nedostaje Dražen | Formiranje tima, osnovne informacije |  |  |
| 22.10.2026.<br>Svi prisutni | Raspisivanje Issue-a na GitHub-u, podjela uloga, dogovor formata dokumentacije | | [Issues](https://github.com/SuninDarknes/izLETI/issues) |
| 29.10.2026.<br>Svi prisutni | Određivanje funkcijskih zahtjeva | Funkcijskim zahtjevima potrebno odrediti prioritete | [zahtjevi](./2-Analiza-zahtjeva.md) |
| 6.11.2026.<br>Nedostaju Jakov, Florijan | Dogovor o izvedbi postavljanja stranice te potrebnih funkcionalnosti na prvoj predaji |  | |
| 12.11.2026.<br>Svi prisutni | Dogovor o završnim poslovima na alpha verziji | |

## A.2 Plan rada

**Trenutačni plan:** [plan rada po tjednima izveden iz discorda](./Tjedni_plan_rada_iz_discorda.md)

## A.3 Aktivnosti i doprinosi članova

Sastavljeno na temelju povijesti commit-ova (naredba `git log --pretty=format:"%an,%ad,%s" --date=short > commit_history.csv`) i kanala `#progres-updates` u discord serveru.

| Datum | Aktivnost ili rezultat | Član | Reprezentativni rezultat ili poveznica |
| --- | --- | --- | --- |
| 12. 10. 2026. | Izrađena početna inačica plana izrade baze podataka. | Ivor Trstenjak | [baza_v1](./spec/baza_v1.txt) |
| 12. 10. – 19. 10. 2026. | Početna konfiguracija repozitorija i poslužiteljskog okruženja; dodano povezivanje aplikacije s bazom te osnovni prikaz `Hello World`. | Florijan Gotal | Početno postavljanje aplikacije i povezivanja s bazom |
| 13. 10. 2026. | Dodani osnovni projektni podaci i TODO popis za prvi tjedan. | Jakov Biškup | Početne projektne datoteke i [TODO](./spec/OsnovniPodatci_i_TODO.md) |
| 19. 10. 2026. | Dodane početne backend rute i pokrenut poslužitelj koji poslužuje stranice. | Ivor Trstenjak | Početne rute i poslužiteljsko pokretanje |
| 19. 10. 2026. | Instaliran Express; izrađen privremeni ER dijagram i početni popis potrebnih ruta. | Jakov Biškup | Express konfiguracija, ER dijagram i popis ruta |
| 20. 10. 2026. | Dodani atributi baze, relacijska shema i SQL. | Erik Mikšič | Dokumentacija baze, ER dijagram, relacijska shema i SQL |
| 20. 10. 2026. | Dodana početna dokumentacija baze podataka i ER dijagram. | Jakov Biškup | Dokumentacija baze i ER dijagram |
| 22. 10. 2026. | Ažuriran ER dijagram. | Jakov Biškup | ER dijagram |
| 23. 10. 2026. | Izrađen početni frontend za prijavu. | Ivor Trstenjak | Sučelje za prijavu |
| 26. 10. 2026. | Dodane tablice za jezike i ocjenjivanje izleta i vodiča te pripadajući SQL i relacijska shema. | Erik Mikšić | `Languages`, `GuideLanguage`, `GuideRating`, `TripRating` |
| 27. 10. 2026. | Dodatno izmijenjeni ER dijagram, relacijska shema i SQL; uveden entitet `EventGuides` za povezivanje vodiča s događajima. | Jakov Biškup | ER dijagram, relacijska shema i SQL s `EventGuides` |
| 28. 10. 2026. | Izrađena početna dokumentacija zahtjeva i obrazaca uporabe. | Luka Čubek | Početna verzija poglavlja „Analiza zahtjeva” i „Obrasci uporabe” |
| 29. 10. 2026. | Sastavljen početni popis backend funkcija za čitanje i upis podataka u bazu. | Dražen Grgurić | `docs/spec/` – popis backend funkcija |
| 29. 10. 2026. | Pripremljena prezentacija za laboratorijske vježbe. | Jakov Biškup | Prezentacija za laboratorijske vježbe |
| 1. 11. 2026. | Započet model korisnika i dodani generirani testni podaci za bazu. | Jakov Biškup | Users model i `dummy_data.sql` |
| 2. 11. 2026. | Implementirana Google prijava i zapis korisnika u bazu; prilagođena shema i dodano automatsko indeksiranje. | Ivor Trstenjak | Google autentifikacija i povezivanje s bazom korisnika |
| 2. 11. 2026. | Dodana zabrana pristupa administratorskoj stranici korisnicima bez administratorske uloge. | Ivor Trstenjak | Middleware za zaštitu administratorske stranice |
| 2. 11. 2026. | Izrađen model aktivnosti. | Jakov Biškup | Activity model |
| 2. 11. 2026. | Ažurirana shema baze: dodana OAuth polja za korisnike, pojednostavljene koordinate aktivnosti, dodani CHECK constrainti i trigger za provjeru dostupnosti dodataka; ažurirani testni podaci. | Erik Mikšič | `schema.sql` i `dummy_data.sql` |
| 3. 11. 2026. | Dovršen model korisnika i poboljšan model aktivnosti; spojene promjene sheme baze i testnih podataka. | Jakov Biškup | Users i Activity modeli; ažurirana baza |
| 5. 11. 2026. | U modelu izleta zamijenjena lokacija sastanka zasebnim koordinatama geografske širine i dužine. | Erik Mikšič | Atributi `meetingPointLatitude` i `meetingPointLongitude` |
| 5. 11. 2026. | Izrađen prvi dio početnog blockout rasporeda korisničkog sučelja. | Jana Furdi | Početni blockout dizajn |
| 5. 11. 2026. | Započet model izleta. | Jakov Biškup | `trips.models.ts`|
| 6. 11. 2026. | Dodane početne backend rute. | Dražen Grgurić | Backend rute |
| 9. 11. 2026. | Dodan Trip model; UNIQUE ograničenja zamijenjena parcijalnim UNIQUE indeksima radi podrške neaktivnim zapisima. | Jakov Biškup | Trip model i izmjene SQL ograničenja |
| 10. 11. 2026. | Dodan Event model te dorađeni modeli korisnika, izleta i dodataka. | Jakov Biškup | User, Trip, Event i Addon modeli |
| 10. 11. 2026. | Dodani prikazi popisa i detalja aktivnosti te middleware za Owner ulogu i odjavu. | Ivor Trstenjak | Prikazi aktivnosti, Owner middleware i logout |
| 10. 11. 2026. | Ažurirani testni podaci za bazu. | Ivor Trstenjak | `dummy_data.sql` |
| 11. 11. 2026. | Dodane backend rute za dodavanje i izmjenu aktivnosti te pregled događaja; uveden `requireOrganizer`. | Dražen Grgurić | Rute za aktivnosti, `/events` i `/events/:id` |
| 11. 11. 2026. | Izrađeni radni (WIP) viewovi početne stranice, popisa događaja i detalja događaja. | Jana Furdi | EJS prikazi za home, events i events/:id |
| 12. 11. 2026. | Dodana konfiguracija `trust proxy` za produkcijsku Google prijavu; javna aplikacija postavljena na `https://izleti.xyz/`. | Florijan Gotal | Produkcijska konfiguracija i javna aplikacija |
| 12. 11. 2026. | Integrirane promjene više razvojnih grana; povezani backend i frontend te dovršene dorade profilne slike i odjave. | Jakov Biškup | Integracija grana, profilna slika i logout |
| 16. 11. 2026. | Dokumentirana baza, izrađen ER dijagram u PlantUML-u, preimenovane/numerirane dokumentacijske datoteke i dodane mape za dijagrame. | Erik Mikšič | `docs/4-Arhitektura-i-oblikovanje.md`, `docs/puml/` i `docs/assets/diagrams/` |
| 16. 11. 2026. | Izrađeni prikazi za dodavanje i uređivanje aktivnosti te prilagođena vidljivost kontrola prema korisničkim ulogama. | Ivor Trstenjak | EJS prikazi `activities/add` i `activities/:id/edit`; kontrole za Admin i Organiser |
| 16. 11. 2026. | Vraćen konceptualni ER dijagram uz implementacijski; dodana tablica arhitekturnih odluka i UML dijagram razreda. | Jakov Biškup | `docs/4-Arhitektura-i-oblikovanje.md` i pripadajući dijagrami |
| 16. 11. 2026. | Uređen README prema predlošku i dodane datoteke potrebne za dokumentaciju. | Jakov Biškup | `README.md` i dokumentacijska struktura |
| 17. 11. 2026. | Izrađen administratorski panel za dodjelu korisničkih uloga, uključujući frontend i backend. Dodan filter na stranici aktivnosti. | Ivor Trstenjak | Administratorski panel i sučelje filtera aktivnosti |
| 17. 11. 2026. | Dovršeno dodavanje aktivnosti; dodana pretraga po nazivu i kategoriji te poruke za neispravan unos. | Dražen Grgurić | Backend za dodavanje aktivnosti i filtriranje po nazivu/kategoriji |
| 17. 11. 2026. | Prošireno filtriranje aktivnosti po lokaciji i rasponu trajanja. | Dražen Grgurić | `filterActivities` u `activities.model.ts` |
| 17. 11. 2026. | Dodani dijakritički znakovi te zahtjevi za ocjenjivanje izleta i vodiča. | Erik Mikšič | `docs/1-Projekt.md` i povezani zahtjevi |
| 18. 11. 2026. | Dovršena poglavlja Projekt, Analiza zahtjeva i Obrasci uporabe; dodatno uređeni dokumentacija arhitekture, pregled aktivnosti grupe, tjedni plan, README i početna stranica dokumentacije. | Jakov Biškup | `docs/1-Projekt.md`, `docs/2-Analiza zahtjeva.md`, `docs/3-Obrasci-uporabe.md`, `docs/4-Arhitektura-i-oblikovanje.md`, `A-Pregled-aktivnosti-grupe.md`, `README.md`, `Home.md` |
| 18. 11. 2026. | Povezano filtriranje aktivnosti na frontend i backend; pretraga i filtri aktivnosti sada se šalju putem GET forme. | Ivor Trstenjak | Frontend i backend filtriranje aktivnosti; GET forma za pretragu |
| 18. 11. 2026. | Dodani podaci o korištenju AI alata u projektnoj dokumentaciji. | Erik Mikšič | `Home.md` – korištenje AI alata |
| 18. 11. 2026. | Dopunjena projektna dokumentacija podacima o korištenju AI alata. | Dražen Grgurić | `Home.md` – korištenje AI alata |
| 19. 11. 2026. | Pregledan prvi dio projektne dokumentacije. | Jana Furdi | Pregled dokumentacije – prvi dio |
| 19. 11. 2026. | Dovršeno preusmjeravanje korisnika nakon prijave na stranicu kojoj je prvotno pokušao pristupiti. Dodan i zajednički prikaz za funkcionalnosti u izradi. | Ivor Trstenjak | `Preserve login return destinations`; `under-construction` partial view |
| 19. 11. 2026. | Provedeno potpuno testiranje aplikacije, dodani dodatni testovi za novu funkcionalnost te promjene spojene u glavnu granu. Jedan test ostao je neuspješan zbog neusklađenosti testnih podataka i koda, dok je ostalo testiranje prošlo. | Luka Čubek | Testna grana, dodatni testovi i rezultati testiranja |
| 19. 11. 2026. | Integrirane sve funkcionalnosti u glavnu granu i postavljene u produkcijsko okruženje. | Jakov Biškup | `main`; produkcijska aplikacija: [izleti.xyz](https://izleti.xyz/) |
| 19. – 20. 11. 2026. | Dovršeni preostali dijelovi dokumentacije, uključujući dijagram obrazaca uporabe, dijagram razmještaja i pripadajuću analizu te opis javnog postavljanja aplikacije. | Florijan Gotal | Poglavlja 3.1, 6.1 i 6.3 dokumentacije |
| 20. 11. 2026. | Provedene završne dorade projektne dokumentacije, uključujući upute za instalaciju i konfiguraciju, dokumentaciju ispitivanja, UML dijagram postavljanja te dorade poglavlja Home, Analiza zahtjeva i Arhitektura. Dokumentacija je spojena u glavnu granu. | Jakov Biškup | `README.md`, `Home.md` i datoteke u `docs/`; UML dijagrami |
| 20. 11. 2026. | Dodani zapisi o izvođenju komponentnih i integracijskih testova. | Luka Čubek | Dokumentacija rezultata komponentnog i integracijskog testiranja |
| 20. 11. 2026. | Izrađena video demonstracija rada aplikacije. | Ivor Trstenjak | [Video](https://drive.google.com/file/d/1adONSj133L-aNItnB8KN_mb0FsGuhEoU/view) |

## A.4 Pregled promjena u repozitoriju

**Prikaz aktivnosti repozitorija:** [LINK NA LIVE VERZIJU](https://github.com/SuninDarknes/izLETI/graphs/contributors?all=1)
 ![Contributors](./assets/images/contributors_18112026.png)


Graf loše prikazuje ili ne prikazuje slijedeće stavke:
- Jakov Biškup (MrMirror01) je dodavao predloške za dokumentaciju zbog čega ima prevelik broj dodanih linija; također radi puno malih commitova umijesto manje većih
- Florijan Gotal (SuninDarkness) radio je na postavljanju stranice te većina tog posla nije vidljiva na GitHub repozitoriju
- Erik Mikšič zabunom je koristio dva account-a za pristup repozitoriju pa je statistika podijeljena
- Jana Furdi radila je na dizajnu stranice što nije vidljivo iz broja commit-ova i promjenjenih linija koda
- Luka Čubek bio je zadužen za ispitivanje i planiranje što nije direktno vidljivo iz statistika; također, iz nepoznatog razloga neki njegovi commitovi se ne prikazuju (npr. commit `105bd1b`)

## A.5 Ključni inženjerski izazovi i rješenja

| Izazov | Poduzeta radnja | Ishod ili preostalo ograničenje |
| --- | --- | --- |
| Modeliranje dodataka na događaju u bazi podataka | Erik, Jakov i Florijan raspravili su o mogućnostima, te nakon par iteracija zaključili da je zbog mogućnosti izrade statistike bolje pojednostavit model podataka | Pojednostavljeni model podataka na način da su dodatci sada globalni i generički |
| Na deployanoj stranici nije radio Google login iako je radio u lokalnom testiranju | Ivor i Florijan su proučili problem, konfigurirali trust proxy i Google API | Google login sada radi i na deployanoj stranici |