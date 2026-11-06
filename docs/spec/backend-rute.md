## Autentikacija

| **Metoda** | **Ruta**              | **Uloga**  | **Opis / funkcija modela**                                                                                         |
|------------|-----------------------|------------|--------------------------------------------------------------------------------------------------------------------|
| GET        | /auth/google          | svi        | Preusmjeravanje na Google prijavu.                                                                                 |
| GET        | /auth/google/callback | svi        | getUserByEmail; pri prvoj prijavi kreira korisnika s početnom ulogom (još nije određena). Preusmjerava na /events. |
| POST       | /auth/logout          | prijavljen | Završetak sesije.                                                                                                  |

## Pregled događaja (events.routes.ts)

| **Metoda** | **Ruta**    | **Uloga** | **Opis / funkcija modela**                                                                                |
|------------|-------------|-----------|-----------------------------------------------------------------------------------------------------------|
| GET        | /events     | svi       | Popis događaja s filterima i sortiranjem (query). getFilteredEvents; EJS: events/list.                    |
| GET        | /events/:id | svi       | Detalji događaja: getEventById, getEventFreeSpots, getEventAddons, getTripActivities; EJS: events/detail. |

## Rezervacije korisnika (reservations.routes.ts)

| **Metoda** | **Ruta**                 | **Uloga**             | **Opis / funkcija modela**                                                                                                 |
|------------|--------------------------|-----------------------|----------------------------------------------------------------------------------------------------------------------------|
| GET        | /events/:id/reserve      | user                  | Obrazac za rezervaciju (broj osoba, dodatne usluge): getEventAddons.                                                       |
| POST       | /events/:id/reserve      | user                  | createReservation (provjera kapaciteta događaja i usluga u jednoj transakciji). Pri uspjehu redirect na /reservations/:id. |
| GET        | /reservations            | user                  | Moje rezervacije: getUserReservations (opcionalno filter po statusu).                                                      |
| GET        | /reservations/:id        | vlasnik ili organiser | Detalji rezervacije sa statusom, izletom i aktivnostima: getReservationById, getReservationAddons.                         |
| POST       | /reservations/:id/cancel | vlasnik               | cancelReservation; oslobađa mjesta.                                                                                        |

## Digitalni vodič i karta (JSON)

| **Metoda** | **Ruta**                              | **Uloga**                      | **Opis / funkcija modela**                                                             |
|------------|---------------------------------------|--------------------------------|----------------------------------------------------------------------------------------|
| GET        | /api/events/:id/activities            | user s rezervacijom            | Aktivnosti izleta s koordinatama za Leaflet kartu: getTripActivities.                  |
| GET        | /api/events/:id/nearby?lat&lng&radius | user s potvrđenom rezervacijom | Aktivnosti u blizini korisnika: getNearbyActivities. Samo za događaj koji je u tijeku. |

## Organizator: aktivnosti (activities.routes.ts)

| **Metoda** | **Ruta**               | **Uloga** | **Opis / funkcija modela**                                       |
|------------|------------------------|-----------|------------------------------------------------------------------|
| GET        | /activities            | organiser | Popis aktivnosti: getActivities (filter po kategoriji i nazivu). |
| GET        | /activities/new        | organiser | Obrazac za novu aktivnost (naziv, opis, lokacija, kategorija).   |
| POST       | /activities            | organiser | Spremanje nove aktivnosti.                                       |
| GET        | /activities/:id/edit   | organiser | Obrazac za izmjenu.                                              |
| POST       | /activities/:id        | organiser | Spremanje izmjene.                                               |
| POST       | /activities/:id/delete | organiser | Brisanje aktivnosti.                                             |

## Organizator: izleti (trips.routes.ts)

