import { neon } from "@neondatabase/serverless"
import type { Player, Match } from "@/app/types/types"

// Creamos una única instancia de la conexión
const sql = neon(process.env.DATABASE_URL!)

export async function getPlayers(): Promise<Player[]> {
  const players = await sql<Player[]>`
    SELECT * FROM players 
    ORDER BY points DESC, win_streak DESC
  `
  return players
}

export async function getMatches(): Promise<Match[]> {
  const matches = await sql<Match[]>`
    SELECT 
      m.*,
      p1.name as player1_name,
      p2.name as player2_name,
      w.name as winner_name
    FROM matches m
    JOIN players p1 ON m.player1_id = p1.id
    JOIN players p2 ON m.player2_id = p2.id
    JOIN players w ON m.winner_id = w.id
    ORDER BY m.date DESC
  `
  return matches
}

export async function addMatch(match: Match) {
  const {
    player1Id,
    player2Id,
    winnerId,
    set1Player1,
    set1Player2,
    set2Player1,
    set2Player2,
    set3Player1,
    set3Player2,
  } = match

  await sql.transaction([
    sql`
      INSERT INTO matches (
        player1_id, player2_id, winner_id,
        set1_player1, set1_player2,
        set2_player1, set2_player2,
        set3_player1, set3_player2
      ) VALUES (
        ${player1Id}, ${player2Id}, ${winnerId},
        ${set1Player1}, ${set1Player2},
        ${set2Player1}, ${set2Player2},
        ${set3Player1}, ${set3Player2}
      )
    `,
    sql`
      UPDATE players
      SET 
        points = points + 3,
        win_streak = CASE
          WHEN id = ${winnerId} THEN win_streak + 1
          ELSE 0
        END
      WHERE id IN (${player1Id}, ${player2Id})
    `,
  ])
}

