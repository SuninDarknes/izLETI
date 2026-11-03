CREATE TABLE Users
(
  id INT GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255) NOT NULL,
  googleId VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  createdAt TIMESTAMP NOT NULL,
  username VARCHAR(100) NOT NULL,
  active BOOLEAN NOT NULL,
  firstname VARCHAR(100),
  lastname VARCHAR(100),
  picture TEXT,
  locale VARCHAR(20),
  emailverified BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  UNIQUE (email),
  UNIQUE (googleId)
);

CREATE TABLE Roles
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE Trips
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  durationMinutes INT NOT NULL,
  meetingPoint VARCHAR(150) NOT NULL,
  maxParticipants INT NOT NULL,
  basePrice NUMERIC(10,2) NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  CHECK (maxParticipants > 0),
  CHECK (basePrice >= 0)
);

CREATE TABLE EventStates
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE Events
(
  id INT GENERATED ALWAYS AS IDENTITY,
  startDatetime TIMESTAMP NOT NULL,
  capacityOverride INT,
  tripId INT NOT NULL,
  stateId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tripId) REFERENCES Trips(id),
  FOREIGN KEY (stateId) REFERENCES EventStates(id)
);

CREATE TABLE ActivityCategories
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE Activities
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  locationName VARCHAR(150) NOT NULL,
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  durationMinutes INT,
  categoryId INT NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (categoryId) REFERENCES ActivityCategories(id)
);

CREATE TABLE Addons
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL,
  defaultPrice NUMERIC(10,2) NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE ReservationStates
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE EventGuides
(
  id INT GENERATED ALWAYS AS IDENTITY,
  eventId INT NOT NULL,
  guideId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (eventId) REFERENCES Events(id),
  FOREIGN KEY (guideId) REFERENCES Users(id),
  UNIQUE (eventId, guideId),
  UNIQUE (eventId, id)
);

CREATE TABLE Reservations
(
  id INT GENERATED ALWAYS AS IDENTITY,
  numPeople INT NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  userId INT NOT NULL,
  eventId INT NOT NULL,
  stateId INT NOT NULL,
  eventGuideId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (eventId) REFERENCES Events(id),
  FOREIGN KEY (stateId) REFERENCES ReservationStates(id),
  FOREIGN KEY (eventGuideId) REFERENCES EventGuides(id),
  CHECK (numPeople > 0)
);

CREATE TABLE TripTags
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE EventAddons
(
  id INT GENERATED ALWAYS AS IDENTITY,
  description VARCHAR(1000) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  capacity INT,
  eventId INT NOT NULL,
  addonId INT NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (eventId) REFERENCES Events(id),
  FOREIGN KEY (addonId) REFERENCES Addons(id),
  UNIQUE (eventId, addonId),
  CHECK (capacity IS NULL OR capacity >= 0)
);

CREATE TABLE UserRole
(
  id INT GENERATED ALWAYS AS IDENTITY,
  roleId INT NOT NULL,
  userId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (roleId) REFERENCES Roles(id),
  FOREIGN KEY (userId) REFERENCES Users(id),
  UNIQUE (roleId, userId)
);

CREATE TABLE TripActivity
(
  id INT GENERATED ALWAYS AS IDENTITY,
  sequenceOrder INT NOT NULL,
  tripId INT NOT NULL,
  activityId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tripId) REFERENCES Trips(id),
  FOREIGN KEY (activityId) REFERENCES Activities(id),
  UNIQUE (tripId, sequenceOrder),
  UNIQUE (tripId, activityId)
);

CREATE TABLE TripTag
(
  id INT GENERATED ALWAYS AS IDENTITY,
  tripId INT NOT NULL,
  tagId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tripId) REFERENCES Trips(id),
  FOREIGN KEY (tagId) REFERENCES TripTags(id),
  UNIQUE (tripId, tagId)
);

CREATE TABLE ReservationAddon
(
  id INT GENERATED ALWAYS AS IDENTITY,
  quantity INT NOT NULL,
  eventAddonId INT NOT NULL,
  reservationId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (eventAddonId) REFERENCES EventAddons(id),
  FOREIGN KEY (reservationId) REFERENCES Reservations(id),
  UNIQUE (eventAddonId, reservationId)
);

CREATE TABLE Languages
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE GuideLanguage
(
  id INT GENERATED ALWAYS AS IDENTITY,
  userId INT NOT NULL,
  languageId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (languageId) REFERENCES Languages(id),
  UNIQUE (userId, languageId)
);

CREATE TABLE GuideRatings
(
  id INT GENERATED ALWAYS AS IDENTITY,
  rating INT NOT NULL,
  comment VARCHAR(500),
  createdAt TIMESTAMP NOT NULL,
  reservationId INT NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (reservationId) REFERENCES Reservations(id),
  UNIQUE (reservationId),
  CHECK (rating BETWEEN 1 AND 5)
);

CREATE TABLE TripRatings
(
  id INT GENERATED ALWAYS AS IDENTITY,
  rating INT NOT NULL,
  comment VARCHAR(500),
  createdAt TIMESTAMP NOT NULL,
  reservationId INT NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (reservationId) REFERENCES Reservations(id),
  UNIQUE (reservationId),
  CHECK (rating BETWEEN 1 AND 5)
);

CREATE FUNCTION check_addon_matches_event() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT eventId FROM EventAddons WHERE id = NEW.eventAddonId) !=
     (SELECT eventId FROM Reservations WHERE id = NEW.reservationId) THEN
    RAISE EXCEPTION 'Addon (eventAddonId=%) nije dostupan na eventu rezervacije (reservationId=%)', NEW.eventAddonId, NEW.reservationId;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_addon_event
BEFORE INSERT OR UPDATE ON ReservationAddon
FOR EACH ROW EXECUTE FUNCTION check_addon_matches_event();
