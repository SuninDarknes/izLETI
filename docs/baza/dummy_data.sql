-- Dummy data for testing. Tables are populated in foreign-key dependency order.

-- ---------- Lookup tables ----------

INSERT INTO Roles (id, name, active) VALUES
  (1, 'Admin',    TRUE),
  (2, 'Guide',    TRUE),
  (3, 'Customer', TRUE);

INSERT INTO EventStates (id, name) VALUES
  (1, 'Scheduled'),
  (2, 'Confirmed'),
  (3, 'Completed'),
  (4, 'Cancelled');

INSERT INTO ReservationStates (id, name) VALUES
  (1, 'Pending'),
  (2, 'Confirmed'),
  (3, 'Cancelled'),
  (4, 'Completed');

INSERT INTO ActivityCategories (id, name) VALUES
  (1, 'Culture'),
  (2, 'Food & Drink'),
  (3, 'Nature'),
  (4, 'Water Sports');

INSERT INTO TripTags (id, name) VALUES
  (1, 'Family Friendly'),
  (2, 'Outdoor'),
  (3, 'Romantic'),
  (4, 'History');

INSERT INTO Languages (id, name) VALUES
  (1, 'English'),
  (2, 'Portuguese'),
  (3, 'Spanish');

-- ---------- Users & roles ----------

INSERT INTO Users (id, email, googleId, phone, createdAt, username, active, firstname, lastname, picture, locale, emailverified) VALUES
  (1, 'ana.admin@example.com',   'google-100000000000000001', '+351910000001', '2026-01-05 09:00:00', 'ana_admin',   TRUE, 'Ana',   'Costa',     'https://example.com/pics/ana.jpg', 'en', TRUE),
  (2, 'marco.guide@example.com', 'google-100000000000000002', '+351910000002', '2026-01-10 10:30:00', 'marco_guide', TRUE, 'Marco', 'Silva',     'https://example.com/pics/marco.jpg', 'pt', TRUE),
  (3, 'ines.guide@example.com',  'google-100000000000000003', '+351910000003', '2026-01-12 11:15:00', 'ines_guide',  TRUE, 'Ines',  'Ferreira',  'https://example.com/pics/ines.jpg', 'es', TRUE),
  (4, 'john.smith@example.com',  'google-100000000000000004', '+14155550104', '2026-03-02 14:20:00', 'john_smith',  TRUE, 'John',  'Smith',     NULL,                               'en', TRUE),
  (5, 'emma.jones@example.com',  'google-100000000000000005', NULL,           '2026-04-18 16:45:00', 'emma_jones',  TRUE, 'Emma',  'Jones',     NULL,                               'en', FALSE),
  (6, 'old.user@example.com',    'google-100000000000000006', '+34600000006', '2026-02-01 08:00:00', 'pablo_ruiz',  FALSE, 'Pablo', 'Ruiz',     NULL,                               'es', TRUE);

INSERT INTO UserRole (id, roleId, userId) VALUES
  (1, 1, 1),  -- Ana: Admin
  (2, 2, 2),  -- Marco: Guide
  (3, 2, 3),  -- Ines: Guide
  (4, 3, 4),  -- John: Customer
  (5, 3, 5),  -- Emma: Customer
  (6, 3, 6);  -- Pablo: Customer

INSERT INTO GuideLanguage (id, userId, languageId) VALUES
  (1, 2, 1),  -- Marco: English
  (2, 2, 2),  -- Marco: Portuguese
  (3, 3, 1),  -- Ines: English
  (4, 3, 3);  -- Ines: Spanish

-- ---------- Trips, activities, tags ----------

INSERT INTO Trips (id, name, description, durationMinutes, meetingPoint, maxParticipants, basePrice, createdAt) VALUES
  (1, 'Lisbon Old Town Walking Tour',
      'A relaxed walk through the historic streets and viewpoints of the old town, with a pastry stop along the way.',
      180, 'Praca do Comercio, main arch', 12, 25.00, '2026-02-01 09:00:00'),
  (2, 'Sunset Sailing on the Tagus',
      'Cruise the river on a small sailboat while the sun goes down. Light snacks and drinks available as add-ons.',
      120, 'Doca de Santo Amaro marina', 8, 60.00, '2026-02-15 09:00:00'),
  (3, 'Sintra Day Trip',
      'Full-day excursion to the hills and palaces of Sintra, including a guided hike and a palace visit.',
      480, 'Rossio Station, platform entrance', 10, 85.00, '2026-03-01 09:00:00');

INSERT INTO Activities (id, name, description, locationName, startLatitude, startLongitude, endLatitude, endLongitude, durationMinutes, categoryId) VALUES
  (1, 'Alfama Viewpoint Walk',
      'Walk uphill through narrow streets to the best viewpoints over the river.',
      'Alfama', 38.711400, -9.130500, 38.713100, -9.132900, 90, 1),
  (2, 'Pastry Tasting',
      'Taste traditional custard tarts and other local pastries at a family-run bakery.',
      'Baixa', 38.711000, -9.136800, NULL, NULL, 45, 2),
  (3, 'Tagus River Sail',
      'Guided sail along the riverfront with commentary on the landmarks you pass.',
      'Doca de Santo Amaro', 38.700600, -9.178000, 38.696900, -9.205400, 120, 4),
  (4, 'Hilltop Palace Visit',
      'Guided visit of a colourful hilltop palace and its gardens.',
      'Sintra Hills', 38.787600, -9.390600, NULL, NULL, 150, 1),
  (5, 'Sintra Forest Hike',
      'Moderate hike through forest trails with views over the coast.',
      'Sintra-Cascais Natural Park', 38.797000, -9.388000, 38.787600, -9.390600, 120, 3);