| **Metoda** | **Ruta**           | **Uloga** | **Opis / funkcija modela**                                                        |
|------------|--------------------|-----------|-----------------------------------------------------------------------------------|
| GET        | /trips             | organiser | Popis izleta.                                                                     |
| GET        | /trips/new         | organiser | Obrazac za novi izlet.                                                            |
| POST       | /trips             | organiser | createTrip; setTripActivities (uređena lista, redoslijed je bitan) i setTripTags. |
| GET        | /trips/:id         | organiser | Detalji izleta: getTripById, getTripAddons.                                       |
| GET        | /trips/:id/edit    | organiser | Obrazac za izmjenu.                                                               |
| POST       | /trips/:id         | organiser | updateTrip, setTripActivities, setTripTags.                                       |
| POST       | /trips/:id/delete  | organiser | deleteTrip.                                                                       |
| POST       | /trips/:id/addons  | organiser | createAddon (dodatak izleta, npr. prijevoz ili oprema).                           |
| POST       | /addons/:id        | organiser | updateAddon.                                                                      |
| POST       | /addons/:id/delete | organiser | deleteAddon.                                                                      |

## Organizator: događaji (events.routes.ts)

| **Metoda** | **Ruta**                           | **Uloga** | **Opis / funkcija modela**                              |
|------------|------------------------------------|-----------|---------------------------------------------------------|
| GET        | /events/new?tripId                 | organiser | Obrazac za novi događaj na temelju izleta.              |
| POST       | /events                            | organiser | createEvent (termin, kapacitet).                        |
| GET        | /events/:id/edit                   | organiser | Obrazac za izmjenu događaja.                            |
| POST       | /events/:id                        | organiser | updateEvent.                                            |
| POST       | /events/:id/state                  | organiser | setEventState (hidden, planned, cancelled, done).       |
| POST       | /events/:id/addons                 | organiser | addEventAddon / izmjena kapaciteta dodatka na događaju. |
| POST       | /events/:id/addons/:addonId/delete | organiser | removeEventAddon.                                       |
| GET        | /api/events/:id/available-guides   | organiser | getAvailableGuides (JSON za odabir vodiča).             |
| POST       | /events/:id/guides                 | organiser | assignGuide.                                            |
| POST       | /events/:id/guides/:userId/delete  | organiser | removeGuide.                                            |

## Organizator: rezervacije (reservations.routes.ts)

| **Metoda** | **Ruta**                  | **Uloga** | **Opis / funkcija modela**                                         |
|------------|---------------------------|-----------|--------------------------------------------------------------------|
| GET        | /events/:id/reservations  | organiser | Rezervacije događaja: getFilteredReservations (filter po statusu). |
| POST       | /reservations/:id/confirm | organiser | setReservationState (prihvaćena); šalje potvrdu e-poštom.          |
| POST       | /reservations/:id/reject  | organiser | setReservationState (odbijena); oslobađa mjesta.                   |

## Administrator (/admin)

| **Metoda** | **Ruta**                            | **Uloga** | **Opis / funkcija modela**                                |
|------------|-------------------------------------|-----------|-----------------------------------------------------------|
| GET        | /admin                              | admin     | Pretraga korisnika (?q=): getUsers.                       |
| GET        | /admin/users/:id                    | admin     | Uloge korisnika: getUserRoles, getAllRoles.               |
| POST       | /admin/users/:id/roles              | admin     | addRole.                                                  |
| POST       | /admin/users/:id/roles/:role/delete | admin     | removeRole (upozorenje ako admin oduzima ulogu sam sebi). |

## Voditelj agencije (/dashboard)

| **Metoda** | **Ruta**                      | **Uloga** | **Opis / funkcija modela**                                                                                   |
|------------|-------------------------------|-----------|--------------------------------------------------------------------------------------------------------------|
| GET        | /dashboard?from&to            | owner     | Statistika: getReservationCount, getEventOccupancy, getRevenue, getTopTrips, getTopCategories, getTopAddons. |
| GET        | /dashboard/export.csv?from&to | owner     | exportReservations (CSV).                                                                                    |

## Vodič (privremeno)

| **Metoda** | **Ruta**      | **Uloga** | **Opis / funkcija modela**                                              |
|------------|---------------|-----------|-------------------------------------------------------------------------|
| GET        | /guide/events | guide     | getGuideEvents. Ovlasti vodiča još nisu određene pa je ruta opcionalna. |
