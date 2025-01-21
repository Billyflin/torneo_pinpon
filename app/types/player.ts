export interface Player {
  id: string;
  name: string;
  nickname: string;
  emoji: string;
  matches: (MatchResult | null)[];
  totalPoints: number;
  winStreak: number;
  stats: PlayerStats;
}

export interface PlayerStats {
  played: number;
  won: number;
  lost: number;
}

export type MatchResult = 'win' | 'loss';

export interface Match {
  id: string;
  player1Id: string;
  player2Id: string;
  result: MatchResult;
  date: Date;
}

export interface MatchHistory {
  [key: string]: Match[];
}

