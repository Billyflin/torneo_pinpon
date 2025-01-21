import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface Match {
  id: number
  player1: string
  player2: string
  winner: string
  set1_score: string
  set2_score: string
  set3_score: string | null
  played_at: string
}

export default function MatchHistory() {
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    const fetchMatches = async () => {
      const response = await fetch("/api/matches")
      const data = await response.json()
      setMatches(data)
    }

    fetchMatches()
  }, [])

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Fecha</TableHead>
            <TableHead className="font-bold">Jugadores</TableHead>
            <TableHead className="font-bold">Resultado</TableHead>
            <TableHead className="font-bold">Ganador</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match, index) => (
            <motion.tr
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TableCell>{new Date(match.played_at).toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant="outline">{match.player1}</Badge> 🆚 <Badge variant="outline">{match.player2}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{match.set1_score}</Badge>,{" "}
                <Badge variant="secondary">{match.set2_score}</Badge>
                {match.set3_score && (
                  <>
                    , <Badge variant="secondary">{match.set3_score}</Badge>
                  </>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="default">{match.winner} 🏆</Badge>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

