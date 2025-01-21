import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Medal, Flame } from "lucide-react"
import type { Player } from "@/app/types/types"

const medals = [
  <Medal className="text-yellow-500" />,
  <Medal className="text-gray-400" />,
  <Medal className="text-amber-600" />,
]

export function Leaderboard({ players }: { players: Player[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Posición</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Puntos</TableHead>
          <TableHead>Racha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => (
          <TableRow key={player.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
            <TableCell className="font-medium">
              {index < 3 ? medals[index] : null} {index + 1}
            </TableCell>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.points} 🏓</TableCell>
            <TableCell>
              {player.win_streak > 0 ? (
                <span className="flex items-center">
                  {player.win_streak} <Flame className="ml-1 text-orange-500" />
                </span>
              ) : (
                "-"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

