# 4. Arhitektura i oblikovanje

| Arhitekturni pogled | Ključno inženjersko pitanje | Primijenjeni model ili dijagram |
| :--- | :--- | :--- |
| **Strategija rješenja** | Koji stil i temeljne odluke određuju program? | Tablica odluka (odjeljak [4.1](#41-ključne-arhitekturne-odluke)) |
| **Struktura podsustava** | Koji su glavni dijelovi i kako komuniciraju? | Dijagram komponenata |
| **Model podataka** | Kako su strukturirani trajni podaci programa? | Relacijski ER dijagram |
| **Struktura koda** | Kako su dodijeljene odgovornosti i ključne klase? | Reprezentativni dijagram razreda |
| **Dinamičko ponašanje** | Kako moduli surađuju pri obradi ključnih transakcija? | Sekvencijski dijagram |
| **Stanja sustava** | Kako ključni domenski objekt mijenja svoja stanja? | Dijagram stanja |
| **Fizički razmještaj** | Na kojim se izvršnim čvorovima program izvodi? | Dijagram razmještaja (poglavlje 6) |

---

## 4.1 Ključne arhitekturne odluke

| Odluka | Razmatrana alternativa | Projektno specifično obrazloženje i kompromis |
| --- | --- | --- |
| Odvajanje poslužiteljskih ruta, modela i prikaza | — | [ADR-01](#adr-01) |
| Poslužiteljsko generiranje HTML prikaza | Renderiranje na klijentskoj strani | Budući da se velik dio aplikacije temelji na prikazu podataka, obrazaca i popisa, poslužiteljsko generiranje prikaza pojednostavljuje razvoj i smanjuje potrebu za složenijom klijentskom logikom. Kompromis je što su za dio interakcija potrebni dodatni zahtjevi poslužitelju i ponovno generiranje prikaza. |
| Relacijska pohrana podataka | — | Podaci aplikacije imaju jasno definirane međusobne odnose, primjerice između korisnika, rezervacija, događaja, izleta i aktivnosti. Relacijski model omogućuje dosljedno povezivanje podataka i očuvanje ograničenja stranih ključeva. Kompromis je potreba za unaprijed definiranom strukturom baze i migracijama prilikom promjena modela podataka. |
| Odvajanje pojmova aktivnost, izlet i događaj | Svaki događaj se kreira zasebno | [ADR-02](#adr-02) |
| Prijava korisnika putem Google OAutha | Lokalna prijava putem e-pošte i lozinke | Korištenje Google računa uklanja potrebu za implementacijom vlastitog sustava lozinki i njihovom sigurnom pohranom u bazi. Aplikacija i dalje vodi vlastite korisničke račune i uloge. Kompromis je ovisnost o vanjskom pružatelju identiteta. |
| Podrška za više korisničkih uloga po računu | Samo jedna uloga po računu | Jedan korisnik može imati više uloga, a dostupne funkcionalnosti ovise o dodijeljenim ulogama. Time se omogućuje da isti korisnik, primjerice, bude i administrator i organizator. Kompromis je složenije upravljanje dodjelom uloga i povezanim funkcionalnostima korisničkog računa. |
| Kontrola pristupa pomoću poslužiteljske provjere korisničkih ovlasti | — | Ovlasti se provjeravaju na poslužiteljskoj strani kako korisnici ne bi mogli pristupiti funkcionalnostima drugih uloga izravnim slanjem zahtjeva. Time se zaštita ne oslanja samo na skrivanje pojedinih elemenata sučelja. Kompromis je potreba za dosljednom provjerom ovlasti na svim zaštićenim rutama. |
| Digitalni vodić za korištenje na mobitelu kao dio web aplikacije | Zasebna mobilna aplikacija | [ADR-03](#adr-03) |
| Globalni generički dodatci koji se pridodjeljuju događaju | Dodatci specifični za izlet | Korištenjem globalnih dodataka kojima se pri dodjeljivanju događaju dodaju detalji omogućuje jednostavniju strukturu podatka te statistiku za dodatke. Ovakav pristup je malo više ograničavajući za organizatore jer ne mogu napraviti dodatak specifično za potrebe pojedinog izleta.
| Slike se za aktivnosti se povlače sa Google Places API-ja | Upload slike za aktivnost | Ovako izbjegavamo upload datoteka na poslužitelj što može dovesti do sigurnosnih propusta i zahtijevati kompliciraniju konfiguraciju hostinga. Također ovo ubrzava proces izradnje aktivnosti, ali i smanjuje slobodu korisnika da koristi željenu sliku. |

## 4.2 Gradivni blokovi i UML dijagram komponenata

**Cilj:** Prikazati logičku podjelu programa na komponente, njihova sučelja i vanjske integracije. Dijagram komponenata prikazuje logičku organizaciju, dok dijagram razmještaja prikazuje fizičko izvođenje. Ovaj prikaz ažurirajte kako sustav poprima konačan oblik.

**Dijagram komponenata:** [Ugradite čitljiv UML dijagram komponenata.]  
**PlantUML izvor:** [Poveznica na odgovarajuću `.puml` datoteku.]

| Komponenta | Odgovornost | Razlog za ovu granicu |
| --- | --- | --- |
|  |  |  |

Započnite crtanjem granice oko predloženog sustava. Unutar nje prepoznajte dijelove s različitim odgovornostima; planiranu bazu podataka aplikacije smjestite unutar granice, a usluge trećih strana izvan nje. Važne veze označite podatkom ili uslugom koja njima prolazi. Logička komponenta može biti modul unutar jedne poslužiteljske aplikacije: zaseban pravokutnik ne znači zasebno postavljenu uslugu. Tijekom implementacije ažurirajte dijagram kada se promijene odgovornosti ili veze. U završnoj inačici čitatelj treba moći povezati njegove dijelove s kodom. Dijagram razmještaja odgovara na pitanje gdje se ti dijelovi stvarno izvode.

<details>
<summary><strong>Granica sustava, odgovornosti i vanjske ovisnosti</strong></summary>

**Primjer — CrisisMap:** Predložena arhitektura podržava podnošenje prijava kriznih događaja, prikaz na karti i obavijesti o potvrđenim prijavama.

![Dijagram komponenata sustava CrisisMap](./assets/diagrams/4-1-crisismap-system-CMP.svg)

**Slika 4.1. Dijagram komponenata sustava CrisisMap**

**PlantUML izvor:** [izvor](./puml/4-1-crisismap-system-CMP.puml)

| Dio | Odgovornost | Razlog za ovu granicu |
| --- | --- | --- |
| Web-klijent | Prikazuje prijave i prikuplja podatke za novu prijavu. | Korisnička interakcija odvojena je od pravila prijave i trajne pohrane. |
| API za prijave | Prihvaća zahtjeve za rad s prijavama i vraća odgovore. | Odgovornosti izložene putem HTTP-a odvojene su od obrade prijava. |
| Usluga za prijave | Primjenjuje pravila prijave i pristupa pohranjenim prijavama. | Pravila provjere valjanosti i pohrane prijava imaju jasno mjesto odgovornosti. |
| Proces za obavijesti | Određuje korisnike koji trebaju primiti obavijest i traži od vanjskog pružatelja da je pošalje. | Obrada obavijesti odvojena je od odgovaranja na korisnikov zahtjev za prijavu. |

**Analiza primjera:** Vanjska granica odvaja predloženi sustav od pružatelja kartografskih usluga i pružatelja obavijesti. Unutarnja granica grupira API za prijave, uslugu za prijave i proces za obavijesti unutar jedne poslužiteljske aplikacije; njihovi zasebni simboli prikazuju predložene odgovornosti, a ne neovisno postavljene usluge. PostgreSQL pohranjuje podatke aplikacije, dok pružatelj kartografskih usluga osigurava kartografske pločice. Strelice sažimaju ovisnosti, a ne redoslijed transakcije; taj redoslijed prikazuje sekvencijski dijagram. Izostavite proces za obavijesti i Firebase Cloud Messaging ako obavijesti nisu dio odobrenog opsega. Pružatelja prijave u sustav uključite samo ako to zahtijeva odobreni zadatak. Kako implementacija napreduje, ispravite svaku predloženu granicu koja se pokaže netočnom; završni dijagram mora odgovarati onome što je tim izgradio. Jedan koherentan prikaz komponenata korisniji je od nekoliko gotovo jednakih inačica s proturječnim vezama.

</details>

<a id="model-podataka"></a>
## 4.3 Model podataka i oblikovanje razreda

[Detaljan opis strukture baze podataka](./baza/baza.md)

### 4.3.1 ER dijagram i model podataka

**Cilj:** Prikazati važne pohranjene entitete, njihove identifikatore i veze te dovoljno atributa za razumijevanje podataka aplikacije. ER dijagram odvojen je od reprezentativnog UML dijagrama razreda u nastavku.

**ER dijagrami:**  
![Konceptualni ER dijagram](./assets/diagrams/er_dijagram.png)
**Slika 4.2.1 Konceptualni ER dijagram sustava izLETI**

![Implementacijski ER dijagram](./assets/diagrams/4-2-izleti-data-ERD.svg)

**Slika 4.2.2 Implementacijski ER dijagram sustava izLETI**  
**Izvor dijagrama:** [izvor](./puml/4-2-izleti-data-ERD.puml)  
**Implementacija:** [implementacija](./baza/schema.sql)


### 4.3.2 Reprezentativni UML dijagram razreda

**Dijagram razreda:** 
![Dijagram razreda](./assets/diagrams/dijagram_razreda.svg)
**Slika 4.3 Dijagram razreda modela podataka**
**PlantUML izvor:** [izvor](./puml/model_class_diagram.puml) 
**Referenca na kod pri završnom pregledu:** [implementacija](/src/model)

## 4.4 Ponašanje tijekom izvođenja

**Cilj:** Objasniti jednu važnu interakciju među dijelovima koji se izvode i životni ciklus jednog smislenog objekta. Odaberite primjere koji otkrivaju odluke ili neuspješne putove umjesto izrade dijagrama za svaku CRUD radnju.

### 4.4.1 Reprezentativni UML sekvencijski dijagram

**Cilj:** Prikazati redoslijed poruka za jedan reprezentativni scenarij i odgovore na važnu alternativu.

**Scenarij:** [Naziv interakcije; dodajte UC ID ako postoji.]  
**sekvencijski dijagram:** [Ugradite čitljiv UML sekvencijski dijagram.]  
**PlantUML izvor:** [Poveznica na odgovarajuću `.puml` datoteku.]

<details>
<summary><strong>Odabir lokacije, provjera valjanosti i podnošenje prijave</strong></summary>

**Primjer — CrisisMap:** Građanin podnosi prijavu kriznog događaja nakon što ručno odabere lokaciju ili zatraži položaj uređaja. Interakcija prikazuje i što se događa kada je pristup lokaciji odbijen, podaci prijave nisu valjani ili pohrana ne uspije.

![Sekvencijski dijagram podnošenja prijave kriznog događaja](./assets/diagrams/4-4-crisismap-report-submission-SD.svg)

**Slika 4.4. Sekvencijski dijagram podnošenja prijave kriznog događaja**

**PlantUML izvor:** [izvor](./puml/4-4-crisismap-report-submission-SD.puml)

**Analiza primjera:** Dva načina odabira lokacije te alternative provjere i pohrane imaju različite posljedice za korisnika; usporedite ih s odgovarajućim obrascem uporabe i njegovim alternativnim tijekovima. API preglednika za lokaciju mogućnost je preglednika; web-klijent, API, usluga i pohrana odgovaraju prikazu komponenata. Odaberite grane koje pomažu objasniti scenarij vašeg projekta i završni dijagram uskladite s implementiranom interakcijom.

</details>

### 4.4.2 Reprezentativni UML dijagram stanja

**Cilj:** Prikazati važna stanja jednog domenskog objekta ili eksplicitno upravljanog načina rada sustava te događaje ili uvjete koji ih mijenjaju.

**Vlasnik stanja i razlog odabira:** [Navedite objekt ili način rada sustava, kako se njegovo stanje prepoznaje i zašto su prijelazi važni.]  
**Dijagram stanja:** [Ugradite čitljiv UML dijagram stanja.]  
**PlantUML izvor:** [Poveznica na odgovarajuću `.puml` datoteku.]

<details>
<summary><strong>Složeno stanje sustava: koordinacija događaja i dostupnost usluge</strong></summary>

**Primjer — CrisisMap:** Ovaj primjer ne prikazuje životni ciklus jednog domenskog objekta, nego dva neovisna aspekta stanja cijelog sustava CrisisMap. Jedna regija opisuje način koordinacije kriznog događaja, a druga opaženu dostupnost usluge. Budući da se ta dva aspekta mogu mijenjati neovisno jedan o drugome, prikazani su kao ortogonalne regije istog složenog stanja sustava.

![Dijagram stanja prijave kriznog događaja](./assets/diagrams/4-5-crisismap-system-SM.svg)

**Slika 4.5. Dijagram stanja sustava s ortogonalnim regijama**

**PlantUML izvor:** [izvor](./puml/4-5-crisismap-system-SM.puml)

**Analiza primjera:** Vlasnik stanja u ovom je primjeru sustav CrisisMap, a ne pojedinačna prijava kriznog događaja. Dvije ortogonalne regije opisuju stanja koja vrijede istodobno: način koordinacije kriznog događaja i dostupnost usluge. Promjena stanja u jednoj regiji ne mora promijeniti stanje u drugoj; primjerice, aktivni krizni događaj može postojati dok je usluga potpuno ili djelomično dostupna.

Prijelazi imaju imenovane događaje ili uvjete, a grane nakon oporavka poslužiteljskog sustava uzimaju u obzir da pružatelj kartografskih usluga može i dalje biti nedostupan. Time primjer pokazuje situaciju u kojoj ortogonalne regije imaju stvarnu semantičku svrhu, a nisu samo način vizualnog grupiranja elemenata.

Ovo je napredniji primjer dijagrama stanja. Koristite takav oblik samo ako sustav stvarno održava dva ili više međusobno neovisnih aspekata stanja koji se mogu mijenjati istodobno. Za projekt u kojem je važan životni ciklus jednog objekta, primjerice prijave, rezervacije ili narudžbe, jednostavniji dijagram stanja tog objekta obično je prikladniji. Složenost dijagrama nije kriterij vrednovanja.

Pri završnom pregledu svaki prikazani prijelaz i uvjet usporedite s ponašanjem koje implementirana aplikacija stvarno podržava.

</details>

## 4.5 Zapisi arhitekturnih odluka

**Cilj:** Sačuvati razloge i obrazložiti odabrane važne arhitekturne odluke kada tablica u odjelku 4.1 nije dovoljna za očuvanje konteksta, razmatranih alternativa i prihvaćenih kompromisa.

Napišite nekoliko ADR-a za važne odluke čije obrazloženje, alternative i kompromis treba sačuvati. Ostale arhitekturne odluke dovoljno je zabilježiti u tablici.

**Detaljni zapis arhitekturne odluke (engl. Architecture Decision Record, ADR), kada odluka zahtijeva dodatno objašnjenje:**

<a id="ADR-01"></a>
### ADR-01: Odvajanje pojmova aktivnost, izlet i događaj

| Polje | Zapis odluke |
| --- | --- |
| Kontekst i cilj | U aplikaciji je potrebno omogućiti ponovnu uporabu aktivnosti i izleta te njihovo održavanje u različitim terminima. Pritom je potrebno razlikovati izlet kao cjelinu koja se može organizirati od konkretnog događaja, odnosno pojedinog održavanja izleta. Rezervacija se mora odnositi na konkretan termin održavanja. |
| Kriteriji odluke | Omogućiti ponovnu uporabu aktivnosti u više izleta, održavanje istog izleta u više termina te definiranje specifičnih podataka za svaki termin, poput vodiča i kapaciteta. Model treba omogućiti povezivanje rezervacije s konkretnim događajem. |
| Razmatrane alternative | Svaki događaj kreirati zasebno, bez zasebnog modeliranja pojmova aktivnosti, izleta i događaja. |
| Odluka i obrazloženje | Odvojiti pojmove aktivnosti, izleta i događaja kao zasebne modele. Aktivnost se može koristiti u više izleta, dok se isti izlet može održavati u više različitih termina. Za svaki događaj definiraju se termin, vodič i kapacitet, a rezervacija se veže uz konkretan događaj. Time se omogućuje ponovna uporaba aktivnosti i izleta, uz prihvaćanje većeg broja povezanih entiteta i složenijeg povezivanja podataka. |
| Status | Prihvaćeno |

<a id="ADR-02"></a>
### ADR-02: Globalni generički dodatci koji se pridodjeljuju događaju

| Polje | Zapis odluke |
| --- | --- |
| Kontekst i cilj | Aplikacija omogućuje dodjeljivanje dodataka događajima. Potrebno je odabrati način modeliranja dodataka koji omogućuje njihovu ponovnu uporabu i jednostavnije praćenje statistike. |
| Kriteriji odluke | Pojednostaviti strukturu podataka, omogućiti ponovnu uporabu dodataka te omogućiti vođenje statistike za pojedine dodatke. |
| Razmatrane alternative | Definiranje dodataka specifičnih za pojedini izlet. |
| Odluka i obrazloženje | Koristiti globalne generičke dodatke koji se pridodjeljuju događaju. Prilikom dodjeljivanja događaju definiraju se potrebni detalji dodatka. Time se pojednostavljuje struktura podataka i omogućuje lakše praćenje statistike za dodatke. Kompromis je smanjena fleksibilnost organizatora jer ne mogu definirati dodatke specifične za potrebe pojedinog izleta. |
| Status | Prihvaćeno |

<a id="ADR-03"></a>
### ADR-03: Globalni generički dodatci koji se pridodjeljuju događaju

| Polje | Zapis odluke |
| --- | --- |
| Kontekst i cilj | Aplikacija objedinjuje pregled i rezervaciju izleta s digitalnim vodičem koji korisnici koriste tijekom izleta. Potrebno je odabrati platformu na kojoj će digitalni vodič biti dostupan, uzimajući u obzir opseg razvoja i održavanja aplikacije. |
| Kriteriji odluke | Objediniti pregled, rezervaciju i korištenje digitalnog vodiča u jednoj aplikaciji. Izbjeći dodatni razvoj i održavanje zasebne mobilne aplikacije. Omogućiti korištenje na mobilnim uređajima. |
| Razmatrane alternative | Razvoj zasebne mobilne aplikacije za korištenje digitalnog vodiča. |
| Odluka i obrazloženje | Digitalni vodič implementirati kao dio postojeće web-aplikacije, prilagođene korištenju na mobilnim uređajima. Time se izbjegava razvoj i održavanje zasebne mobilne aplikacije te se pregled i rezervacija izleta objedinjuju s digitalnim vodičem. Kompromisi su potreba za prilagodbom sučelja različitim načinima korištenja aplikacije te ovisnost o mogućnostima preglednika i dopuštenju korisnika za pristup lokaciji. |
| Status | Prihvaćeno |

ADR pišite samo za odluku čije će obrazloženje ostati važno i nakon promjene implementacije. Značajna promjena odluke može se zabilježiti novim ADR-om koji zamjenjuje stari; rutinski odabiri alata ne trebaju detaljne zapise. Promjene dogovorenog opsega pripadaju zahtjevima i njihovoj povijesti promjena; povratna informacija o zadatku ostaje uz odgovarajući zadatak.

<details>
<summary><strong>Odabir jednog poslužiteljskog sustava umjesto zasebno postavljenih usluga</strong></summary>

**Primjer — CrisisMap, ADR-01:**

| ID | Datum | Odluka | Razmatrana alternativa | Obrazloženje i kompromis | Status |
| --- | --- | --- | --- | --- | --- |
| ADR-01 | [Datum odluke] | Jedan poslužiteljski API za obradu prijava | Zasebno postavljene usluge za prijave i resurse | Manji napor postavljanja i integracije za odobreni opseg; kvar poslužiteljskog sustava može utjecati na obje funkcionalnosti. | Prihvaćeno |

### ADR-01: Jedan poslužiteljski API za obradu prijava

| Polje | Zapis odluke |
| --- | --- |
| Kontekst i cilj | Tim tijekom jednog semestra mora izraditi i javno postaviti prijavljivanje kriznih događaja i prikaz usmjeren na kartu. |
| Kriteriji odluke | Tim može izraditi, integrirati, postaviti i objasniti rješenje; komponente i dalje imaju prepoznatljive odgovornosti. |
| Razmatrane alternative | **Jedan poslužiteljski sustav:** moduli dijele aplikaciju koja se postavlja kao cjelina. **Zasebne usluge:** svaka se može izvoditi neovisno, ali zahtijeva dodatni rad na integraciji i postavljanju. |
| Odluka i obrazloženje | Odabrati jedan poslužiteljski sustav s jasno odvojenim odgovornostima vezanim uz prijave. Time se smanjuje rad na postavljanju, uz prihvaćanje da kvar tog sustava može istodobno utjecati na rad s prijavama. |
| Status | Prihvaćeno. |

**Analiza primjera:** Strategija rješenja navodi trenutačni pristup; ADR-01 čuva alternative i kriterije koji su do njega doveli. Dijagrami komponenata i razmještaja trebaju odražavati odabrani pristup kako se sustav razvija. Zaseban ADR koristan je za važnu odluku, a ne za svaki odabir alata.

</details>

## 4.6 Zajednička pravila oblikovanja (engl. Cross-cutting concerns)

**Implementirani mehanizmi:**

| Aspekt | Mehanizam | Pravilo | Mjesto primjene |
| --- | --- | --- | --- |
| Sigurnost | Pristup ograničen u skladu s ulogama | Za svaki zahtijev se provjeravaju uloge te se na poslužiteljskoj strani određuje ima li korisnik pravo pristupiti ruti. | [middleware](/src/middleware/authorization.ts)
| Validacija podataka | Provjera valjanosti podataka | Provjera valjanosti podataka radi se na korisničkoj strani, zatim na poslužitelju te na kraju i u bazi podatka. | [shema baze](./baza/schema.sql), [model podataka](/src/model/)
|Smanjenje međuovisnosti | Pristup bazi podataka | Pristup bazi podataka omogućen je isključivo kroz sučelje koje pruža model podataka | [model podataka](/src/model/)
| Struktura baze podataka | Surogat id stupac | Za sve tablice uvodi se stupac 'id' zbog lakšeg upravljanja bazom podataka | [dijagram baze](./assets/diagrams/4-2-izleti-data-ERD.svg)

## 4.7 Arhitekturni rizici i tehnički dug

**Cilj:** Navesti stvarne tehničke ili domenske rizike i svjesno prihvaćene kompromise oblikovanja, njihove posljedice i način na koji ih tim obrađuje.

**Tehnički rizici i dug**

| Rizik ili kompromis | Posljedica | Odgovor na rizik  |
| --- | --- | --- |
| Postavljanje aplikacije na vlastiti poslužitelj | Potencijalni sigurnosni propusti, nedostatak službene tehničke podrške | Praćenje sigurnosnih dobrih praksi. |
| Profilna slika se učitava direktno sa Google servera | Google ponekad blokira zahtijev sa greškom `429 Too Many Requests` te se slika ne učitava ispravno | U budućnosti implementirati spremanje slike na poslužitelju kako se ne bi slali česti zahtijevi na Google API. |

**Poslovni ili domenski rizici, ako su značajni**

| Rizik | Posljedica | Odgovor na rizik |
| --- | --- | --- |
| Ovisnost o vanjskim pružateljima usluga | Nedostupnost Google OAutha, usluge za slanje e-pošte ili kartografskih usluga može otežati prijavu, potvrdu rezervacije ili korištenje digitalnog vodiča. | Predvidjeti razumljive poruke o pogreškama i omogućiti korištenje dijelova aplikacije koji ne ovise o nedostupnoj usluzi. |
| Istovremeno rezerviranje posljednjih slobodnih mjesta | Više korisnika može istodobno pokušati rezervirati isto posljednje slobodno mjesto, što može dovesti do prekoračenja kapaciteta događaja. | Provjeru i zauzimanje kapaciteta provoditi kao transakciju. |
| Nedostupnost odgovarajuće slike na Google Places API-ju | Može dovesti do aktivnosti bez slike ili aktivnosti sa neodgovarajućom slikom | Ako nisu pronađene slike ili slike nisu odgovarjuće pruža se opcija *placeholder* slike. |

---


>**Završna provjera:** Usporedite dijagrame komponenata, podataka, razreda, sekvencijski dijagram i dijagram stanja s implementiranim kodom, ponašanjem aplikacije i stvarnim razmještajem. Ažurirajte zastarjele opise oblikovanja i objasnite svaku važnu razliku koja ostaje; poveznice na odgovarajući kod ili ispitivanja korisne su kada odgovaraju na konkretno pitanje.