# izLETI — Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** 2026./2027.
**Tim:** L-A-11.2 izLETI  
**Nastavnik:** Vlado Sruk  
**Asistent / demonstrator:** Miljenko Krhen / Roko Markov

## Pregled projekta

**Cilj:** Aplikacija izLETI korisnicima omogućuje jednostavno pronalaženje i rezervaciju turističkih izleta, dok organizatorima olakšava upravljanje ponudom, terminima, vodićima, kapacitetima i rezervacijama.

Organizatori izleta nude velik broj aktivnosti na razlicitim lokacijama i u razlicitim terminima. Korisnicima treba jednostavan pregled ponude, cijena i slobodnih mjesta, a organizatorima podrška pri upravljanju terminima, kapacitetima, vodičima i dodatnim uslugama.

izLETI je aplikacija za pregled i rezervaciju turistickih izleta. Korisnici mogu pronaći događaj koji ih zanima i rezervirati ga, a organizatori mogu pripremati izlete i upravljati rezervacijama. Tijekom samog izleta aplikacija na mobilnom uredaju sluzi kao jednostavan digitalni vodic koji prikazuje informacije o lokacijama u blizini korisnika.

Aktivnosti i izleti mogu se ponovno koristiti. Tako ista aktivnost moze biti dio vise izleta, a isti izlet moze se odrzati u vise razlicitih termina, što ubrzava i olakšava proces organizacije.

U aplikaciji prate se i ocijene izleta i vodiča što omogućuje lakši odabir korisnicima i daje povratnu informaciju organizatorima. Vlasnik turističke agencije može pregledavati korisne statistike koje mu olakšavaju upravljanje agencijom.

