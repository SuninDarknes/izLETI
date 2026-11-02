-- Dummy data for testing. Tables are populated in foreign-key dependency order.
-- id columns are GENERATED ALWAYS AS IDENTITY, so they are never listed/supplied here;
-- rows are inserted in the exact order referenced by comments (1st row -> id 1, etc.).

-- ---------- Lookup tables ----------

INSERT INTO Roles (name, active) VALUES
  ('Admin',    TRUE),
  ('Guide',    TRUE),
  ('Customer', TRUE);

INSERT INTO EventStates (name) VALUES
  ('Scheduled'),
  ('Confirmed'),
  ('Completed'),
  ('Cancelled');

INSERT INTO ReservationStates (name) VALUES
  ('Pending'),
  ('Confirmed'),
  ('Cancelled'),
  ('Completed');

INSERT INTO ActivityCategories (name) VALUES
  ('Culture'),
  ('Food & Drink'),
  ('Nature'),
  ('Water Sports');

INSERT INTO TripTags (name) VALUES
  ('Family Friendly'),
  ('Outdoor'),
  ('Romantic'),
  ('History');

INSERT INTO Languages (name) VALUES
  ('English'),
  ('Portuguese'),
  ('Spanish');

-- ---------- Users & roles ----------

INSERT INTO Users (email, googleId, phone, createdAt, username, active, firstname, lastname, picture, locale, emailverified) VALUES
  ('ana.admin@example.com',   'google-100000000000000001', '+351910000001', '2026-01-05 09:00:00', 'ana_admin',   TRUE, 'Ana',   'Costa',     'https://example.com/pics/ana.jpg', 'en', TRUE),
  ('marco.guide@example.com', 'google-100000000000000002', '+351910000002', '2026-01-10 10:30:00', 'marco_guide', TRUE, 'Marco', 'Silva',     'https://example.com/pics/marco.jpg', 'pt', TRUE),
  ('ines.guide@example.com',  'google-100000000000000003', '+351910000003', '2026-01-12 11:15:00', 'ines_guide',  TRUE, 'Ines',  'Ferreira',  'https://example.com/pics/ines.jpg', 'es', TRUE),
  ('john.smith@example.com',  'google-100000000000000004', '+14155550104', '2026-03-02 14:20:00', 'john_smith',  TRUE, 'John',  'Smith',     NULL,                               'en', TRUE),
  ('emma.jones@example.com',  'google-100000000000000005', NULL,           '2026-04-18 16:45:00', 'emma_jones',  TRUE, 'Emma',  'Jones',     NULL,                               'en', FALSE),
  ('old.user@example.com',    'google-100000000000000006', '+34600000006', '2026-02-01 08:00:00', 'pablo_ruiz',  FALSE, 'Pablo', 'Ruiz',     NULL,                               'es', TRUE);

INSERT INTO UserRole (roleId, userId) VALUES
  (1, 1),  -- Ana: Admin
  (2, 2),  -- Marco: Guide
  (2, 3),  -- Ines: Guide
  (3, 4),  -- John: Customer
  (3, 5),  -- Emma: Customer
  (3, 6);  -- Pablo: Customer

INSERT INTO GuideLanguage (userId, languageId) VALUES
  (2, 1),  -- Marco: English
  (2, 2),  -- Marco: Portuguese
  (3, 1),  -- Ines: English
  (3, 3);  -- Ines: Spanish

-- ---------- Trips, activities, tags ----------

INSERT INTO Trips (name, description, durationMinutes, meetingPoint, maxParticipants, basePrice, createdAt) VALUES
  ('Lisbon Old Town Walking Tour',
      'A relaxed walk through the historic streets and viewpoints of the old town, with a pastry stop along the way.',
      180, 'Praca do Comercio, main arch', 12, 25.00, '2026-02-01 09:00:00'),
  ('Sunset Sailing on the Tagus',
      'Cruise the river on a small sailboat while the sun goes down. Light snacks and drinks available as add-ons.',
      120, 'Doca de Santo Amaro marina', 8, 60.00, '2026-02-15 09:00:00'),
  ('Sintra Day Trip',
      'Full-day excursion to the hills and palaces of Sintra, including a guided hike and a palace visit.',
      480, 'Rossio Station, platform entrance', 10, 85.00, '2026-03-01 09:00:00');

