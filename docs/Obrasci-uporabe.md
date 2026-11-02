# Obrasci uporabe

Ovo su početni obrasci uporabe za glavne funkcionalnosti aplikacije. Oznake F-01, F-02 itd. odnose se na [analizu zahtjeva](2-Analiza-zahtjeva.md).

## OU-01 – Prijava

**Akter:** korisnik aplikacije  
**Zahtjevi:** F-01, F-02

1. Korisnik odabire prijavu Google računom.
2. Prijavljuje se putem Google OAutha.
3. Pristupa funkcionalnostima svojih uloga.

**Rezultat:** korisnik je prijavljen.

Nije određena početna uloga novog korisnika ni detalji neuspjele prijave.

## OU-02 – Pretraživanje događaja

**Akter:** User  
**Zahtjevi:** F-08

1. Korisnik otvara popis događaja.
2. Pretražuje ili sortira događaje prema dostupnim parametrima.
3. Pregledava rezultate.

**Rezultat:** korisnik pronalazi događaje koji ga zanimaju.

## OU-03 – Rezervacija događaja

**Akter:** User  
**Zahtjevi:** F-09, F-10

1. Korisnik odabire događaj.
2. Po želji bira dostupne dodatne usluge.
3. Predaje rezervaciju.

**Rezultat:** rezervacija je evidentirana.

Još nisu određeni svi detalji provjere kapaciteta, početni status rezervacije i trenutak slanja e-pošte.

## OU-04 – Pregled i otkazivanje rezervacije

**Akter:** User  
**Zahtjevi:** F-11

1. Korisnik otvara svoje rezervacije.
2. Pregledava status, podatke o izletu i aktivnosti na karti.
3. Po potrebi odabire otkazivanje rezervacije.

**Rezultat:** korisnik je pregledao rezervaciju ili pokrenuo njezino otkazivanje.

Pravila otkazivanja i promjena statusa još nisu definirani.

## OU-05 – Unos aktivnosti i izleta

**Akter:** Organiser  
**Zahtjevi:** F-04, F-05

1. Organizator dodaje novu aktivnost ili bira postojeću.
2. Sastavlja izlet od jedne ili više aktivnosti u određenom redoslijedu.
3. Sprema izlet.

**Rezultat:** izlet je evidentiran, a aktivnosti se mogu koristiti i u drugim izletima.

## OU-06 – Kreiranje događaja

**Akter:** Organiser  
**Zahtjevi:** F-06, F-07

1. Organizator bira postojeći izlet ili izrađuje novi.
2. Određuje termin događaja i dodjeljuje vodiča.
3. Unosi dostupne dodatne usluge i kapacitete.

**Rezultat:** događaj je evidentiran.

Detalji praćenja ostalih resursa još nisu razrađeni.

## OU-07 – Obrada rezervacije

**Akter:** Organiser  
**Zahtjevi:** F-12

1. Organizator otvara rezervacije događaja.
2. Odabire rezervaciju.
3. Potvrđuje je ili odbija.

**Rezultat:** rezervacija je potvrđena ili odbijena.

Ostala pravila promjene statusa još nisu određena.

## OU-08 – Dodjeljivanje korisničkih uloga

**Akter:** Admin  
**Zahtjevi:** F-02, F-03

1. Administrator pretražuje korisnike.
2. Odabranom korisniku dodjeljuje ili oduzima ulogu.

**Rezultat:** korisnikove uloge su ažurirane.

## OU-09 – Pregled statistike

**Akter:** Owner  
**Zahtjevi:** F-13

1. Owner otvara stranicu statistike.
2. Pregledava podatke o rezervacijama, popunjenosti, prihodima i popularnosti aktivnosti i dodatnih usluga.

**Rezultat:** prikazana je statistika.

Izvoz statistike je predviđen, ali njegov format nije konačno određen.

## OU-10 – Prikaz lokacija na karti

**Akter:** User  
**Zahtjevi:** F-11, F-14

1. Korisnik otvara prikaz rezervacije ili aktivnosti izleta.
2. Otvara kartu s lokacijama aktivnosti i znamenitosti.

**Rezultat:** prikazane su lokacije na karti. Predviđen je i prikaz korisnikove lokacije.

Automatsko prepoznavanje blizine lokacija putem GPS-a još nije razrađeno.

## Dijagram obrazaca uporabe

Dijagram još nije izrađen.
