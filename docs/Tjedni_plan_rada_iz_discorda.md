# Plan poslova po tjednima

## Sažetak ključnih ciljeva

| Tjedan | Glavni cilj |
|---|---|
| - 26.10 | Formiranje tima, organizacija, analiza zahtjeva, pripremanje radnog okruženja |
| 26. 10. – 1. 11. | Pripremiti dokumentaciju, dizajne, bazu i osnovne backend funkcije. |
| 2. 11. – 8. 11. | Imati osnovnu verziju baze i prijave te kreiranje i prikaz izleta, aktivnosti i događaja. |
| 9. 11. – 15. 11. | Spojiti dijelove sustava i deployati barem mali prototip koji se može pregledavati i koristiti. |
| 16. 11. – 22. 11. | Završiti funkcionalnost kreiranja, uređivanja i pregleda aktivnosti, dokumentaciju, testiranje i predaju. |

---

## Tjedan 0: Prije 26.10.

| Odgovorna osoba | Zadatci |
|---|---|
| **Florijan** | Konfiguracija GitHub repozitorija i okruženja za pokretanje stranice na poslužitelju |
| **Erik** | Prvi draft za ER dijagram baze podataka. |
| **Ivor** i **Jakov** | Analiza zahtjeva i raspisivanje GitHub Issues |
| **Svi** | Planiranje arhitekture, podjela poslova, organizacija |

## Tjedan 1: 26. 10. – 1. 11. 2026.

**Zadatci objavljeni:** 26. 10. 2026. u 09:07  
**Opći cilj:** pripremiti podloge za prezentaciju, dizajn, bazu i backend.

| Odgovorna osoba | Zadatci | Rok |
|---|---|---|
| **Luka** | Dovršiti dokumentaciju kako bi se prema njoj mogla složiti prezentacija. | Do kraja utorka, 27. 10. |
| **Florijan** | - | - |
| **Jana** | Izraditi dizajne za najvažnije stranice, uključujući početnu stranicu i pretraživanje događaja. | Do kraja tjedna, 1. 11. |
| **Erik** | Dodati tablicu za ocjene izleta i tablicu za jezike povezanu s vodičem; generirati novu relacijsku shemu; dopuniti atribute i generirati SQL. | Do četvrtka, 29. 10. |
| **Ivor** | Dovršiti login. S Erikom dogovoriti eventualne prilagodbe baze potrebne za login. | Do kraja tjedna, 1. 11. |
| **Dražen** | Napraviti popis važnijih backend funkcija za dohvat i izmjenu podataka u bazi. Primjeri: `getUserRoles(userId)`, `getFilteredEvents(...)`, `addRole(userId, role)`. Nije potrebno popisati baš sve funkcije. | Do četvrtka, 29. 10. |
| **Jakov** | Započeti izradu važnijih funkcija za upite prema bazi na backendu. | Do kraja tjedna, 1. 11. |

**Dogovor za tim:** ako netko procijeni da neće stići izvršiti zadatak u roku ili ima previše posla, treba javiti što ranije kako bi se posao preraspodijelio ili rok produžio.

---

## Tjedan 2: 2. 11. – 8. 11. 2026.

**Zadatci objavljeni:** 1. 11. 2026. u 11:38  
**Glavni ciljevi za osnovnu verziju:**
- baza podataka koja je dostupna u produkciji (ne mora biti konačna verzija)
- prijava u sustav
- osnovno kreiranje aktivnosti, izleta i događaja, bez kategorija, tagova, ocjenjivanja i dodataka vodiča
- prikaz događaja bez filtriranja

Naglasak je na osnovnoj funkcionalnosti i strukturi koju je lako nadograđivati, bez nepotrebnog dupliciranja posla.

| Odgovorna osoba | Zadatci | Rok / napomena |
|---|---|---|
| **Erik** | Dopuniti atribute baze. Razmotriti da opis dodatka specifičan za događaj bude u `EventAddons` (npr. generički dodatak „prijevoz” s opisom konkretnog prijevoza za određeni događaj). Preispitati trebaju li aktivnosti i početnu i završnu koordinatu ili je dovoljna jedna lokacija. Postaviti bazu u produkciju. Dodati korisne `CHECK` constraintove i druga ograničenja koja sprječavaju neispravne podatke. Nakon promjena izvesti bazu i staviti export na Git kako bi članovi tima mogli ažurirati lokalne testne baze. | Do kraja tjedna; produkcijska baza i export važni su za cilj tjedna. |
| **Florijan** | Odrediti prioritete za funkcijske zahtjeve. | U sklopu cilja do 8. 11. |
| **Dražen** | Izraditi backend rute za stranice koje su nužne za osnovnu verziju sustava. | U sklopu cilja do 8. 11. |
| **Ivor** | Dovršiti login. Izraditi middleware koji korisniku dopušta samo početnu stranicu i login. Izraditi middleware za uloge tako da korisnik koji nije admin ne može pristupiti putanji `/admin`. | Login: do utorka, 3. 11.; middlewarei: u sklopu cilja do 8. 11. |
| **Luka** | Osmisliti primjere izleta i aktivnosti na izletima. Osmisliti potrebne tagove za izlete, kategorije aktivnosti i vrste dodataka (npr. prijevoz, hrana, oprema). Testirati sustav kada bude spreman i unijeti primjere izleta. | U sklopu cilja do 8. 11. |
| **Jana** | Izraditi dizajne za potrebne stranice i staviti ih na Git. | Do kraja srijede, 4. 11. |
| **Jakov** | Raditi na modelu za komunikaciju s bazom kako bi backend razvoj bio jednostavniji. | - |

---

## Tjedan 3: 9. 11. – 15. 11. 2026.

