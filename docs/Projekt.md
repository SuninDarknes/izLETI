# Opis problema i granice sustava

## Opis projekta

izLETI je aplikacija za pregled i rezervaciju turističkih izleta i aktivnosti. Korisnici mogu pronaći događaj koji ih zanima i rezervirati ga, a organizatori mogu pripremati izlete i upravljati rezervacijama.

Aktivnosti i izleti mogu se ponovno koristiti. Tako ista aktivnost može biti dio više izleta, a isti izlet može se održati u više različitih termina.

## Osnovni pojmovi

- **Aktivnost** – pojedina aktivnost ili mjesto koje se posjećuje, npr. muzej ili vidikovac. Ima opis i lokaciju.
- **Izlet** – jedna ili više aktivnosti složenih određenim redoslijedom.
- **Događaj** – održavanje izleta u određenom terminu, s dodijeljenim vodičem i dostupnim dodatnim uslugama (npr. prijevoz ili oprema).

Rezervira se događaj, a ne izlet općenito.

## Korisničke uloge

Korisnik može imati više uloga.

- **User** – pregledava i pretražuje događaje, rezervira ih, bira dodatne usluge te pregledava i otkazuje svoje rezervacije.
- **Organiser** – dodaje aktivnosti, izlete i događaje, određuje kapacitete, dodjeljuje vodiča te potvrđuje ili odbija rezervacije.
- **Admin** – pretražuje korisnike i dodjeljuje im ili oduzima uloge.
- **Owner** – pregledava statistiku rezervacija, popunjenosti, prihoda i popularnosti aktivnosti i dodatnih usluga.

Vodič se dodjeljuje događaju, ali njegove zasebne mogućnosti u aplikaciji još nisu određene.

## Što aplikacija obuhvaća

- Prijavu putem Google računa.
- Pregled, pretraživanje i rezervaciju događaja.
- Dodatne usluge uz rezervaciju, poput prijevoza ili najma opreme.
- Obavijest o rezervaciji e-poštom.
- Pregled i otkazivanje vlastitih rezervacija.
- Upravljanje aktivnostima, izletima i događajima.
- Pregled i obradu rezervacija za organizatore.
- Dodjeljivanje korisničkih uloga.
- Pregled statistike.
- Prikaz aktivnosti, znamenitosti i lokacije korisnika na karti.

## Još nije određeno

- Pravila otkazivanja i točan tijek promjene statusa rezervacije.
- Zasebne mogućnosti vodiča u aplikaciji.
- Hoće li biti moguće ocjenjivati vodiče.
- Točan format izvoza statistike.
- Detalji automatske provjere kapaciteta i GPS prepoznavanja blizine lokacija, koji se spominju u projektnom zadatku.
