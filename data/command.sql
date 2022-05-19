ALTER TABLE albums ADD COLUMN price FLOAT;
ALTER TABLE albums ADD COLUMN track_list JSON[];
ALTER TABLE albums ADD COLUMN shop_link VARCHAR(100);
ALTER TABLE albums ADD COLUMN added_at VARCHAR(50);
ALTER TABLE albums ADD COLUMN updated_at VARCHAR(50);

CREATE TABLE orders (
    order_id VARCHAR(50) UNIQUE PRIMARY KEY NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    name_item VARCHAR(50) NOT NULL,
    client_firstName VARCHAR(50),
    client_lastName VARCHAR(50),
    client_email VARCHAR(50),
    city VARCHAR(50),
    country VARCHAR(50),
    amount FLOAT,
    currency VARCHAR(50),
    date_of_order VARCHAR(50) NOT NULL,
    CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES albums(album_id)
);

CREATE TABLE gig_dates (
    event_id VARCHAR(50) UNIQUE PRIMARY KEY NOT NULL,
    place VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    event_link VARCHAR(500) DEFAULT 'no link',
    is_canceled BOOLEAN DEFAULT false,
    added_at VARCHAR(50) NOT NULL,
    updated_at VARCHAR(50) NOT NULL,
);

CREATE TABLE request_history(
    request_id SERIAL PRIMARY KEY,
    route_request VARCHAR(50) NOT NULL,
    method VARCHAR(20) NOT NULL,
    date_request VARCHAR(50),
    time_request VARCHAR(50)
);

CREATE TABLE albums (
    album_id VARCHAR(50) UNIQUE PRIMARY KEY NOT NULL,
    title VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    description VARCHAR(1000) NOT NULL,
    track_list JSON NOT NULL,
    playlist_link VARCHAR(100),
    video_link  VARCHAR(100),
	photos_paths VARCHAR(70) NOT NULL,
	color VARCHAR(50) NOT NULL,
	is_released BOOLEAN DEFAULT FALSE,
    price INTEGER FLOAT DEFAULT 10,
    shop_link VARCHAR(100),
    added_at VARCHAR(50) NOT NULL,
    updated_at VARCHAR(50) NOT NULL
);

CREATE TABLE media(
    media_id VARCHAR(50) UNIQUE PRIMARY KEY NOT NULL,
    path VARCHAR(200),
    type VARCHAR(20),
    size INTEGER,
    is_video BOOLEAN DEFAULT NULL,
    added_at VARCHAR(50)
);

-- DELETE FROM albums WHERE album_id = '4839369a-a99d-4b3a-9c32-594e8a2a777a'

-- ALTER TABLE albums ADD COLUMN is_released BOOLEAN
-- ALTER TABLE gig_dates ADD COLUMN uppdated_at DATE

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- SELECT * FROM gig_dates;