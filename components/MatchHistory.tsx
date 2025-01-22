import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"

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

const ITEMS_PER_PAGE = 10

export default function MatchHistory() {
  const [matches, setMatches] = useState<Match[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/matches")
        const data = await response.json()
        setMatches(data)
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const totalPages = Math.ceil(matches.length / ITEMS_PER_PAGE)
  const paginatedMatches = matches.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const formatScore = (score: string) => {
    const [score1, score2] = score.split("-")
    return (
        <span>
        <span className={Number(score1) > Number(score2) ? "font-bold" : ""}>{score1}</span>-
        <span className={Number(score2) > Number(score1) ? "font-bold" : ""}>{score2}</span>
      </span>
    )
  }

  return (
      <Card>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Fecha</TableHead>
                  <TableHead>Jugadores</TableHead>
                  <TableHead className="text-right">Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Cargando partidos...
                      </TableCell>
                    </TableRow>
                ) : paginatedMatches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No hay partidos registrados
                      </TableCell>
                    </TableRow>
                ) : (
                    paginatedMatches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell className="font-medium">{format(new Date(match.played_at), "dd/MM/yy HH:mm")}</TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                              <Badge variant={match.winner === match.player1 ? "default" : "outline"}>{match.player1}</Badge>
                              <span className="hidden sm:inline">vs</span>
                              <Badge variant={match.winner === match.player2 ? "default" : "outline"}>{match.player2}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span>{formatScore(match.set1_score)}</span>
                              <span>{formatScore(match.set2_score)}</span>
                              {match.set3_score && <span>{formatScore(match.set3_score)}</span>}
                            </div>
                          </TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
  )
}

