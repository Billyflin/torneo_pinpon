import { neon } from "@neondatabase/serverless"

export async function runMigrations() {
  const sql = neon(process.env.DATABASE_URL!)

  // Primero, eliminamos la tabla matches si existe (debido a las referencias)
  await sql`DROP TABLE IF EXISTS matches`

  // Luego eliminamos la tabla players si existe
  await sql`DROP TABLE IF EXISTS players`

  // Crear tabla de jugadores con restricción única en el nombre
  await sql`
    CREATE TABLE players (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      points INTEGER DEFAULT 0,
      win_streak INTEGER DEFAULT 0,
      CONSTRAINT unique_player_name UNIQUE(name)
    )
  `

  // Crear tabla de partidos
  await sql`
    CREATE TABLE matches (
      id SERIAL PRIMARY KEY,
      player1_id INTEGER REFERENCES players(id),
      player2_id INTEGER REFERENCES players(id),
      winner_id INTEGER REFERENCES players(id),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      set1_player1 INTEGER,
      set1_player2 INTEGER,
      set2_player1 INTEGER,
      set2_player2 INTEGER,
      set3_player1 INTEGER,
      set3_player2 INTEGER
    )
  `

  // Insertar jugadores iniciales
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
    "Juan",
    "Pedro",
  ]

  // Insertar cada jugador
  for (const player of players) {
    await sql`
      INSERT INTO players (name)
      VALUES (${player})
      ON CONFLICT ON CONSTRAINT unique_player_name DO NOTHING
    `
  }
}