**Zadatci objavljeni:** 9. 11. 2026. u 14:07  
**Glavni cilj:** do četvrtka, 12. 11., deployati barem dio sustava koji se može vidjeti i koristiti. Prioritet je spojiti postojeće dijelove i dobiti funkcionalan prototip.

| Odgovorna osoba | Zadatci | Rok / napomena |
|---|---|---|
| **Erik** | Postaviti bazu u produkciju. Nastaviti s doradama baze ako se pojave korisne ideje. | Cilj tjedna; baza treba biti deployana. |
| **Florijan** | Pobrinuti se da deployana stranica radi i točno je iskonfigurirana | Cilj tjedna; prioritetno zbog prototipa. |
| **Jana** | Izraditi EJS viewove za potrebne stranice prema dizajnima. | Cilj tjedna; prioritetno zbog prototipa. |
| **Dražen** | Izraditi backend rute za nužne stranice. Krenuti od funkcionalnosti koje podržava postojeći model, primjerice dodavanja aktivnosti. | Cilj tjedna; prioritetno zbog prototipa. |
| **Ivor** | Prilagoditi login tako da koristi user model umjesto izravnog pristupa bazi. Dovršiti ili prilagoditi middleware za uloge zbog promjena u user modelu. Pomoći Draženu s rutama. | Cilj tjedna. |
| **Luka** | Istestirati funkcije modela koje još nisu dovoljno provjerene. Po želji napisati automatizirane testove. Pripremiti izvještaj o testiranju, po uzoru na dokumentaciju za ispitivanje projekta. Ako stranica postane funkcionalna, testirati i ponašanje na stranici. | Cilj tjedna; testovi su opcionalni, osnovno testiranje i izvještaj su prioritet. |
| **Jakov** | Nastaviti rad na modelu; dovršiti barem modele za izlete (`trips`) i događaje (`events`). | Cilj tjedna. |

### Dodatni prototipni cilj (poruka od 10. 11. u 23:47)

Do kraja srijede, **11. 11.**, bilo bi poželjno imati mali prototip od dvije do tri stranice, primjerice pregledavanje izleta. Cilj je stići spojiti promjene i napraviti deploy prije laboratorijskih vježbi.

- Najvažniji za ovaj kratki cilj: **Florijan, Jana i Dražen**.
- Login je prema poruci trebao raditi na grani `google login`.
- Većina modela bila je dovršena na grani `backend model`.
- Najnovija verzija baze nalazila se na grani za bazu.

---

## Tjedan 4: 16. 11. – 22. 11. 2026.

**Zadatci objavljeni:** 15. 11. 2026. u 13:55  
**Glavni cilj:** završiti praktični dio i dokumentaciju do petka, 20. 11. Predaja dokumentacije je u petak u **23:59**.

### Obvezna funkcionalnost

Potrebno je imati barem jednu funkcionalnu, domenski relevantnu funkcionalnost. Za projekt je odabrana **kreacija, uređivanje i pregled (pretraživanje) aktivnosti**.

Plan rada:

- **Srijeda, 18. 11.:** funkcionalnost treba biti gotova.
- **Četvrtak, 19. 11.:** dokumentacija treba biti gotova.
- **Petak, 20. 11.:** sve promjene trebaju biti live, a dokumentacija predana do 23:59.

| Odgovorna osoba | Zadatci | Rok |
|---|---|---|
| **Erik** | Dokumentirati bazu: ukratko opisati svaki entitet i relaciju, što predstavljaju i zašto postoje; po mogućnosti opisati i atribute. Ažurirati relacijsku shemu da odgovara trenutačnom stanju baze. Popuniti dio vezan uz bazu u dokumentu [4-Arhitektura-i-oblikovanje.md](./4-Arhitektura-i-oblikovanje.md). | Četvrtak, 19. 11. u 23:59 |
| **Florijan** | Proučiti koje UML dijagrame treba uključiti u dokumentaciju i generirati ih pomoću PlantUML-a (`puml`). | Četvrtak, 19. 11. u 23:59 |
| **Jana** | Pročitati sve upute i dostupne primjere za prvu predaju. Provjeriti što sve treba predati i u kojem obliku. Napisati dodatnu dokumentaciju ako se utvrdi da je potrebna. | Četvrtak, 19. 11. u 23:59 |
| **Dražen** | Dovršiti backend rute potrebne za dogovorenu funkcionalnost kreiranja, uređivanja i pregleda aktivnosti. | Srijeda, 18. 11. u 23:59 |
| **Ivor** | Izraditi viewove za stranice koje ulaze u funkcionalnost, s naglaskom na kreiranje, uređivanje i pregled aktivnosti. Sakriti poveznice na stranice kojima korisnik nema pravo pristupa (npr. korisniku koji nije admin ne prikazivati gumb „Admin” u headeru). | Srijeda, 18. 11. u 23:59 |
| **Luka** | Provesti i dokumentirati testiranje modela i stranice. | Četvrtak, 19. 11. u 23:59 |
| **Jakov** | <a id="Jakov-provjeriti-dokumentaciju"><a> Pročitati svu izrađenu dokumentaciju i ispraviti nejasne ili nelogične dijelove. Koordinirati spajanje promjena i pobrinuti se da sve bude spojeno i predano na vrijeme. | Petak, 20. 11. u 23:59 |

### Dodatni dogovori i napomene

- U uputama za predaju spominje se `master` grana. Projekt trenutačno koristi `main`; procjena je da to vjerojatno nije problem, ali dogovoreno je napraviti i `master` granu radi sigurnosti.
- Nakon završetka vlastitih zadataka, članovi tima koji imaju vremena mogu popunjavati preostale dijelove dokumentacije. Predlošci već postoje; potrebno ih je popuniti.