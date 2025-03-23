-- Create database
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'music_db') THEN
      CREATE DATABASE music_db;
   END IF;
END
$$;

-- Create 'user' table
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    phone VARCHAR(20),
    dob TIMESTAMP,
    gender VARCHAR(1) CHECK (gender IN ('m', 'f', 'o')),
    address VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('super_admin', 'artist_manager', 'artist')) NOT NULL,
    token VARCHAR(500) DEFAULT NULL,
    token_expiry TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create 'artist' table
CREATE TABLE IF NOT EXISTS artist (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    first_release_year INT,
    no_of_albums_released INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create 'music' table
CREATE TABLE IF NOT EXISTS music (
    id SERIAL PRIMARY KEY,
    artist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    album_name VARCHAR(255),
    genre VARCHAR(20) CHECK (genre IN ('rnb', 'country', 'classic', 'rock', 'jazz')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE
);


-- Insert dummy users
INSERT INTO "user" (first_name, last_name, email, password, phone, dob, gender, address, role)
VALUES
-- Super Admins (6)
('John', 'Doe', 'john.doe@email.com', 'Password123@', '9876543210', '1985-05-15', 'm', '123 Main St', 'super_admin'),
('Jane', 'Smith', 'jane.smith@email.com', 'Password123@', '8765432109', '1988-07-22', 'f', '456 Elm St', 'super_admin'),
('Alice', 'Brown', 'alice.brown@email.com', 'Password123@', '7654321098', '1990-03-10', 'f', '789 Oak Ave', 'super_admin'),
('Bob', 'Johnson', 'bob.johnson@email.com', 'Password123@', '6543210987', '1979-11-30', 'm', '321 Pine Rd', 'super_admin'),
('Charlie', 'Lee', 'charlie.lee@email.com', 'Password123@', '5432109876', '1983-06-25', 'm', '654 Maple Blvd', 'super_admin'),
('David', 'White', 'david.white@email.com', 'Password123@', '4321098765', '1995-09-18', 'm', '987 Birch Ln', 'super_admin'),

-- Artist Managers (4)
('Emily', 'Clark', 'emily.clark@email.com', 'Password123@', '3210987654', '1987-02-14', 'f', '741 Cedar St', 'artist_manager'),
('Frank', 'Harris', 'frank.harris@email.com', 'Password123@', '2109876543', '1992-12-05', 'm', '852 Spruce Ave', 'artist_manager'),
('Grace', 'Martin', 'grace.martin@email.com', 'Password123@', '1098765432', '1998-08-29', 'f', '963 Redwood Ct', 'artist_manager'),
('Henry', 'Roberts', 'henry.roberts@email.com', 'Password123@', '9081726354', '1991-04-25', 'm', '432 Birch Blvd', 'artist_manager'),

-- Artists (22)

('Henry', 'Wilson', 'henry.wilson@email.com', 'Password123@', '9988776655', '1991-04-17', 'm', '159 Aspen Way', 'artist'),
('Isabel', 'Moore', 'isabel.moore@email.com', 'Password123@', '8899001122', '1994-11-11', 'f', '357 Willow Dr', 'artist'),
('Jack', 'Taylor', 'jack.taylor@email.com', 'Password123@', '7788990011', '1989-05-21', 'm', '753 Sycamore Ln', 'artist'),
('Liam', 'Anderson', 'liam.anderson@email.com', 'Password123@', '6677889900', '1996-07-07', 'm', '159 Cedar St', 'artist'),
('Sophia', 'Miller', 'sophia.miller@email.com', 'Password123@', '5566778899', '1993-01-03', 'f', '852 Birch Ave', 'artist'),
('Ethan', 'Thomas', 'ethan.thomas@email.com', 'Password123@', '4455667788', '1990-10-30', 'm', '357 Oak Ct', 'artist'),
('Lucas', 'King', 'lucas.king@email.com', 'Password123@', '3344556677', '1988-03-15', 'm', '258 Maple Dr', 'artist'),
('Mia', 'Davis', 'mia.davis@email.com', 'Password123@', '2233445566', '1995-06-23', 'f', '147 Pine Rd', 'artist'),
('Olivia', 'White', 'olivia.white@email.com', 'Password123@', '1122334455', '1993-11-01', 'f', '265 Oak Blvd', 'artist'),
('William', 'Martinez', 'william.martinez@email.com', 'Password123@', '9988772211', '1990-01-28', 'm', '945 Maple Ave', 'artist'),
('James', 'Garcia', 'james.garcia@email.com', 'Password123@', '7766554433', '1989-07-20', 'm', '354 Cedar Blvd', 'artist'),
('Lily', 'Lopez', 'lily.lopez@email.com', 'Password123@', '6655442233', '1997-08-14', 'f', '653 Pine Ave', 'artist'),
('Chloe', 'Martinez', 'chloe.martinez@email.com', 'Password123@', '5544331122', '1992-04-18', 'f', '752 Birch Blvd', 'artist'),
('Zoe', 'Scott', 'zoe.scott@email.com', 'Password123@', '4433220011', '1994-09-05', 'f', '641 Oak Rd', 'artist'),
('Daniel', 'Young', 'daniel.young@email.com', 'Password123@', '3322110000', '1986-11-03', 'm', '530 Maple Rd', 'artist'),
('Eva', 'Hernandez', 'eva.hernandez@email.com', 'Password123@', '2211009988', '1999-12-12', 'f', '415 Cedar Dr', 'artist'),
('Aiden', 'Carter', 'aiden.carter@email.com', 'Password123@', '1100998877', '1991-05-06', 'm', '346 Birch Ln', 'artist'),
('Benjamin', 'Clark', 'benjamin.clark@email.com', 'Password123@', '9998887777', '1992-02-28', 'm', '561 Pine Blvd', 'artist'),
('Mason', 'Roberts', 'mason.roberts@email.com', 'Password123@', '8887776666', '1993-04-22', 'm', '474 Cedar Ct', 'artist'),
('Harper', 'Baker', 'harper.baker@email.com', 'Password123@', '7776665555', '1990-08-11', 'f', '583 Oak Ln', 'artist'),
('Ella', 'Evans', 'ella.evans@email.com', 'Password123@', '6665554444', '1994-05-13', 'f', '694 Maple Blvd', 'artist'),
('Jackson', 'Nelson', 'jackson.nelson@email.com', 'Password123@', '5554443333', '1991-02-01', 'm', '703 Pine Ct', 'artist'),
('Mason', 'Hill', 'mason.hill@email.com', 'Password123@', '4443332222', '1989-07-17', 'm', '812 Oak Ave', 'artist'),
('Landon', 'Adams', 'landon.adams@email.com', 'Password123@', '3332221111', '1997-09-29', 'm', '921 Birch St', 'artist');

-- Insert dummy artists (mapping to users with role 'artist')
INSERT INTO artist (user_id, first_release_year, no_of_albums_released)
VALUES
((SELECT id FROM "user" WHERE email = 'henry.wilson@email.com'), 2015, 3),
((SELECT id FROM "user" WHERE email = 'isabel.moore@email.com'), 2017, 2),
((SELECT id FROM "user" WHERE email = 'jack.taylor@email.com'), 2012, 5),
((SELECT id FROM "user" WHERE email = 'liam.anderson@email.com'), 2018, 1),
((SELECT id FROM "user" WHERE email = 'sophia.miller@email.com'), 2016, 4),
((SELECT id FROM "user" WHERE email = 'ethan.thomas@email.com'), 2019, 2),
((SELECT id FROM "user" WHERE email = 'lucas.king@email.com'), 2014, 3),
((SELECT id FROM "user" WHERE email = 'mia.davis@email.com'), 2019, 1),
((SELECT id FROM "user" WHERE email = 'olivia.white@email.com'), 2015, 4),
((SELECT id FROM "user" WHERE email = 'william.martinez@email.com'), 2012, 2),
((SELECT id FROM "user" WHERE email = 'james.garcia@email.com'), 2016, 5),
((SELECT id FROM "user" WHERE email = 'lily.lopez@email.com'), 2018, 6),
((SELECT id FROM "user" WHERE email = 'chloe.martinez@email.com'), 2013, 3),
((SELECT id FROM "user" WHERE email = 'zoe.scott@email.com'), 2017, 2),
((SELECT id FROM "user" WHERE email = 'daniel.young@email.com'), 2015, 5),
((SELECT id FROM "user" WHERE email = 'eva.hernandez@email.com'), 2019, 1),
((SELECT id FROM "user" WHERE email = 'aiden.carter@email.com'), 2014, 4),
((SELECT id FROM "user" WHERE email = 'benjamin.clark@email.com'), 2018, 3),
((SELECT id FROM "user" WHERE email = 'mason.roberts@email.com'), 2016, 2),
((SELECT id FROM "user" WHERE email = 'harper.baker@email.com'), 2020, 2),
((SELECT id FROM "user" WHERE email = 'ella.evans@email.com'), 2019, 4),
((SELECT id FROM "user" WHERE email = 'jackson.nelson@email.com'), 2021, 3),
((SELECT id FROM "user" WHERE email = 'mason.hill@email.com'), 2017, 5),
((SELECT id FROM "user" WHERE email = 'landon.adams@email.com'), 2022, 1);

-- Insert dummy songs
INSERT INTO music (artist_id, title, album_name, genre)
VALUES
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'henry.wilson@email.com')), 'Echoes of Time', 'Timeless Beats', 'jazz'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'henry.wilson@email.com')), 'New Horizons', 'The Awakening', 'rock'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'henry.wilson@email.com')), 'Rhythm of Life', 'Jazz Journey', 'jazz'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'henry.wilson@email.com')), 'Through the Storm', 'The Awakening', 'rock'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'henry.wilson@email.com')), 'Beyond the Horizon', 'Timeless Beats', 'jazz');

