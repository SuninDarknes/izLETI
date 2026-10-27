CREATE TABLE Users
(
  id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  googleId VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  createdAt TIMESTAMP NOT NULL,
  fullName VARCHAR(100) NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (email),
  UNIQUE (googleId)
);

CREATE TABLE Roles
(
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  active BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE Trips
(
  id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  durationMinutes INT NOT NULL,
  meetingPoint VARCHAR(150) NOT NULL,
  maxParticipants INT NOT NULL,
  basePrice NUMERIC(10,2) NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE EventStates
(
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE Events
(
  id INT NOT NULL,
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
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE Activities
(
  id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  locationName VARCHAR(150) NOT NULL,
  startLatitude NUMERIC(9,6) NOT NULL,
  startLongitude NUMERIC(9,6) NOT NULL,
  endLatitude NUMERIC(9,6),
  endLongitude NUMERIC(9,6),
  durationMinutes INT NOT NULL,
  categoryId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (categoryId) REFERENCES ActivityCategories(id)
);

CREATE TABLE Addons
(
  id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  defaultPrice NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE ReservationStates
(
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE EventGuides
(
  id INT NOT NULL,
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
  id INT NOT NULL,
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
  FOREIGN KEY (eventGuideId) REFERENCES EventGuides(id)
);

CREATE TABLE TripTags
(
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE EventAddons
(
  id INT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  capacity INT,
  eventId INT NOT NULL,
  addonId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (eventId) REFERENCES Events(id),
  FOREIGN KEY (addonId) REFERENCES Addons(id),
  UNIQUE (eventId, addonId)
);

CREATE TABLE UserRole
(
  id INT NOT NULL,
  roleId INT NOT NULL,
  userId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (roleId) REFERENCES Roles(id),
  FOREIGN KEY (userId) REFERENCES Users(id),
  UNIQUE (roleId, userId)
);

CREATE TABLE TripActivity
(
  sequenceOrder INT NOT NULL,
  id INT NOT NULL,
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
  id INT NOT NULL,
  tripId INT NOT NULL,
  tagId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tripId) REFERENCES Trips(id),
  FOREIGN KEY (tagId) REFERENCES TripTags(id),
  UNIQUE (tripId, tagId)
);

CREATE TABLE ReservationAddon
(
  quantity INT NOT NULL,
  id INT NOT NULL,
  eventAddonId INT NOT NULL,
  reservationId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (eventAddonId) REFERENCES EventAddons(id),
  FOREIGN KEY (reservationId) REFERENCES Reservations(id),
  UNIQUE (eventAddonId, reservationId)
);

CREATE TABLE Languages
(
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE GuideLanguage
(
  id INT NOT NULL,
  userId INT NOT NULL,
  languageId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (languageId) REFERENCES Languages(id),
  UNIQUE (userId, languageId)
);

CREATE TABLE GuideRatings
(
  id INT NOT NULL,
  rating INT NOT NULL,
  comment VARCHAR(500),
  createdAt TIMESTAMP NOT NULL,
  reservationId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (reservationId) REFERENCES Reservations(id),
  UNIQUE (reservationId)
);

CREATE TABLE TripRatings
(
  id INT NOT NULL,
  rating INT NOT NULL,
  comment VARCHAR(500),
  createdAt TIMESTAMP NOT NULL,
  reservationId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (reservationId) REFERENCES Reservations(id),
  UNIQUE (reservationId)
);