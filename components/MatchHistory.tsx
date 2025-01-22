import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search, Trophy } from "lucide-react"
import { format, addHours } from "date-fns"
import { es } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

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
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/matches")
        const data = await response.json()
        setMatches(data)
        setFilteredMatches(data)
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [])

  useEffect(() => {
    const filtered = matches.filter(
        (match) =>
            match.player1.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.player2.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredMatches(filtered)
    setCurrentPage(1)
  }, [searchTerm, matches])

  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE)
  const paginatedMatches = filteredMatches.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const formatScore = (score: string) => {
    const [score1, score2] = score.split("-")
    return (
        <div className="flex justify-between items-center w-16">
          <span>{score1}</span>
          <span>-</span>
          <span>{score2}</span>
        </div>
    )
  }

  const renderMatchResult = (match: Match) => {
    const sets = [match.set1_score, match.set2_score, match.set3_score].filter(Boolean) as string[]
    const player1Wins = sets.filter((set) => {
      const [score1, score2] = set.split("-").map(Number)
      return score1 > score2
    }).length
    const player2Wins = sets.length - player1Wins

    return (
        <div className="flex flex-col items-end gap-1">
          {sets.map((set, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Set {index + 1}</span>
                {formatScore(set)}
              </div>
          ))}
          <div className="mt-2 text-sm font-semibold">
            Resultado: {player1Wins} - {player2Wins}
          </div>
        </div>
    )
  }

  return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Historial de Partidos</h2>
          <div className="relative">
            <Input
                type="text"
                placeholder="Buscar jugador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <AnimatePresence>
          {isLoading ? (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-64"
              >
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              </motion.div>
          ) : (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Fecha y Hora</TableHead>
                      <TableHead>Jugadores</TableHead>
                      <TableHead className="text-right">Resultado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMatches.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            No se encontraron partidos
                          </TableCell>
                        </TableRow>
                    ) : (
                        paginatedMatches.map((match) => (
                            <TableRow key={match.id} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                          <span>
                            {format(addHours(new Date(match.played_at), -4), "d 'de' MMMM, yyyy", { locale: es })}
                          </span>
                                  <span className="text-sm text-gray-500">
                            {format(addHours(new Date(match.played_at), -4), "HH:mm")}
                          </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge
                                      variant={match.winner === match.player1 ? "default" : "outline"}
                                      className="flex items-center gap-1"
                                  >
                                    {match.winner === match.player1 && <Trophy size={14} className="text-yellow-500" />}
                                    <span className={match.winner === match.player1 ? "text-yellow-500 font-bold" : ""}>
                              {match.player1}
                            </span>
                                  </Badge>
                                  <span className="text-sm font-semibold">vs</span>
                                  <Badge
                                      variant={match.winner === match.player2 ? "default" : "outline"}
                                      className="flex items-center gap-1"
                                  >
                                    {match.winner === match.player2 && <Trophy size={14} className="text-yellow-500" />}
                                    <span className={match.winner === match.player2 ? "text-yellow-500 font-bold" : ""}>
                              {match.player2}
                            </span>
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{renderMatchResult(match)}</TableCell>
                            </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredMatches.length)} de {filteredMatches.length} partidos
          </p>
          <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <span className="text-sm font-medium">
            Página {currentPage} de {totalPages}
          </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
  )
}

