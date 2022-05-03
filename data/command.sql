CREATE TABLE gig_dates (
    event_id VARCHAR(50) UNIQUE PRIMARY KEY NOT NULL,
    place VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    event_link VARCHAR(500) DEFAULT 'no link',
    is_canceled BOOLEAN DEFAULT false,
    added_at VARCHAR(50)
);

CREATE TABLE albums (
    album_id VARCHAR(50) UNIQUE PRIMARY KEY NOT NULL,
    title VARCHAR(50),
    year INTEGER,
    description VARCHAR(1000),
    playlist_link VARCHAR(100),
    video_link  VARCHAR(100),
	photos_paths VARCHAR(70),
	color VARCHAR(50),
	is_released BOOLEAN
);

-- DELETE FROM albums WHERE album_id = '4839369a-a99d-4b3a-9c32-594e8a2a777a'

-- ALTER TABLE albums ADD COLUMN is_released BOOLEAN
-- ALTER TABLE gig_dates ADD COLUMN uppdated_at DATE

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

SELECT * FROM gig_dates;