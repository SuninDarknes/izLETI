-- Dummy data for testing (PostgreSQL).
-- Tables are populated in foreign-key dependency order.
-- id columns are GENERATED ALWAYS AS IDENTITY, so they are never supplied here;
-- rows get ids 1, 2, 3... in the order they are inserted, and the ids used in
-- foreign-key columns below rely on that. Run this on freshly created, EMPTY tables.
--
-- To re-run on tables that already hold data, uncomment this first:
-- TRUNCATE ReservationAddon, GuideRatings, TripRatings, Reservations, EventAddons,
--          EventGuides, Events, TripActivity, TripTag, GuideLanguage, UserRole,
--          Activities, Trips, Addons, Users, Roles, EventStates, ReservationStates,
--          ActivityCategories, TripTags, Languages
--   RESTART IDENTITY CASCADE;

-- ---------- Lookup tables ----------

INSERT INTO Roles (name) VALUES
  ('Admin'),      -- id 1
  ('User'),       -- id 2
  ('Owner'),      -- id 3
  ('Guide'),      -- id 4
  ('Organizer');  -- id 5

INSERT INTO EventStates (name) VALUES
  ('Scheduled'),  -- id 1
  ('Confirmed'),  -- id 2
  ('Completed'),  -- id 3
  ('Cancelled');  -- id 4

INSERT INTO ReservationStates (name) VALUES
  ('Pending'),    -- id 1
  ('Confirmed'),  -- id 2
  ('Cancelled'),  -- id 3
  ('Completed');  -- id 4

INSERT INTO ActivityCategories (name, active) VALUES
  ('Culture',      TRUE),   -- id 1
  ('Food & Drink', TRUE),   -- id 2
  ('Nature',       TRUE),   -- id 3
  ('Water Sports', TRUE),   -- id 4
  ('Nightlife',    FALSE);  -- id 5 (inactive, unused)

INSERT INTO TripTags (name, active) VALUES
  ('Family Friendly', TRUE),   -- id 1
  ('Outdoor',         TRUE),   -- id 2
  ('Romantic',        TRUE),   -- id 3
  ('History',         TRUE),   -- id 4
  ('Seasonal',        FALSE);  -- id 5 (inactive, unused)

INSERT INTO Languages (name, active) VALUES
  ('English',    TRUE),   -- id 1
  ('Portuguese', TRUE),   -- id 2
  ('Spanish',    TRUE),   -- id 3
  ('French',     FALSE);  -- id 4 (inactive, no guide speaks it)

-- ---------- Users & roles ----------

INSERT INTO Users (email, googleId, phone, createdAt, username, active, firstname, lastname, picture, locale, emailverified) VALUES
  ('ana.admin@example.com',       'google-100000000000000001', '+351910000001', '2026-01-05 09:00:00', 'ana_admin',     TRUE,  'Ana',    'Costa',    'https://example.com/pics/ana.jpg',    'en', TRUE),   -- id 1
  ('marco.guide@example.com',     'google-100000000000000002', '+351910000002', '2026-01-10 10:30:00', 'marco_guide',   TRUE,  'Marco',  'Silva',    'https://example.com/pics/marco.jpg',  'pt', TRUE),   -- id 2
  ('ines.guide@example.com',      'google-100000000000000003', '+351910000003', '2026-01-12 11:15:00', 'ines_guide',    TRUE,  'Ines',   'Ferreira', 'https://example.com/pics/ines.jpg',   'es', TRUE),   -- id 3
  ('john.smith@example.com',      'google-100000000000000004', '+14155550104',  '2026-03-02 14:20:00', 'john_smith',    TRUE,  'John',   'Smith',    NULL,                                  'en', TRUE),   -- id 4
  ('emma.jones@example.com',      'google-100000000000000005', NULL,            '2026-04-18 16:45:00', 'emma_jones',    TRUE,  'Emma',   'Jones',    NULL,                                  'en', FALSE),  -- id 5 (email not verified)
  ('old.user@example.com',        'google-100000000000000006', '+34600000006',  '2026-02-01 08:00:00', 'pablo_ruiz',    FALSE, 'Pablo',  'Ruiz',     NULL,                                  'es', TRUE),   -- id 6 (inactive)
  ('sofia.organizer@example.com', 'google-100000000000000007', '+351910000007', '2026-01-20 13:00:00', 'sofia_organizer', TRUE, 'Sofia',  'Almeida',  'https://example.com/pics/sofia.jpg',  'pt', TRUE);   -- id 7

INSERT INTO UserRole (roleId, userId) VALUES
  (1, 1),  -- Ana: Admin
  (3, 1),  -- Ana: Owner
  (4, 2),  -- Marco: Guide
  (4, 3),  -- Ines: Guide
  (2, 4),  -- John: User
  (2, 5),  -- Emma: User
  (2, 6),  -- Pablo: User
  (5, 7);  -- Sofia: Organizer

