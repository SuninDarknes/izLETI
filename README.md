# izLETI

**izLETI** je aplikacija za organizaciju, pretraživanje i rezervaciju turističkih događaja.

**Projekt na kolegiju:** Ovu je aplikaciju razvio studentski tim u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu (FER).

## Opis aplikacije

**izLETI** je aplikacija za pregled i rezervaciju turističkih izleta i aktivnosti. Korisnicima omogućuje jednostavno pronalaženje i rezervaciju izleta, dok organizatorima olakšava upravljanje ponudom, terminima, vodićima, kapacitetima i rezervacijama. Tijekom izleta aplikacija služi kao digitalni vodič koji prikazuje informacije o obližnjim lokacijama.

**Ključne funkcionalnosti**

- autentifikacija uz pomoć Google OAuth API-ja
- različito sučelje ovisno o ulogama korisnika
- pregledavanje, dodavanje i uređivanje aktivnosti

Za potpuni opseg, zahtjeve, oblikovanje i dokaze ispitivanja pogledajte [docs](docs/Home.md).

<a id="deployment"></a>
## Postavljanje (engl. deployment)

**Javno dostupna aplikacija:** [izleti.xyz](https://izleti.xyz)

**Isprobajte:** Prijavite se uz pomoć Google računa te pregledajte i filtrirajte popis aktivnosti na */activities*

**Demonstracija:** Za isprobavanje svih mogućnosti potrebno je dodjeliti si odgovarajuće uloge, što zahtjeva pristup admin računu ili bazi podataka. Za isprobavanje vidi [postupak postavljanja lokalnog okruženja](#quick-start).

**Ograničenja:** Trenutno je upogonjen samo jednostavni prototip sa osnovnim funkcionalnostima autentifikacije te pregledavanja i kreiranja aktivnosti

[Vodič za postavljanje i pokretanje](docs/6-Postavljanje-instalacija-i-konfiguracija.md#63-javno-postavljanje-i-administracija) opisuje smještaj aplikacije (engl. hosting) koji tim stvarno koristi.

<a id="quick-start"></a>
## Brzi početak / instalacija

**Preduvjeti:**
- instaliran PostgreSQL
- instaliran Node.js i npm package manager
- napravljena baza podataka
    - pokrenuta naredba iz [sheme baze](./docs/baza/schema.sql)
    - po želji napuniti bazu sa [dummy podatcima](./docs/baza/dummy_data.sql)
- konfigurirati Google client za autentifikaciju

1. Klonirati repozitorij i instalirati node module

```bash
git clone https://github.com/SuninDarknes/izLETI.git
cd izLETI
cd src
npm install
```

2. Napraviti .env file u [src folderu](./src), unutra kopirati sadržaj [primjera .env datoteke](./.env.example) i prilagoditi za svoje okruženje

3. Pokrenuti aplikaciju slijedećom naredbom (pozicionirati se u src folder):

```bash
npx tsx --env-file=.env server.ts
```

**Adresa:** [http://localhost:8080/](http://localhost:8080/)

**Konfiguracija:** Sva potrebna konfiguracija nalazi se u [.env.example](./.env.example), a detalje vidi u [tablici konfiguracijskih varijabli](./docs/6-Postavljanje-instalacija-i-konfiguracija.md#lokalna-konfiguracija-env).

Za provjeru radi li server provjerite [početnu stranicu](http://localhost:8080/), za provjeru radi li povezivanje s bazom provjerite [health stranicu](http://localhost:8080/health), a za provjeru radi li Google OAuth API provjerite [stranicu za prijavu](http://localhost:8080/auth/login). Za detaljnije upute za postavljanje pogledajte [projektnu dokumentaciju](./docs/6-Postavljanje-instalacija-i-konfiguracija.md).

## Tehnologije

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
|Google OAuth 2.0 | Autentifikacija korisnika | Omogućuje jednostavnu autentifikaciju korisnika bez potrebe za vlastitu implementaciju koja je sklona sigurnosnim propustima.
| Node.js | Poslužitelj i API | Svi članovi tima upoznati su s tehnologijom. Omogućuje izvođenje JavaScript (TypeScript) koda na poslužiteljskoj strani. |
| Express | Web-framework za poslužiteljsku aplikaciju | Svi članovi tima upoznati su s tehnologijom. Olakšava definiranje ruta i obradu HTTP zahtjeva, a middleware omogućuje jednostavniju implementaciju zajedničke logike, primjerice provjere autentifikacije i ovlasti korisnika.
|TypeScript	| Programski jezik za implementaciju aplikacije	| Omogućuje provjeru tipova tijekom razvoja, što olakšava otkrivanje određenih pogrešaka i održavanje koda.
| PostgreSQL | Baza podataka | Svi članovi tima su upoznati s tehnologijom. Relacijski model omogućuje dosljedno definiranje odnosa među objektima i ograničenja nad podatcima što olakšava modeliranje potrebnih entiteta.
| EJS | Sustav predložaka za generiranje HTML-a | Svi članovi tima upoznati su s tehnologijom. Omogućuje generiranje dinamičkih HTML stranica na poslužiteljskoj strani na temelju podataka aplikacije. Za složenije interakcije bez ponovnog učitavanja stranice potrebna je dodatna JavaScript logika na klijentskoj strani.
| Bootstrap | CSS-framework | Iako nemaju svi članovi tima iskustva sa ovim frameworkom, on znatno ubrzava i olakšava izgradnju responzivnog dizajna web aplikacije.

<a id="team-members"></a>
## Članovi tima

| Član | Glavna uloga ili doprinos |
| --- | --- |
| [Jakov Biškup](https://github.com/MrMirror01) | Voditelj tima, model podataka na poslužitelju |
| [Luka Čubek](https://github.com/lukacubek) | Dokumentacija, testiranje |
| [Florijan Gotal](https://github.com/SuninDarknes) | Postavljanje stranice |
| [Dražen Grgurić](https://github.com/drazen-grguric) | Implementacija ruta na poslužitelju |
| [Jana Furdi](https://github.com/janaf4) | Dizajn sučelja, programiranje EJS view-ova |
| [Erik Mikšić](https://github.com/erikmiksic) | Dizajn baze podataka |
| [Ivor Trstenjak](https://github.com/IvorTrstenjak) | Google login, programiranje ruta i view-ova |

Za detaljnije raspisane doprinose i podjelu poslova vidi [pregled aktivnosti grupe](./docs/A-Pregled-aktivnosti-grupe.md).

<a id="license"></a>

**Status licence:** Projekt koristi standardnu [Apache licencu](./LICENSE)

<a id="ai-usage"></a>
## Uporaba umjetne inteligencije [![AI Usage: Disclosed](https://img.shields.io/badge/AI%20Usage-Disclosed-blue.svg)](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf)

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

**Izjava:** Tijekom projekta korišteni su alati umijetne inteligencije. Za razvoj ideja, dokumentacije, kodiranje i debugiranje korišteni su LLM alati kao što su ChatGPT, Claude i GitHub Copilot. Sav generirani kod i dokumentaciju tim je provjerio, razumio i po potrebi popravio i nadogradio. Za detaljniji pregled vidi [izjavu o upotrebi umijetne inteligencije](./docs/Home.md#izjava-o-uporabi-umjetne-inteligencije)

<a id="code-of-conduct-and-support"></a>
## Kodeks ponašanja i podrška [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

Od članova tima očekuje se pridržavanje **Kodeksa ponašanja studenata** Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i [Etičkog kodeksa IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html).

---

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora [Vlade Sruka](https://www.fer.unizg.hr/vlado.sruk), licenciranom pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
