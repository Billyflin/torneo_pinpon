"use client"

import { useState, useEffect, useMemo } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PendingMatch {
  player1: string
  player2: string
}

export default function PendingMatchesCollapsible() {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingMatches, setPendingMatches] = useState<PendingMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPendingMatches = async () => {
      try {
        const response = await fetch("/api/pending-matches")
        const data = await response.json()
        setPendingMatches(data)
      } catch (error) {
        console.error("Error fetching pending matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPendingMatches()
  }, [])

  const shuffleArray = (array: PendingMatch[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const shuffledPendingMatches = useMemo(() => shuffleArray(pendingMatches), [pendingMatches])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex justify-between w-full">
                <span>Partidos Pendientes {!isLoading && `(${pendingMatches.length})`}</span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent forceMount>
              <CardContent>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="overflow-hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Jugador 1</TableHead>
                            <TableHead>Jugador 2</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoading
                            ? Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Skeleton className="h-4 w-[100px]" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-4 w-[100px]" />
                                  </TableCell>
                                </TableRow>
                              ))
                            : shuffledPendingMatches.map((match, index) => (
                                <motion.tr
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                  <TableCell>{match.player1} 🏓</TableCell>
                                  <TableCell>{match.player2} 🏓</TableCell>
                                </motion.tr>
                              ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

