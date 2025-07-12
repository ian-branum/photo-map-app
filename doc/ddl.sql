-- Photo Mapping App DDL
-- Compatible with both Supabase Postgres (with PostGIS) and SQLite

-- Table: sites
CREATE TABLE sites (
    id TEXT PRIMARY KEY, -- UUID or unique string
    name TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    privacy TEXT DEFAULT 'personal', -- e.g., 'personal', 'shareable', 'public'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: photos
CREATE TABLE photos (
    id TEXT PRIMARY KEY, -- UUID or unique string
    site_id TEXT NOT NULL,
    image_uri TEXT NOT NULL, -- file path or URL
    original_lat REAL NOT NULL,
    original_lng REAL NOT NULL,
    adjusted_lat REAL, -- nullable, for user-adjusted location
    adjusted_lng REAL, -- nullable, for user-adjusted location
    camera_angle REAL, -- azimuth in degrees (0-360)
    lens TEXT, -- e.g., '0.5x', '1x', '5x'
    timestamp TIMESTAMP NOT NULL,
    device_model TEXT,
    camera_settings TEXT, -- JSON string: {"aperture":..., "shutter":..., "iso":...}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

-- Table: site_photos (for ordering and many-to-many, if needed)
CREATE TABLE site_photos (
    site_id TEXT NOT NULL,
    photo_id TEXT NOT NULL,
    position INTEGER NOT NULL, -- order in the site
    PRIMARY KEY (site_id, photo_id),
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
);

-- Table: tags (optional, for categorization)
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Table: photo_tags (optional, for tagging photos)
CREATE TABLE photo_tags (
    photo_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (photo_id, tag_id),
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_photos_site_id ON photos(site_id);
CREATE INDEX idx_site_photos_site_id_position ON site_photos(site_id, position);
CREATE INDEX idx_photo_tags_photo_id ON photo_tags(photo_id);

-- For Postgres with PostGIS, you may add:
-- ALTER TABLE photos ADD COLUMN geom geometry(Point, 4326);
-- But for SQLite, use original_lat/original_lng columns.
