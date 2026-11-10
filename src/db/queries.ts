// Consultas do modo teste: usuários de teste e momentos (rolês rápidos).
// Tudo é lido/gravado no SQLite local — nenhum dado fictício pré-escrito.

import { getDb } from './database';

export type Person = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  emoji: string;
  gradient: [string, string];
  interests: string[];
  wantsToday: string[];
  distanceM: number;
  online: boolean;
};

export type PersonInput = Omit<Person, 'id'> & { id?: string };

export type Moment = {
  id: string;
  title: string;
  place: string;
  whenLabel: string;
  emoji: string;
};

export type MomentMember = {
  user: Person;
  joined: boolean;
};

export type MomentWithMembers = Moment & { members: MomentMember[] };

type UserRow = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  emoji: string;
  gradient: string;
  interests: string;
  wants_today: string;
  distance_m: number;
  online: number;
};

type MemberRow = UserRow & { moment_id: string; joined: number };

/** Paletas de avatar (o usuário escolhe o emoji; a cor acompanha). */
export const AVATAR_GRADIENTS: [string, string][] = [
  ['#6F42D9', '#3B1F73'],
  ['#956AFA', '#5B37B7'],
  ['#B23FE2', '#6A1FA8'],
  ['#4B5DFF', '#2A33A8'],
  ['#D946A6', '#7A2168'],
  ['#2FB8A6', '#18685F'],
];

export const AVATAR_EMOJIS = [
  '🙂',
  '😄',
  '😎',
  '🤓',
  '🌱',
  '🎸',
  '☕',
  '⚽',
  '📚',
  '🎮',
  '🎨',
  '🐾',
];

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    const value = JSON.parse(raw) as T;
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function toPerson(row: UserRow): Person {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    city: row.city,
    bio: row.bio,
    emoji: row.emoji,
    gradient: parseJson<[string, string]>(row.gradient, AVATAR_GRADIENTS[0]),
    interests: parseJson<string[]>(row.interests, []),
    wantsToday: parseJson<string[]>(row.wants_today, []),
    distanceM: row.distance_m,
    online: row.online === 1,
  };
}

// ── Usuários de teste ────────────────────────────────────────────────

export async function listUsers(): Promise<Person[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<UserRow>(
    'SELECT * FROM users ORDER BY created_at ASC',
  );
  return rows.map(toPerson);
}

export async function saveUser(input: PersonInput): Promise<void> {
  const db = await getDb();
  const gradient = JSON.stringify(input.gradient);
  const interests = JSON.stringify(input.interests);
  const wantsToday = JSON.stringify(input.wantsToday);

  if (input.id) {
    await db.runAsync(
      `UPDATE users SET name = ?, age = ?, city = ?, bio = ?, emoji = ?, gradient = ?,
       interests = ?, wants_today = ?, distance_m = ?, online = ? WHERE id = ?`,
      input.name,
      input.age,
      input.city,
      input.bio,
      input.emoji,
      gradient,
      interests,
      wantsToday,
      input.distanceM,
      input.online ? 1 : 0,
      input.id,
    );
    return;
  }

  await db.runAsync(
    `INSERT INTO users (id, name, age, city, bio, emoji, gradient, interests, wants_today, distance_m, online, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    newId(),
    input.name,
    input.age,
    input.city,
    input.bio,
    input.emoji,
    gradient,
    interests,
    wantsToday,
    input.distanceM,
    input.online ? 1 : 0,
    Date.now(),
  );
}

export async function deleteUser(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM moment_members WHERE user_id = ?', id);
  await db.runAsync('DELETE FROM users WHERE id = ?', id);
}

/** Zera usuários, momentos e participações (modo teste). */
export async function clearTestData(): Promise<void> {
  const db = await getDb();
  await db.execAsync(
    'DELETE FROM moment_members; DELETE FROM moments; DELETE FROM users;',
  );
}

// ── Momentos (rolês rápidos) ─────────────────────────────────────────

export async function listMomentsWithMembers(): Promise<MomentWithMembers[]> {
  const db = await getDb();
  const moments = await db.getAllAsync<Moment>(
    `SELECT id, title, place, when_label AS whenLabel, emoji
     FROM moments ORDER BY created_at DESC`,
  );
  const members = await db.getAllAsync<MemberRow>(
    `SELECT u.*, m.moment_id, m.joined
     FROM users u
     JOIN moment_members m ON m.user_id = u.id
     ORDER BY u.name ASC`,
  );

  return moments.map((moment) => ({
    ...moment,
    members: members
      .filter((row) => row.moment_id === moment.id)
      .map((row) => ({ user: toPerson(row), joined: row.joined === 1 })),
  }));
}

export async function createMoment(input: {
  title: string;
  place: string;
  whenLabel: string;
  emoji: string;
}): Promise<string> {
  const db = await getDb();
  const id = newId();

  await db.runAsync(
    'INSERT INTO moments (id, title, place, when_label, emoji, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    id,
    input.title,
    input.place,
    input.whenLabel,
    input.emoji,
    Date.now(),
  );

  // Todo usuário de teste já aparece no momento (convocado); ele entra/sai na tela.
  const users = await listUsers();
  for (const user of users) {
    await db.runAsync(
      'INSERT OR IGNORE INTO moment_members (moment_id, user_id, joined) VALUES (?, ?, 0)',
      id,
      user.id,
    );
  }

  return id;
}

export async function deleteMoment(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM moment_members WHERE moment_id = ?', id);
  await db.runAsync('DELETE FROM moments WHERE id = ?', id);
}

export async function setMemberJoined(
  momentId: string,
  userId: string,
  joined: boolean,
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE moment_members SET joined = ? WHERE moment_id = ? AND user_id = ?',
    joined ? 1 : 0,
    momentId,
    userId,
  );
}

export async function addMember(momentId: string, userId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT OR IGNORE INTO moment_members (moment_id, user_id, joined) VALUES (?, ?, 0)',
    momentId,
    userId,
  );
}

export async function removeMember(momentId: string, userId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'DELETE FROM moment_members WHERE moment_id = ? AND user_id = ?',
    momentId,
    userId,
  );
}

/** Usuários de teste que ainda não estão no momento. */
export async function listUsersNotIn(momentId: string): Promise<Person[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<UserRow>(
    `SELECT u.* FROM users u
     WHERE u.id NOT IN (SELECT user_id FROM moment_members WHERE moment_id = ?)
     ORDER BY u.name ASC`,
    momentId,
  );
  return rows.map(toPerson);
}
