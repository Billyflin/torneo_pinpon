import { NextResponse } from "next/server"
import sql from "../../../lib/db"
import { initDB } from "../../../lib/init-db"

export async function GET() {
  await initDB()

  const players = await sql`
    SELECT id, name
    FROM players
    ORDER BY name ASC
  `

  return NextResponse.json(players)
}