INSERT INTO TripActivity (sequenceOrder, id, tripId, activityId) VALUES
  (1, 1, 1, 1),
  (2, 2, 1, 2),
  (1, 3, 2, 3),
  (1, 4, 3, 5),
  (2, 5, 3, 4);

INSERT INTO TripTag (id, tripId, tagId) VALUES
  (1, 1, 4),  -- Old Town: History
  (2, 1, 1),  -- Old Town: Family Friendly
  (3, 2, 3),  -- Sailing: Romantic
  (4, 2, 2),  -- Sailing: Outdoor
  (5, 3, 2),  -- Sintra: Outdoor
  (6, 3, 4);  -- Sintra: History

-- ---------- Events & guides ----------

INSERT INTO Events (id, startDatetime, capacityOverride, tripId, stateId) VALUES
  (1, '2026-11-15 10:00:00', NULL, 1, 1),  -- upcoming, scheduled
  (2, '2026-11-22 17:00:00', 6,    2, 2),  -- upcoming, confirmed, reduced capacity
  (3, '2026-12-06 09:00:00', NULL, 3, 1),  -- upcoming, scheduled
  (4, '2026-10-10 10:00:00', NULL, 1, 3),  -- past, completed
  (5, '2026-10-25 17:00:00', NULL, 2, 4);  -- past, cancelled

INSERT INTO EventGuides (id, eventId, guideId) VALUES
  (1, 1, 2),  -- Event 1: Marco
  (2, 2, 3),  -- Event 2: Ines
  (3, 3, 2),  -- Event 3: Marco
  (4, 4, 3),  -- Event 4: Ines
  (5, 5, 2),  -- Event 5: Marco
  (6, 1, 3);  -- Event 1 also has Ines (two guides)

-- ---------- Addons ----------

INSERT INTO Addons (id, name, description, defaultPrice) VALUES
  (1, 'Wine Tasting',  'Tasting of three local wines.',                  15.00),
  (2, 'Photo Package', 'Digital photos taken by the guide during the trip.', 10.00),
  (3, 'Packed Lunch',  'Sandwich, fruit and a drink.',                   12.50);

INSERT INTO EventAddons (id, price, capacity, eventId, addonId) VALUES
  (1, 15.00, 10,   1, 1),
  (2, 10.00, NULL, 1, 2),
  (3, 18.00, 8,    2, 1),
  (4, 12.50, 10,   3, 3),
  (5, 15.00, 10,   4, 1);

-- ---------- Reservations ----------
-- Each reservation's eventGuideId belongs to the same event as its eventId.

INSERT INTO Reservations (id, numPeople, createdAt, userId, eventId, stateId, eventGuideId) VALUES
  (1, 2, '2026-10-20 12:00:00', 4, 1, 2, 1),  -- John, event 1, confirmed
  (2, 4, '2026-10-22 18:30:00', 5, 1, 1, 6),  -- Emma, event 1, pending
  (3, 3, '2026-10-25 09:10:00', 5, 2, 2, 2),  -- Emma, event 2, confirmed
  (4, 2, '2026-09-28 15:00:00', 4, 4, 4, 4),  -- John, event 4, completed
  (5, 1, '2026-09-30 11:45:00', 6, 4, 4, 4),  -- Pablo, event 4, completed
  (6, 2, '2026-10-05 20:00:00', 4, 5, 3, 5);  -- John, event 5, cancelled

-- Each eventAddon belongs to the same event as its reservation.
INSERT INTO ReservationAddon (id, quantity, eventAddonId, reservationId) VALUES
  (1, 2, 1, 1),  -- Res 1 (event 1): 2x wine tasting
  (2, 1, 2, 2),  -- Res 2 (event 1): 1x photo package
  (3, 3, 3, 3),  -- Res 3 (event 2): 3x wine tasting
  (4, 2, 5, 4);  -- Res 4 (event 4): 2x wine tasting

-- ---------- Ratings (only for completed reservations) ----------

INSERT INTO GuideRatings (id, rating, comment, createdAt, reservationId) VALUES
  (1, 5, 'Ines was fantastic, very knowledgeable and funny.', '2026-10-11 09:00:00', 4),
  (2, 4, NULL,                                                '2026-10-12 14:20:00', 5);

INSERT INTO TripRatings (id, rating, comment, createdAt, reservationId) VALUES
  (1, 5, 'Loved the viewpoints and the pastry stop.', '2026-10-11 09:05:00', 4),
  (2, 4, 'Great tour, a bit too many hills.',         '2026-10-12 14:25:00', 5);