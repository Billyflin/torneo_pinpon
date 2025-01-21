export interface Player {
  id: number
  name: string
  points: number
  win_streak: number
}

export interface Match {
  id?: number
  player1Id: number
  player2Id: number
  winnerId: number
  player1_name?: string
  player2_name?: string
  winner_name?: string
  set1Player1: number
  set1Player2: number
  set2Player1: number
  set2Player2: number
  set3Player1: number
  set3Player2: number
  date?: string
}

