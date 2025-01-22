import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useCallback } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Standing {
  name: string
  points: number
  matches_played: number
  wins: number
  losses: number
  current_streak: number
  longest_streak: number
  effectiveness: number
}

interface StandingsTableProps {
  standings: Standing[]
  onHover: () => void
}

export default function StandingsTable({ standings, onHover }: StandingsTableProps) {
  const getRowStyle = useCallback((index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 dark:bg-yellow-900/30"
      case 1:
        return "bg-gray-100 dark:bg-gray-800/30"
      case 2:
        return "bg-orange-100 dark:bg-orange-900/30"
      default:
        return ""
    }
  }, [])

  const getStreakEmoji = useCallback((streak: number) => {
    if (streak >= 5) return "🔥🔥🔥"
    if (streak >= 3) return "🔥🔥"
    if (streak >= 1) return "🔥"
    return "❄️"
  }, [])

  return (
      <ScrollArea className="h-[calc(100vh-300px)] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Pos</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead className="text-right">Pts</TableHead>
              <TableHead className="text-right hidden md:table-cell">PJ</TableHead>
              <TableHead className="text-right hidden md:table-cell">PG</TableHead>
              <TableHead className="text-right hidden md:table-cell">PP</TableHead>
              <TableHead className="text-right hidden md:table-cell">Efec</TableHead>
              <TableHead className="text-right">Racha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((standing, index) => (
                <TooltipProvider key={standing.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableRow
                          className={cn("cursor-pointer transition-colors hover:bg-muted/50", getRowStyle(index))}
                          onMouseEnter={() => index === 0 && onHover()}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{standing.name}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{standing.points}</Badge>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">{standing.matches_played}</TableCell>
                        <TableCell className="text-right hidden md:table-cell">{standing.wins}</TableCell>
                        <TableCell className="text-right hidden md:table-cell">{standing.losses}</TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <Badge variant="outline">{(standing.effectiveness * 100).toFixed(0)}%</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="default">
                            {standing.current_streak} {getStreakEmoji(standing.current_streak)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="p-4 w-64">
                      <div className="text-sm">
                        <h3 className="font-bold mb-2">{standing.name}</h3>
                        <p>Puntos: {standing.points} 🏆</p>
                        <p>Partidos jugados: {standing.matches_played}</p>
                        <p>Victorias: {standing.wins} 🎉</p>
                        <p>Derrotas: {standing.losses} 😢</p>
                        <p>Efectividad: {(standing.effectiveness * 100).toFixed(2)}% ⚡</p>
                        <p>
                          Racha actual: {standing.current_streak} {getStreakEmoji(standing.current_streak)}
                        </p>
                        <p>Mejor racha: {standing.longest_streak} 🌟</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
  )
}