**Aplikacija i osnovno postavljanje:** [README – brzi početak](../README.md#quick-start)  
**Javno dostupna aplikacija:** pogledajte [README – javno dostupna aplikacija](../README.md#deployment)
**Cijela dokumentacija u PDF-u:** [izLETI-dokumentacija.pdf](./deliverables/izLETI-dokumentacija.pdf)

## Članovi tima i uloge

Ažurirani popis članova, njihovih GitHub profila i glavnih uloga ili doprinosa nalazi se u [README-u repozitoriju](../README.md#team-members).

## Kazalo dokumentacije

| Stranica | Svrha |
| --- | --- |
| [1. Opseg projekta](1-Projekt.md) | Problem, cilj i granice projekta |
| [2. Analiza zahtjeva](2-Analiza-zahtjeva.md) | Zahtjevi, ograničenja i sljedivost |
| [3. Obrasci uporabe](3-Obrasci-uporabe.md) | Akteri i reprezentativne interakcije korisnika |
| [4. Arhitektura i oblikovanje](4-Arhitektura-i-oblikovanje.md) | Glavne odluke oblikovanja, struktura, podaci i ponašanje |
| [5. Ispitivanje](5-Ispitivanje.md) | Pristup ispitivanju, stvarni rezultati i poznati nedostaci |
| [6. Postavljanje, instalacija i konfiguracija](6-Postavljanje-instalacija-i-konfiguracija.md) | Lokalna instalacija, konfiguracija, javno postavljanje i administracija |
| [7. Zaključak i budući rad](7-Zakljucak-i-buduci-rad.md) | Zaključak i moguća daljnja poboljšanja |
| [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md) | Aktivnosti tima, doprinosi i izazovi |

## Ključne točke projekta

| Kontrolna točka | Demonstracija | Video |
| --- | --- | --- |
| Iteracija 1 | [izleti.xyz](https://izleti.xyz) | [video](https://drive.google.com/file/d/1adONSj133L-aNItnB8KN_mb0FsGuhEoU/view) |

Dokumentacija se kontinuirano ažurira kako se aplikacija razvija.

## Organizacija projekta i razvojni proces

**Način rada:**
- svaki tjedan u ponedeljak voditelj tima šalje popis poslova sa određenim rokom za svakog čljana tima u discord server (kanal `#popis-poslova`)
- kada netko završi neki od zadanih zadataka, šalje kratak opis napravljenog u discord server (kanal `#progres-updates`)
- sve promjene rade se na zasebnim granama koje se kroz pull requestove spajaju u main granu
- ako je neka cijelina gotova i mergeana u main, zatvori se odgovarajući Issue na GitHub-u
- svaki tjedan u četvrtak imamo radni sastanak sa svim članovima tima (kao i asistentom i demonstratorom) gdje raspravljamo o napretku te o tome što treba slijedeće napraviti

**Praćenje trenutačnih zadataka i nedostataka:** [Issues](https://github.com/SuninDarknes/izLETI/issues)

## Pravila dokumentacije

Dokumentacija se sastoji od međusobno povezanih Markdown stranica. Obavezni UML dijagrami izrađuju se u PlantUML-u, uz PlantUML izvor u dokumentaciji čuva se i čitljiva slika.

## Akademski integritet, ponašanje i licenciranje

README repozitorija sadrži projektnu [izjavu o uporabi umjetne inteligencije](../README.md#ai-usage), [informacije o kodeksu ponašanja i podršci](../README.md#code-of-conduct-and-support) te [status licence ili ponovne uporabe](../README.md#license). Pristupni podaci i druge tajne nikada se ne objavljuju u dokumentaciji niti dijele u običnim porukama.

## Izjava o uporabi umjetne inteligencije

Kratak sažetak: [README – Uporaba umjetne inteligencije](../README.md#ai-usage). Ovaj odjeljak bilježi koji su alati korišteni, za koju dokumentaciju ili kod te kako je tim provjerio rezultat. Slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

### Korišteni alati

| Alat | Inačica ili model | Koristio/la | Glavna svrha |
| --- | --- | --- | --- |
| ChatGPT | GPT-6 | Jakov Biškup | Debuggiranje, provjera konzistentnosti i poboljšavanje dokumentacije, povjera i poboljšanje sheme baze podataka, generiranje PlantUML dijagrama |
| ChatGPT | GPT-6 | Jana Furdi | Pomoć pri repliciranju dizajna koristeći Bootstrap |
| Claude | Sonet 5.5 | Jakov Biškup | Generiranje dummy podataka za bazu |
| Claude | Opus 5.5 | Florijan Gotal | Generiranje prezentacije iz dokumentacije, pomoć pri postavljanju stranice, generiranje UML dijagrama |
| GitHub Copilot | GPT-5 mini | Ivor Trstenjak | Pomoć pri povezivanju sa Google API-jem |
| Claude | Opus 5.5 | Dražen Grgurić | Prijedlozi za backend rute i funkcije koje su potrebne, debuggiranje |
| Claude | Opus 5.5 | Erik Mikšič | Provjera konzistentnosti sheme. Prijedlozi za bazu. Generiranje ER diagrama |
| Claude | Sonet 5.5 | Luka Čubek | Pomoć pri izradi testova i dokumentacije |

### Opseg doprinosa umjetne inteligencije

| Stranica, datoteka ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| Dummy podatci za testiranje | Generiranje podataka iz sheme baze | Datoteku sa dummy podatcima | Tim je zadao shemu baze. Promijenjeni su retci u `Roles` i `EventStates` tablicama kako bi odgovarale specifikaciji projekta | [dummy_data.sql](./baza/dummy_data.sql) |
| UML dijagram razreda | Generiranje UML dijagrama | .puml datoteku dijagrama | Tim je zadao potrebne tipove, razrede i enumeracije. Nisu bile potrebne promijene. | [dijagram_razreda.svg](./assets/diagrams/dijagram_razreda.svg) |
| Model podataka na backendu | Pomoć pri programiranju | Preinake za neke upite bazi, poboljšanje strukture koda i bacanja iznimaka | Kod je pisan ručno te je AI korišten samo za pomoć pri debuggiranju i nadogradnji | [model](/src/model/)
| Tjedni plan rada i Pregled aktivnosti grupe | Generiranje dokumenta iz podataka | Markdown datoteku sa tjednim planom rada i tablicu aktivnosti | Tim je priložio povijest dogovora iz Discord servera i povijest commit-ova te uskladio generirane dokumenate sa stvarnim planom rada i aktivnostima | [Pregled aktivnosti](./A-Pregled-aktivnosti-grupe.md) i [Plan rada](./Tjedni_plan_rada_iz_discorda.md) |
| Prijedlozi za backend rute i funkcije | Ideje za funkcije i rute koje još nisu bile na popisu | Popis funkcija, prijedlozi u kojim rutama bi se koristile. | Tim je zadao već postojeći popis ruta i funkcija koji je bio smišljen te neke osnovne funkcionalnosti koje su poželjne | [Backend funkcije za pristup bazi](<./spec/Backend funkcije za pristup bazi.md>) |
| Implementacijski ER dijagram | Generiranje ER diagrama |.puml datoteku dijagrama | Tim je zadao sve potrebne informacije za izradu dijagrama i nije bilo potrebe za naknadnim promjenama.| [ER dijagram](<./assets/diagrams/4-2-izleti-data-ERD.svg>) |
| SQL datoteka | Pregled SQL datoteke |Popis predloženih preinaka | Tim je priložio SQL datoteku koju je model pregledao i predložio preinake. | [schema.sql](<./baza/schema.sql>) |
| Testovi | Pomoć pri izradi testova | Testove | Tim je priložio dokumentaciju i trenutno stanje projekta. Testovi su provjereni i pregledani te je provedeno i ručno testiranje ključnih dijelova aplikacije. | [testovi](/tests/) |
| EJS pogledi | Pomoć pri konverziji dizajna u HTML i Bootstrap kod | Dorada HTML koda te dodavanje potrebnih Bootstrap klasa kako bi se ostvario željeni dizajn | Tim je proizveo dizajn stranice te ključne dijelove HTML koda koji su tada nadopunjeni upotrebom umijetne inteligencije. Kod je provjeren te jer testirana responzivnost. Kako su pogledi u ovom ranom stadiju razvoja još skloni promijenama nisu ispravljeni svi problemi (CSS u HTML datoteci, dupliciranje koda), ali su ti ispravci u planu za budući razvoj. | [views](/src/views/) |

Stranice i artefakti koji nisu navedeni iznad izrađeni su bez pomoći generativne umjetne inteligencije 
**Napomena:** kako ovu tablicu tim nije ažurno održavao tijekom cijelog procesa izrade aplikacije već je naknadno izrađena (kao i zbog preglednosti tablice) moguće je da smo neke manje detalje izostavili (debuggiranje, generiranje manjih dijelova koda, manji ispravci u dokumentaciji i kodu...) Manje promijene i provjere uz pomoć umijetne inteligencije rađene su u gotovo svim dijelovima projekta.

### Provjera generiranog sadržaja

| Provjera | Kako je provedena | Dokaz |
| --- | --- | --- |
| Činjenična točnost | Svi generirani dijelovi dokumentacije su provjereni i po potrebi ispravljeni | pregledao: Jakov Biškup, [plan rada](./Tjedni_plan_rada_iz_discorda.md#Jakov-provjeriti-dokumentaciju) |
| Izvori dijagrama | Iz generiranog `.puml` koda napravljeni su dijagrami koji su provjereni i usklađeni sa stvarnim sustavom | [dijagrami](./assets/diagrams/) |
| Povjerljivi sadržaj | Svi povjerljivi podatci nalaze se u .env datoteci koja se nikad ne stavlja na repozitorij i ne šalje AI alatima. Kod i dokumentacija se detaljno pregledava prije nego što se push-a na repozitorij. | Na [GitHub repozitoriju](https://github.com/SuninDarknes/izLETI) nema objavljenih tajni |

### Pogreške pronađene u izlazu umjetne inteligencije

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| U dummy podatcima generirani retci u `Roles` i `EventStates` nisu odgovarali potrebama projekta | Prilikom implementacije i testiranja dolazi do grešaka jer očekivani retci ne postoje u bazi podataka. | Zamijenjeni su problematični retci |
| Alat je generirao kod za komunikaciju s bazom umijesto da je koristio gotovo sučelje iz modela podataka | Pregledavanje generiranog koda | Kod je prerađen na način da koristi model |
| Alat je generirao kod koji nije bio usklađen sa najnovijom verzijom baze podataka jer je radio sa zastarijelom shemom | Usporedba sa shemom baze | Davanje nove sheme baze alatu |
