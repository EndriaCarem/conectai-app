// Camada de dados local (expo-sqlite) — substitui os mocks de pessoas e momentos.
// Persiste entre sessões e não guarda nenhum segredo no cliente (regra do backlog).
// TODO(backend): migrar para Supabase (profiles / plans / chat_members) mantendo
// esta mesma interface como fonte offline.

import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'conectai.db';
const DATABASE_VERSION = 1;

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbPromise === null) {
    dbPromise = openAndMigrate();
  }
  return dbPromise;
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await migrate(db);
  return db;
}

async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  if (current >= DATABASE_VERSION) return;

  await db.execAsync(`
    PRAGMA journal_mode = 'wal';

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      city TEXT NOT NULL,
      bio TEXT NOT NULL DEFAULT '',
      emoji TEXT NOT NULL DEFAULT '🙂',
      gradient TEXT NOT NULL DEFAULT '["#6F42D9","#3B1F73"]',
      interests TEXT NOT NULL DEFAULT '[]',
      wants_today TEXT NOT NULL DEFAULT '[]',
      distance_m INTEGER NOT NULL DEFAULT 500,
      online INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS moments (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      place TEXT NOT NULL,
      when_label TEXT NOT NULL,
      emoji TEXT NOT NULL DEFAULT '🎉',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS moment_members (
      moment_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      joined INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (moment_id, user_id)
    );
  `);

  await db.runAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
