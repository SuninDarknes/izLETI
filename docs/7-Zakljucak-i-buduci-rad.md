# 7. Zaključak i budući rad

**Cilj:** Objektivno procijeniti i dokumentirati konačni opseg onoga što je tim isporučio, kritički se osvrnuti na najvažnije inženjerske spoznaje stečene tijekom razvoja programa te identificirati realne mogućnosti nadogradnje.

## 7.1 Rezultati projekta

Trenutna aplikacija omogućuje autentifikaciju Google računom. Uloge korisnicima dodjeljuje administrator kroz administratorsko sučelje. Sučelje web aplikacije se prilagođava ovisno o ulogama prijavljenog korisnika, a korisnicima se zabranjuje pristup stranicama za koje nemaju odgovarajuću ulogu.
Korisnik trenutno vidi samo početnu stranicu i protoip stranice za pretraživanje izleta koja još nije povezana s bazom.
Organizator može dodavati, uređivati i pretraživati aktivnosti.

## 7.2 Izazovi i naučene lekcije

U ranijim iteracijama dizajna baze pobali smo organizirati dodatke na izletima na način da budu dostupni samo na jednom izletu. Ovo je dovelo do kompliciranog modela podataka te bi dovelo do poteškoća kod izrade statistike dodataka. Zbog toga smo odlučili da postoje generički dodatci koji se dodaju na događaj (a ne izlet) uz pojašnjenje.

Na početku razvoja projekta napredak je bio raspodijeljen preko mnogo grana u git repozitoriju te se nisu provodila česta spajanja što je dovelo do problema u konzistenciji, puno različih verzija istog koda na različitim granama, problema kod spajanja...
U budućnosti ćemo uvesti češća spajanja grana sa main-om i jasniju komunikaciju oko toga na kojoj se grani nalaze promjene.

## 7.3 Budući rad

Najveći prioritet za budući rad je dovršiti osnovne funkcionalnosti koje su navedene među [zahtjevima](./2-Analiza-zahtjeva.md).