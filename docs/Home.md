# izLETI — Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** [2026./2027.]  
**Tim:** L-A-11.2 izLETI  
**Nastavnik:** Vlado Sruk  
**Asistent / demonstrator:** Miljenko Krhen / Roko Markov

## Pregled projekta

**Cilj:** Aplikacija izLETI korisnicima omogućuje jednostavno pronalaženje i rezervaciju turističkih izleta, dok organizatorima olakšava upravljanje ponudom, terminima, vodićima, kapacitetima i rezervacijama.

Organizatori izleta nude velik broj aktivnosti na razlicitim lokacijama i u razlicitim terminima. Korisnicima treba jednostavan pregled ponude, cijena i slobodnih mjesta, a organizatorima podrska pri upravljanju terminima, kapacitetima, vodičima i dodatnim uslugama.

izLETI je aplikacija za pregled i rezervaciju turistickih izleta i aktivnosti. Korisnici mogu pronaći događaj koji ih zanima i rezervirati ga, a organizatori mogu pripremati izlete i upravljati rezervacijama. Tijekom samog izleta aplikacija na mobilnom uredaju sluzi kao jednostavan digitalni vodic koji prikazuje informacije o lokacijama u blizini korisnika.

Aktivnosti i izleti mogu se ponovno koristiti. Tako ista aktivnost moze biti dio vise izleta, a isti izlet moze se odrzati u vise razlicitih termina, što ubrzava i olakšava proces organizacije.

U aplikaciji prate se i ocijene izleta i vodiča što omogućuje lakši odabir korisnicima i daje povratnu informaciju organizatorima. Vlasnik turističke agencije može pregledavati korisne statistike koje mu olakšavaju upravljanje agencijom.

**Aplikacija i osnovno postavljanje:** [README repozitorija](../README.md#quick-start)  
**Javno dostupna aplikacija:** pogledajte [README – Postavljanje](../README.md#deployment)

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
| Iteracija 1 | [Poveznica na demonstraciju ili inačicu projekta] | [Poveznica na video Demo 1, ako je snimljen] |
| Završni pregled | [Poveznica na završnu inačicu projekta] | [Poveznica na video završne demonstracije, ako je snimljen] |

Dokumentacija se kontinuirano ažurira kako se aplikacija razvija.

## Organizacija projekta i razvojni proces

**Način rada:**
- svaki tjedan u ponedeljak voditelj tima šalje popis poslova sa određenim rokom za svakog čljana tima u discord server (kanal #popis-poslova)
- kada netko završi neki od zadanih zadataka, šalje kratak opis napravljenog u discord server (kanal #progres-updates)
- sve promjene rade se na zasebnim granama koje se kroz pull requestove mergeaju u main granu
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
| Claude | Sonet 5.5 | Jakov Biškup | Generiranje dummy podataka za bazu
| Claude | Opus 5.5 | Florijan Gotal | Generiranje prezentacije iz dokumentacije, pomoć pri postavljanju stranice

### Opseg doprinosa umjetne inteligencije

| Stranica, datoteka ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| [npr. 3. Obrasci uporabe, UC-002] | [Izrada nacrta / preoblikovanje / prijevod / izvor dijagrama / sažimanje] | [Kratak opis] | [Ulaz zadan alatu; dodane, ispravljene ili uklonjene činjenice] | [Stranica dokumentacije, `.puml` datoteka, PR] |

Stranice i artefakti koji nisu navedeni iznad izrađeni su bez pomoći generativne umjetne inteligencije. [Po želji: kao dodatne retke navedite kod ili ispitivanja izrađena uz pomoć umjetne inteligencije.]

### Provjera generiranog sadržaja

| Provjera | Kako je provedena | Dokaz |
| --- | --- | --- |
| Činjenična točnost | [Svaka tvrdnja o funkcionalnostima, ponašanju ili arhitekturi uspoređena je s pokrenutom aplikacijom i kodom] | [Imena pregledavatelja; poveznice na zahtjev za uključivanje promjena (PR) ili zadatak] |
| Nema tvrdnji o neostvarenim funkcionalnostima | [Provjereno je da opisane funkcionalnosti, ispitivanja i rezultati stvarno postoje; planirani rad označen je kao planiran] | [Usporedba s odjeljkom 5.4 (Ispitivanje) i odjeljkom 7.1 (Zaključak)] |
| Dosljednost s drugim stranicama | [Nazivi, ID-ovi i dijagrami provjereni su prema Analizi zahtjeva, Obrascima uporabe, Arhitekturi i oblikovanju te Ispitivanju] | [Kontrolni popis ili bilješka pregleda] |
| Izvori dijagrama | [Generirani PlantUML je iscrtan, ispravljen i odgovara implementiranom sustavu] | [`.puml` datoteka i izrađena slika] |
| Povjerljivi sadržaj | [Kako je tim osigurao da u upite ili dokumentaciju nisu unesene tajne, pristupni podaci ni osobni podaci] | [Primijenjeni postupak] |

### Pogreške pronađene u izlazu umjetne inteligencije

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| [Netočna, izmišljena ili iz predloška preuzeta tvrdnja] | [Pregled, ispitivanje ili usporedba s aplikacijom] | [Ispravak s poveznicom] |

<!-- UPUTA: Zabilježite stvarne ispravke ili napišite „Nisu utvrđene”. Općenita tvrdnja poput „sav tekst je pregledan” nije dokaz; dokaz su prethodne tablice. Tim mora moći objasniti svaku rečenicu koju objavi. -->

<details>
<summary><strong>Primjer zapisa uporabe umjetne inteligencije</strong></summary>

**Primjer — CrisisMap:**

| Stranica ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| 3. Obrasci uporabe, UC-002 | Izrada nacrta | Prvu inačicu glavnog i alternativnih tijekova | Tim je zadao stvarna polja obrasca i uklonio granu prijave u sustav koja u aplikaciji ne postoji | Primjer PR #31 |
| Sekvencijski dijagram, podnošenje prijave | Izvor dijagrama | Nacrt PlantUML-a | Tim je uskladio nazive sudionika s komponentama i uklonio korak slanja obavijesti koji nije implementiran | `diagrams/report-submission.puml` (primjer) |

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| U tekstu je stajalo da se obavijesti dostavljaju unutar jedne minute | Usporedba s Ispitivanjem (5.4): dostava nikada nije ispitana | Tvrdnja je uklonjena; obavijesti su navedene pod Budućim radom |
| Nacrt je kopirao primjer zahtjeva F-005 iz predloška kao projektni zahtjev | Usporedba s vlastitim popisom zahtjeva tima | Zamijenjeno stvarnim zahtjevom tima |

**Analiza primjera:** Svaki redak navodi stranicu ili datoteku, ono što je alat generirao i ono što je tim promijenio. Pogreške su tipične za generiranu dokumentaciju: funkcionalnost koja ne postoji i tekst predloška prikazan kao činjenica o projektu. Tvrdnje poput „AI je korišten svugdje” ili „sav tekst je pregledan” nije moguće provjeriti. Ovo je nastavni scenarij, a ne opis objavljenog projekta.

</details>