INSERT INTO Activities (name, description, locationName, latitude, longitude, durationMinutes, categoryId) VALUES
  ('Alfama Viewpoint Walk',
      'Walk uphill through narrow streets to the best viewpoints over the river.',
      'Alfama', 38.711400, -9.130500, 90, 1),
  ('Pastry Tasting',
      'Taste traditional custard tarts and other local pastries at a family-run bakery.',
      'Baixa', 38.711000, -9.136800, 45, 2),
  ('Tagus River Sail',
      'Guided sail along the riverfront with commentary on the landmarks you pass.',
      'Doca de Santo Amaro', 38.700600, -9.178000, 120, 4),
  ('Hilltop Palace Visit',
      'Guided visit of a colourful hilltop palace and its gardens.',
      'Sintra Hills', 38.787600, -9.390600, 150, 1),
  ('Sintra Forest Hike',
      'Moderate hike through forest trails with views over the coast.',
      'Sintra-Cascais Natural Park', 38.797000, -9.388000, 120, 3);

INSERT INTO TripActivity (sequenceOrder, tripId, activityId) VALUES
  (1, 1, 1),
  (2, 1, 2),
  (1, 2, 3),
  (1, 3, 5),
  (2, 3, 4);

INSERT INTO TripTag (tripId, tagId) VALUES
  (1, 4),  -- Old Town: History
  (1, 1),  -- Old Town: Family Friendly
  (2, 3),  -- Sailing: Romantic
  (2, 2),  -- Sailing: Outdoor
  (3, 2),  -- Sintra: Outdoor
  (3, 4);  -- Sintra: History

-- ---------- Events & guides ----------

INSERT INTO Events (startDatetime, capacityOverride, tripId, stateId) VALUES
  ('2026-11-15 10:00:00', NULL, 1, 1),  -- upcoming, scheduled
  ('2026-11-22 17:00:00', 6,    2, 2),  -- upcoming, confirmed, reduced capacity
  ('2026-12-06 09:00:00', NULL, 3, 1),  -- upcoming, scheduled
  ('2026-10-10 10:00:00', NULL, 1, 3),  -- past, completed
  ('2026-10-25 17:00:00', NULL, 2, 4);  -- past, cancelled

INSERT INTO EventGuides (eventId, guideId) VALUES
  (1, 2),  -- Event 1: Marco
  (2, 3),  -- Event 2: Ines
  (3, 2),  -- Event 3: Marco
  (4, 3),  -- Event 4: Ines
  (5, 2),  -- Event 5: Marco
  (1, 3);  -- Event 1 also has Ines (two guides)

-- ---------- Addons ----------

INSERT INTO Addons (name, defaultPrice) VALUES
  ('Wine Tasting',  15.00),
  ('Photo Package', 10.00),
  ('Packed Lunch',  12.50);

INSERT INTO EventAddons (description, price, capacity, eventId, addonId) VALUES
  ('Tasting of three local wines.',                            15.00, 10,   1, 1),
  ('Digital photos taken by the guide during the trip.',       10.00, NULL, 1, 2),
  ('Tasting of three local wines, paired with sailing snacks.', 18.00, 8,    2, 1),
  ('Sandwich, fruit and a drink.',                             12.50, 10,   3, 3),
  ('Tasting of three local wines.',                            15.00, 10,   4, 1);

-- ---------- Reservations ----------
-- Each reservation's eventGuideId belongs to the same event as its eventId.

INSERT INTO Reservations (numPeople, createdAt, userId, eventId, stateId, eventGuideId) VALUES
  (2, '2026-10-20 12:00:00', 4, 1, 2, 1),  -- John, event 1, confirmed
  (4, '2026-10-22 18:30:00', 5, 1, 1, 6),  -- Emma, event 1, pending
  (3, '2026-10-25 09:10:00', 5, 2, 2, 2),  -- Emma, event 2, confirmed
  (2, '2026-09-28 15:00:00', 4, 4, 4, 4),  -- John, event 4, completed
  (1, '2026-09-30 11:45:00', 6, 4, 4, 4),  -- Pablo, event 4, completed
  (2, '2026-10-05 20:00:00', 4, 5, 3, 5);  -- John, event 5, cancelled

-- Each eventAddon belongs to the same event as its reservation.
INSERT INTO ReservationAddon (quantity, eventAddonId, reservationId) VALUES
  (2, 1, 1),  -- Res 1 (event 1): 2x wine tasting
  (1, 2, 2),  -- Res 2 (event 1): 1x photo package
  (3, 3, 3),  -- Res 3 (event 2): 3x wine tasting
  (2, 5, 4);  -- Res 4 (event 4): 2x wine tasting

-- ---------- Ratings (only for completed reservations) ----------

INSERT INTO GuideRatings (rating, comment, createdAt, reservationId) VALUES
  (5, 'Ines was fantastic, very knowledgeable and funny.', '2026-10-11 09:00:00', 4),
  (4, NULL,                                                '2026-10-12 14:20:00', 5);

INSERT INTO TripRatings (rating, comment, createdAt, reservationId) VALUES
  (5, 'Loved the viewpoints and the pastry stop.', '2026-10-11 09:05:00', 4),
  (4, 'Great tour, a bit too many hills.',         '2026-10-12 14:25:00', 5);