-- Isabel Moore
INSERT INTO music (artist_id, title, album_name, genre)
VALUES
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'isabel.moore@email.com')), 'Soulful Nights', 'Deep Harmony', 'rnb'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'isabel.moore@email.com')), 'Melodic Waves', 'Echo Chamber', 'rnb'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'isabel.moore@email.com')), 'Rhythmic Heart', 'Deep Harmony', 'rnb'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'isabel.moore@email.com')), 'Whispers of Love', 'Echo Chamber', 'rnb'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'isabel.moore@email.com')), 'Unforgettable Moments', 'Deep Harmony', 'rnb');

-- Jack Taylor
INSERT INTO music (artist_id, title, album_name, genre)
VALUES
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'jack.taylor@email.com')), 'Rocking Hard', 'Live Loud', 'rock'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'jack.taylor@email.com')), 'Heavy Riffs', 'Pure Metal', 'rock'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'jack.taylor@email.com')), 'Loud and Proud', 'Live Loud', 'rock'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'jack.taylor@email.com')), 'Into the Fire', 'Pure Metal', 'rock'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'jack.taylor@email.com')), 'Echoes of Power', 'Live Loud', 'rock');

-- Liam Anderson
INSERT INTO music (artist_id, title, album_name, genre)
VALUES
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'liam.anderson@email.com')), 'Countryside Dreams', 'Acoustic Bliss', 'country'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'liam.anderson@email.com')), 'Americana Spirit', 'Country Roads', 'country'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'liam.anderson@email.com')), 'Old Country Roads', 'Acoustic Bliss', 'country'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'liam.anderson@email.com')), 'The Road Less Traveled', 'Country Roads', 'country'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'liam.anderson@email.com')), 'Sunny Days', 'Acoustic Bliss', 'country');

