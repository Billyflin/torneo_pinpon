import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { CalendarDays, Users, Trophy } from "lucide-react"
import type { Match } from "@/app/types/types"

export function MatchHistory({ matches }: { matches: Match[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <CalendarDays className="mr-2 inline-block" /> Fecha
          </TableHead>
          <TableHead>
            <Users className="mr-2 inline-block" /> Jugadores
          </TableHead>
          <TableHead>Resultado</TableHead>
          <TableHead>
            <Trophy className="mr-2 inline-block" /> Ganador
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={match.id}>
            <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
            <TableCell>
              {match.player1_name} 🆚 {match.player2_name}
            </TableCell>
            <TableCell>
              {match.set1_player1}-{match.set1_player2}, {match.set2_player1}-{match.set2_player2}
              {match.set3_player1 && match.set3_player2 ? `, ${match.set3_player1}-${match.set3_player2}` : ""}
            </TableCell>
            <TableCell className="font-medium">{match.winner_name} 🏆</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

