import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { initDB } from "@/lib/init-db"

export async function GET() {
  await initDB()
  // Obtener todos los jugadores
  const players = await sql`SELECT name FROM players ORDER BY name`

  // Obtener todos los partidos ya jugados
  const playedMatches = await sql`
    SELECT 
      p1.name as player1, 
      p2.name as player2
    FROM matches m
    JOIN players p1 ON m.player1_id = p1.id
    JOIN players p2 ON m.player2_id = p2.id
  `

  // Crear un conjunto de partidos jugados para búsqueda rápida
  const playedMatchesSet = new Set(playedMatches.map((m) => `${m.player1}-${m.player2}`))

  // Generar todos los posibles partidos y filtrar los que ya se han jugado
  const pendingMatches = []
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const match = `${players[i].name}-${players[j].name}`
      const reverseMatch = `${players[j].name}-${players[i].name}`
      if (!playedMatchesSet.has(match) && !playedMatchesSet.has(reverseMatch)) {
        pendingMatches.push({
          player1: players[i].name,
          player2: players[j].name,
        })
      }
    }
  }

  return NextResponse.json(pendingMatches)
}