INSERT INTO GuideLanguage (userId, languageId) VALUES
  (2, 1),  -- Marco: English
  (2, 2),  -- Marco: Portuguese
  (3, 1),  -- Ines: English
  (3, 3);  -- Ines: Spanish

-- ---------- Trips, activities, tags ----------

INSERT INTO Trips (name, description, durationMinutes, meetingPointLatitude, meetingPointLongitude, maxParticipants, basePrice, createdAt, active) VALUES
  ('Lisbon Old Town Walking Tour',
      'A relaxed walk through the historic streets and viewpoints of the old town, with a pastry stop along the way.',
      180, 38.707700, -9.136500, 12, 25.00, '2026-02-01 09:00:00', TRUE),   -- id 1
  ('Sunset Sailing on the Tagus',
      'Cruise the river on a small sailboat while the sun goes down. Light snacks and drinks available as add-ons.',
      120, 38.700600, -9.178000, 8, 60.00, '2026-02-15 09:00:00', TRUE),      -- id 2
  ('Sintra Day Trip',
      'Full-day excursion to the hills and palaces of Sintra, including a guided hike and a palace visit.',
      480, 38.713900, -9.139400, 10, 85.00, '2026-03-01 09:00:00', TRUE),  -- id 3
  ('Fado Evening in Mouraria',
      'An intimate evening of live fado music in a small tavern in the Mouraria district.',
      150, 38.711700, -9.140500, 10, 45.00, '2026-03-20 09:00:00', FALSE);      -- id 4 (inactive, no events)

INSERT INTO Activities (name, description, locationName, latitude, longitude, durationMinutes, categoryId, active) VALUES
  ('Alfama Viewpoint Walk',
      'Walk uphill through narrow streets to the best viewpoints over the river.',
      'Alfama', 38.711400, -9.130500, 90, 1, TRUE),                                   -- id 1
  ('Pastry Tasting',
      'Taste traditional custard tarts and other local pastries at a family-run bakery.',
      'Baixa', 38.711000, -9.136800, 45, 2, TRUE),                                    -- id 2
  ('Tagus River Sail',
      'Guided sail along the riverfront with commentary on the landmarks you pass.',
      'Doca de Santo Amaro', 38.700600, -9.178000, 120, 4, TRUE),                     -- id 3
  ('Hilltop Palace Visit',
      'Guided visit of a colourful hilltop palace and its gardens.',
      'Sintra Hills', 38.787600, -9.390600, 150, 1, TRUE),                            -- id 4
  ('Sintra Forest Hike',
      'Moderate hike through forest trails with views over the coast.',
      'Sintra-Cascais Natural Park', 38.797000, -9.388000, 120, 3, TRUE),             -- id 5
  ('Fado Listening Session',
      'Live fado performance in a small tavern; the length depends on the performers.',
      'Mouraria', 38.716700, -9.134400, NULL, 1, TRUE),                               -- id 6 (no fixed duration)
  ('Cabo da Roca Photo Stop',
      'Short photo stop at the westernmost point of mainland Europe.',
      'Cabo da Roca', 38.780400, -9.498900, 30, 3, FALSE);                            -- id 7 (inactive, unused)

INSERT INTO TripActivity (sequenceOrder, tripId, activityId) VALUES
  (1, 1, 1),  -- Old Town: Alfama Viewpoint Walk
  (2, 1, 2),  -- Old Town: Pastry Tasting
  (1, 2, 3),  -- Sailing:  Tagus River Sail
  (1, 3, 5),  -- Sintra:   Forest Hike
  (2, 3, 4),  -- Sintra:   Palace Visit
  (1, 4, 6);  -- Fado:     Listening Session

INSERT INTO TripTag (tripId, tagId) VALUES
  (1, 4),  -- Old Town: History
  (1, 1),  -- Old Town: Family Friendly
  (2, 3),  -- Sailing: Romantic
  (2, 2),  -- Sailing: Outdoor
  (3, 2),  -- Sintra: Outdoor
  (3, 4),  -- Sintra: History
  (4, 3);  -- Fado: Romantic

-- ---------- Events & guides ----------

INSERT INTO Events (startDatetime, capacity, tripId, stateId) VALUES
  ('2026-11-15 10:00:00', 12,   1, 1),  -- id 1: upcoming, scheduled
  ('2026-11-22 17:00:00', 6,    2, 2),  -- id 2: upcoming, confirmed, reduced capacity
  ('2026-12-06 09:00:00', 10,   3, 1),  -- id 3: upcoming, scheduled
  ('2026-10-10 10:00:00', 12,   1, 3),  -- id 4: past, completed
  ('2026-10-25 17:00:00', 8,    2, 4),  -- id 5: past, cancelled
  ('2026-11-29 10:00:00', 12,   1, 1);  -- id 6: upcoming, scheduled, no reservations yet

