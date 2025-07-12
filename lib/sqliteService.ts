import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

const DB_NAME = 'photomap.db';

let db: SQLiteDatabase | null = null;

// DDL statements for all tables (mirroring doc/ddl.sql, using SQLite-compatible types)
const DDL = [
  `CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    privacy TEXT DEFAULT 'personal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS photos (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    image_uri TEXT NOT NULL,
    original_lat REAL NOT NULL,
    original_lng REAL NOT NULL,
    adjusted_lat REAL,
    adjusted_lng REAL,
    camera_angle REAL,
    lens TEXT,
    timestamp TIMESTAMP NOT NULL,
    device_model TEXT,
    camera_settings TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS site_photos (
    site_id TEXT NOT NULL,
    photo_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (site_id, photo_id),
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );`,
  `CREATE TABLE IF NOT EXISTS photo_tags (
    photo_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (photo_id, tag_id),
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_photos_site_id ON photos(site_id);`,
  `CREATE INDEX IF NOT EXISTS idx_site_photos_site_id_position ON site_photos(site_id, position);`,
  `CREATE INDEX IF NOT EXISTS idx_photo_tags_photo_id ON photo_tags(photo_id);`
];

/**
 * Initializes the SQLite database and ensures all tables exist.
 * Call this on app startup before any DB operations.
 */
export async function initializeDatabase(): Promise<void> {
  if (!db) {
    db = await openDatabaseAsync(DB_NAME);
  }
  for (const sql of DDL) {
    await db.execAsync(sql);
  }
}

/**
 * Returns the SQLite database instance (after initialization).
 */
export function getDb(): SQLiteDatabase | null {
  return db;
}

/**
 * Runs a query on the database. SELECT returns rows, others return void.
 * @param sql SQL query string
 * @param params Query parameters
 */
export async function runQuery<T = any>(sql: string, params: any[] = []): Promise<T[] | void> {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  const isSelect = /^\s*SELECT/i.test(sql);
  if (isSelect) {
    return await db.getAllAsync<T>(sql, params);
  } else {
    await db.execAsync(sql);
    return;
  }
} 