import sql from "./db"

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS matches (
      id SERIAL PRIMARY KEY,
      player1_id INTEGER REFERENCES players(id),
      player2_id INTEGER REFERENCES players(id),
      winner_id INTEGER REFERENCES players(id),
      set1_score TEXT NOT NULL,
      set2_score TEXT NOT NULL,
      set3_score TEXT,
      played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS standings (
      player_id INTEGER REFERENCES players(id) UNIQUE,
      points INTEGER DEFAULT 0,
      matches_played INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0
    )
  `

  // Insertar jugadores iniciales si no existen
  const players = [
    "Iakov",
    "Lucas L",
    "Michel",
    "Billy",
    "Felipe J",
    "Don Ale",
    "Lucas P",
    "Nibaldo",
    "Felipe M",
    "Marcos",
    "Profe",
    "Raul"
  ]

  for (const player of players) {
    await sql`
      INSERT INTO players (name)
      VALUES (${player})
      ON CONFLICT (name) DO NOTHING
    `

    await sql`
      INSERT INTO standings (player_id, points, matches_played, wins, losses, current_streak, longest_streak)
      SELECT id, 0, 0, 0, 0, 0, 0 FROM players WHERE name = ${player}
      ON CONFLICT (player_id) DO NOTHING
    `
  }
}

