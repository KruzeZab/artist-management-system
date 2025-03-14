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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create 'artist' table
CREATE TABLE IF NOT EXISTS artist (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob TIMESTAMP,
    gender VARCHAR(1) CHECK (gender IN ('m', 'f', 'o')),
    address VARCHAR(255),
    first_release_year INT CHECK (first_release_year > 1900),
    no_of_albums_released INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
