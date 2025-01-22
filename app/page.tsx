"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import StandingsTable from "../components/StandingsTable"
import MatchHistory from "../components/MatchHistory"
import PendingMatchesCollapsible from "../components/PendingMatchesCollapsible"
import MatchEntryPopup from "../components/MatchEntryPopup"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false })

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

interface Player {
  id: number
  name: string
}

export default function Home() {
  const [standings, setStandings] = useState<Standing[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const standingsResponse = await fetch("/api/tournament")
      const standingsData = await standingsResponse.json()
      setStandings(standingsData)

      const playersResponse = await fetch("/api/players")
      const playersData = await playersResponse.json()
      setPlayers(playersData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)
  }

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <ReactConfetti recycle={false} />}
      <div className="container mx-auto p-4">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Torneo de Ping Pong BeCloud 🏓
        </motion.h1>
        <div className="flex justify-center mb-6">
          <Button onClick={fetchData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar datos
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <Tabs defaultValue="standings" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="standings">Clasificación</TabsTrigger>
              <TabsTrigger value="pending">Pendientes</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>
            <TabsContent value="standings">
              <Card>
                <CardHeader>
                  <CardTitle>Clasificación 🏆</CardTitle>
                </CardHeader>
                <CardContent>
                  <StandingsTable standings={standings} onHover={handleConfetti} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending">
              <PendingMatchesCollapsible />
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Partidos 📜</CardTitle>
                </CardHeader>
                <CardContent>
                  <MatchHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        <div className="mt-6 text-center">
          <MatchEntryPopup players={players} onMatchAdded={handleConfetti} />
        </div>
      </div>
    </div>
  )
}