INSERT INTO EventGuides (eventId, guideId) VALUES
  (1, 2),  -- id 1: Event 1: Marco
  (2, 3),  -- id 2: Event 2: Ines
  (3, 2),  -- id 3: Event 3: Marco
  (4, 3),  -- id 4: Event 4: Ines
  (5, 2),  -- id 5: Event 5: Marco
  (1, 3),  -- id 6: Event 1 also has Ines (two guides)
  (6, 2);  -- id 7: Event 6: Marco

-- ---------- Addons ----------

INSERT INTO Addons (name, defaultPrice, active) VALUES
  ('Wine Tasting',      15.00, TRUE),   -- id 1
  ('Photo Package',     10.00, TRUE),   -- id 2
  ('Packed Lunch',      12.50, TRUE),   -- id 3
  ('Souvenir Tote Bag',  8.00, FALSE);  -- id 4 (inactive, unused)

INSERT INTO EventAddons (description, price, capacity, eventId, addonId, active) VALUES
  ('Tasting of three local wines.',                             15.00, 10,   1, 1, TRUE),   -- id 1
  ('Digital photos taken by the guide during the trip.',        10.00, 12,   1, 2, TRUE),   -- id 2
  ('Tasting of three local wines, paired with sailing snacks.', 18.00, 8,    2, 1, TRUE),   -- id 3
  ('Sandwich, fruit and a drink.',                              12.50, 10,   3, 3, TRUE),   -- id 4
  ('Tasting of three local wines.',                             15.00, 10,   4, 1, TRUE),   -- id 5
  ('Digital photos taken by the guide during the trip.',        10.00, NULL, 3, 2, FALSE);  -- id 6 (inactive offer)

-- ---------- Reservations ----------
-- Each reservation's eventGuideId must belong to the same event as its eventId
-- (the schema does not enforce this, so keep it consistent when editing).

INSERT INTO Reservations (numPeople, createdAt, userId, eventId, stateId, eventGuideId) VALUES
  (2, '2026-10-20 12:00:00', 4, 1, 2, 1),  -- id 1: John, event 1, confirmed, guide Marco
  (4, '2026-10-22 18:30:00', 5, 1, 1, 6),  -- id 2: Emma, event 1, pending,   guide Ines
  (3, '2026-10-25 09:10:00', 5, 2, 2, 2),  -- id 3: Emma, event 2, confirmed, guide Ines
  (2, '2026-09-28 15:00:00', 4, 4, 4, 4),  -- id 4: John, event 4, completed, guide Ines
  (1, '2026-09-30 11:45:00', 6, 4, 4, 4),  -- id 5: Pablo, event 4, completed, guide Ines
  (2, '2026-10-05 20:00:00', 4, 5, 3, 5),  -- id 6: John, event 5, cancelled, guide Marco
  (2, '2026-10-28 10:00:00', 4, 3, 1, 3),  -- id 7: John, event 3, pending,   guide Marco
  (2, '2026-10-01 13:20:00', 5, 4, 4, 4);  -- id 8: Emma, event 4, completed, guide Ines

-- The trigger requires each eventAddon to belong to the same event as its reservation.
INSERT INTO ReservationAddon (quantity, eventAddonId, reservationId) VALUES
  (2, 1, 1),  -- Res 1 (event 1): 2x wine tasting
  (1, 2, 2),  -- Res 2 (event 1): 1x photo package
  (3, 3, 3),  -- Res 3 (event 2): 3x wine tasting
  (2, 5, 4),  -- Res 4 (event 4): 2x wine tasting
  (2, 4, 7);  -- Res 7 (event 3): 2x packed lunch

-- ---------- Ratings (only for completed reservations: 4, 5, 8) ----------

INSERT INTO GuideRatings (rating, comment, createdAt, reservationId, active) VALUES
  (5, 'Ines was fantastic, very knowledgeable and funny.', '2026-10-11 09:00:00', 4, TRUE),
  (4, NULL,                                                '2026-10-12 14:20:00', 5, TRUE),
  (3, 'Good guide, but the group was too big.',            '2026-10-13 10:00:00', 8, TRUE);

INSERT INTO TripRatings (rating, comment, createdAt, reservationId, active) VALUES
  (5, 'Loved the viewpoints and the pastry stop.',      '2026-10-11 09:05:00', 4, TRUE),
  (4, 'Great tour, a bit too many hills.',              '2026-10-12 14:25:00', 5, TRUE),
  (2, 'Not what I expected from the description.',      '2026-10-13 10:05:00', 8, FALSE);  -- hidden after review
