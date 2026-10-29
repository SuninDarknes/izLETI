# Backend funkcije za pristup bazi

## Korisnici i uloge

- getUserById(userId), getUserByEmail(email)
- getUsers(nameContains, roleId, page, pageSize)
- getUserRoles(userId)
- addRole(userId, role), removeRole(userId, role)
- getUsersByRole(role) (npr. svi vodiči)

## Izleti (Trips)

- getTripById(tripId) (s aktivnostima, tagovima i dodatcima)
- getFilteredTrips(nameContains, location, categoryIds, tagIds, priceFrom, priceTo, durationFrom, durationTo, page, pageSize, sortBy)
- createTrip, updateTrip, deleteTrip
- setTripActivities(tripId, activityIds), setTripTags(tripId, tagIds)
- getTripAddons(tripId), createAddon(tripId, data), updateAddon, deleteAddon

## Aktivnosti, kategorije, tagovi (uključuje i GPS vodič)

- getActivities(categoryId?, nameContains?)
- getTripActivities(tripId) (s koordinatama za kartu)
- getNearbyActivities(tripId, lat, lng, radiusM) (točke blizu korisnika)
- CRUD za Activities, ActivityCategory, TripTags
- getAllActivityCategories(), getAllTripTags()

## Događaji (Events)

- getEventById(eventId)
- getFilteredEvents(nameContains, dateFrom, dateTo, priceFrom, priceTo, location, categoryIds, tagIds, minFreeSpots, stateIds, page, pageSize, sortBy)
- getEventsByTrip(tripId, onlyUpcoming)
- getEventFreeSpots(eventId) (kapacitet minus osobe u aktivnim rezervacijama)
- createEvent(tripId, ...), updateEvent, setEventState(eventId, state) (hidden / planned / cancelled / done)
- getEventAddons(eventId), addEventAddon(eventId, addonId, ...), removeEventAddon(...)

## Vodiči

- getEventGuides(eventId)
- getGuideEvents(userId, dateFrom, dateTo)
- assignGuide(eventId, userId), removeGuide(eventId, userId)
- getAvailableGuides(eventId) (vodiči bez preklapanja termina)
- getEventsMissingGuides()

## Rezervacije

- getReservationById(reservationId) (s događajem, izletom, dodatcima i stanjem)
- getUserReservations(userId, state?)
- getEventReservations(eventId, state?)
- getFilteredReservations(userId, eventId, state, dateFrom, dateTo, page, pageSize)
- createReservation(userId, eventId, numberOfPeople, eventAddonIds)
- setReservationState(reservationId, state) (pending / odbijena / prihvaćena / izlet gotov)
- cancelReservation(reservationId)
- getReservationAddons(reservationId)

## Statistika i izvoz

- getReservationCount(dateFrom, dateTo, groupBy)
- getEventOccupancy(dateFrom, dateTo)
- getRevenue(dateFrom, dateTo, groupBy)
- getTopTrips(limit, ...), getTopCategories(limit, ...), getTopAddons(limit, ...)
- exportReservations(filters) → CSV