-- Sophia Miller
INSERT INTO music (artist_id, title, album_name, genre)
VALUES
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'sophia.miller@email.com')), 'Classical Wonders', 'Symphony of Life', 'classic'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'sophia.miller@email.com')), 'Orchestral Beauty', 'Classic Redux', 'classic'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'sophia.miller@email.com')), 'Symphony of Dreams', 'Symphony of Life', 'classic'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'sophia.miller@email.com')), 'Grand Requiem', 'Classic Redux', 'classic'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'sophia.miller@email.com')), 'The Final Movement', 'Symphony of Life', 'classic');

-- Ethan Thomas
INSERT INTO music (artist_id, title, album_name, genre)
VALUES
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'ethan.thomas@email.com')), 'Jazz Fusion', 'Urban Rhythms', 'jazz'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'ethan.thomas@email.com')), 'Blue Notes', 'Late Night Jazz', 'jazz'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'ethan.thomas@email.com')), 'Smooth Vibes', 'Urban Rhythms', 'jazz'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'ethan.thomas@email.com')), 'City Lights', 'Late Night Jazz', 'jazz'),
((SELECT id FROM artist WHERE user_id = (SELECT id FROM "user" WHERE email = 'ethan.thomas@email.com')), 'Night Grooves', 'Urban Rhythms', 'jazz');