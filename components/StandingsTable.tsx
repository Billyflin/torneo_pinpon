import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Posición</TableHead>
            <TableHead className="font-bold">Jugador</TableHead>
            <TableHead className="font-bold">Puntos</TableHead>
            <TableHead className="font-bold">PJ</TableHead>
            <TableHead className="font-bold">PG</TableHead>
            <TableHead className="font-bold">PP</TableHead>
            <TableHead className="font-bold">Efectividad</TableHead>
            <TableHead className="font-bold">Racha Actual</TableHead>
            <TableHead className="font-bold">Racha Más Larga</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing, index) => (
            <motion.tr
              key={standing.name}
              className={cn(getRowStyle(index))}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onHoverStart={() => index === 0 && onHover()}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">{standing.name}</TableCell>
              <TableCell className="font-bold">
                <Badge variant="secondary">{standing.points} 🏆</Badge>
              </TableCell>
              <TableCell>{standing.matches_played}</TableCell>
              <TableCell>{standing.wins}</TableCell>
              <TableCell>{standing.losses}</TableCell>
              <TableCell className="font-bold">
                <Badge variant="outline">{(standing.effectiveness * 100).toFixed(2)}%</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="default">{standing.current_streak} 🔥</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="default">{standing.longest_streak} 🌟</Badge>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

