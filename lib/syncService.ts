import { supabase } from './supabaseClient';
import { getDb, runQuery } from './sqliteService';

/**
 * Last-write-wins sync for all tables between Supabase and SQLite.
 * - Pulls new/updated records from Supabase and upserts into SQLite.
 * - Pushes new/updated local records to Supabase.
 * - For conflicts, the record with the latest updated_at wins.
 */

// List of tables to sync
const TABLES = ['sites', 'photos', 'site_photos', 'tags', 'photo_tags'];

/**
 * Sync all tables between Supabase and SQLite.
 */
export async function syncAll() {
  for (const table of TABLES) {
    await syncTable(table);
  }
}

/**
 * Sync a single table between Supabase and SQLite.
 * @param table Table name
 */
export async function syncTable(table: string) {
  // 1. Pull from Supabase
  const { data: remoteRows, error } = await supabase.from(table).select('*');
  if (error) throw error;

  // 2. Get all local rows
  const localRows = (await runQuery<any>(`SELECT * FROM ${table}`)) || [];
  const localMap = new Map(localRows.map((row: any) => [row.id, row]));
  const remoteMap = new Map((remoteRows || []).map((row: any) => [row.id, row]));

  // 3. Upsert remote rows into local DB (if newer or missing)
  for (const remote of remoteRows || []) {
    const local = localMap.get(remote.id);
    if (!local || new Date(remote.updated_at) > new Date(local.updated_at)) {
      // Build upsert SQL
      const keys = Object.keys(remote);
      const placeholders = keys.map(() => '?').join(',');
      const updates = keys.map(k => `${k} = excluded.${k}`).join(', ');
      const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders}) ON CONFLICT(id) DO UPDATE SET ${updates}`;
      await runQuery(sql, keys.map(k => remote[k]));
    }
  }

  // 4. Push local rows to Supabase (if newer or missing)
  for (const local of localRows) {
    const remote = remoteMap.get(local.id);
    if (!remote || new Date(local.updated_at) > new Date(remote.updated_at)) {
      // Upsert to Supabase
      await supabase.from(table).upsert([local]);
    }
  }
} 