import { NextResponse } from "next/server"
import sql from "../../../lib/db"
import { initDB } from "../../../lib/init-db"

const BEARER_TOKEN = "fixed_token_123456" // Make sure this matches the frontend token

export async function GET() {
  await initDB()

  const players = await sql`
    SELECT id, name
    FROM players
    ORDER BY name ASC
  `

  return NextResponse.json(players)
}

export async function POST(request: Request) {
  await initDB()

  const { name } = await request.json()



  try {
    // Check if the player already exists
    const existingPlayer = await sql`
      SELECT id FROM players WHERE name = ${name}
    `

    if (existingPlayer.length > 0) {
      return NextResponse.json({ error: "Este jugador ya existe" }, { status: 400 })
    }

    // Insert the new player
    await sql`
      INSERT INTO players (name)
      VALUES (${name})
    `

    // Insert initial standings for the new player
    await sql`
      INSERT INTO standings (player_id, points, matches_played, wins, losses, current_streak, longest_streak)
      SELECT id, 0, 0, 0, 0, 0, 0 FROM players WHERE name = ${name}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding player:", error)
    return NextResponse.json({ error: "Error al agregar el jugador" }, { status: 500 })
  }
}

