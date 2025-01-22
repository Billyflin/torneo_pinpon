"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FeaturedMatch } from "./FeaturedMatch"
import { Skeleton } from "@/components/ui/skeleton"

interface PendingMatch {
  player1: string
  player2: string
}

export default function PendingMatchesCollapsible() {
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

  const featuredMatches = shuffledPendingMatches.slice(0, 2)
  const highlightedMatches = shuffledPendingMatches.slice(2, 6)
  const remainingMatches = shuffledPendingMatches.slice(6)

  if (isLoading) {
    return (
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
    )
  }

  return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredMatches.map((match, index) => (
              <FeaturedMatch key={index} player1={match.player1} player2={match.player2} />
          ))}
        </div>

        <Card className="">
          <CardHeader>
            <CardTitle className="">Próximos Partidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {highlightedMatches.map((match, index) => (
                  <Card key={index} className="">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center space-y-2">
                        <Badge variant="secondary" className="">
                          {match.player1}
                        </Badge>
                        <span className="text-sm font-bold">VS</span>
                        <Badge variant="secondary" className="">
                          {match.player2}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="">Partidos Restantes ({remainingMatches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {remainingMatches.map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{match.player1}</span>
                      <span className="text-xs font-bold mx-1">VS</span>
                      <span className="text-sm">{match.player2}</span>
                    </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
  )
}

