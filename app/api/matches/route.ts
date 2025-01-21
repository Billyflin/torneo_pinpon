import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { initDB } from "@/lib/init-db"

export async function GET() {
  await initDB()
  const matches = await sql`
    SELECT 
      m.id,
      p1.name as player1,
      p2.name as player2,
      w.name as winner,
      m.set1_score,
      m.set2_score,
      m.set3_score,
      m.played_at
    FROM matches m
    JOIN players p1 ON m.player1_id = p1.id
    JOIN players p2 ON m.player2_id = p2.id
    JOIN players w ON m.winner_id = w.id
    ORDER BY m.played_at DESC
    LIMIT 20
  `

  return NextResponse.json(matches)
}

