import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { initDB } from "@/lib/init-db"

export async function GET() {
  await initDB()

  const standings = await sql`
    SELECT 
      p.name,
      s.points,
      s.matches_played,
      s.wins,
      s.losses,
      s.current_streak,
      s.longest_streak,
      CASE 
        WHEN s.matches_played > 0 THEN CAST(s.wins AS FLOAT) / CAST(s.matches_played AS FLOAT)
        ELSE 0
      END AS effectiveness
    FROM 
      standings s
    JOIN 
      players p ON s.player_id = p.id
    ORDER BY 
      s.points DESC, s.matches_played ASC
  `

  return NextResponse.json(standings)
}

export async function POST(request: Request) {
  await initDB()

  const { player1, player2, set1, set2, set3, winner } = await request.json()

  // Verificar la contraseña
  const authHeader = request.headers.get("Authorization")
  if (authHeader !== `Bearer ${process.env.DATA_ENTRY_PASSWORD}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await initDB()

  // Verificar si el partido ya existe
  const existingMatch = await sql`
    SELECT id FROM matches 
    WHERE 
      (player1_id = (SELECT id FROM players WHERE name = ${player1}) AND 
       player2_id = (SELECT id FROM players WHERE name = ${player2}))
      OR
      (player1_id = (SELECT id FROM players WHERE name = ${player2}) AND 
       player2_id = (SELECT id FROM players WHERE name = ${player1}))
  `

  if (existingMatch.length > 0) {
    return NextResponse.json({ error: "Este partido ya ha sido registrado" }, { status: 400 })
  }

  // Insertar el partido
  await sql`
    INSERT INTO matches (player1_id, player2_id, winner_id, set1_score, set2_score, set3_score)
    VALUES (
      (SELECT id FROM players WHERE name = ${player1}),
      (SELECT id FROM players WHERE name = ${player2}),
      (SELECT id FROM players WHERE name = ${winner}),
      ${set1}, ${set2}, ${set3}
    )
  `

  // Actualizar las estadísticas
  for (const player of [player1, player2]) {
    const isWinner = player === winner
    await sql`
      UPDATE standings
      SET 
        points = points + ${isWinner ? 3 : 0},
        matches_played = matches_played + 1,
        wins = wins + ${isWinner ? 1 : 0},
        losses = losses + ${isWinner ? 0 : 1},
        current_streak = CASE 
          WHEN ${isWinner} THEN current_streak + 1
          ELSE 0
        END,
        longest_streak = GREATEST(longest_streak, CASE 
          WHEN ${isWinner} THEN current_streak + 1
          ELSE longest_streak
        END)
      WHERE player_id = (SELECT id FROM players WHERE name = ${player})
    `
  }

  return NextResponse.json({ success: true })
}

