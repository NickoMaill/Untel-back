CREATE TABLE gig_dates (
    event_id VARCHAR(50) UNIQUE PRIMARY KEY NOT NULL,
    place VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    event_link VARCHAR(500) DEFAULT 'no link',
    is_canceled BOOLEAN DEFAULT false,
    has_passed BOOLEAN DEFAULT false,
    added_at VARCHAR(50)
);

SELECT * FROM gig_dates;