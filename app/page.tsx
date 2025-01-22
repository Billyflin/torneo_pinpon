"use client"

import { useEffect, useState } from "react"
import StandingsTable from "../components/StandingsTable"
import MatchHistory from "../components/MatchHistory"
import PendingMatchesCollapsible from "../components/PendingMatchesCollapsible"
import MatchEntryPopup from "../components/MatchEntryPopup"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import Statistics from "../components/Statistics"
import Rules from "../components/Rules"

interface Standing {
  name: string
  points: number
  matches_played: number
  wins: number
  losses: number
  current_streak: number
  longest_streak: number
  effectiveness: number
  total_points: number
  total_sets: number
}

interface Player {
  id: number
  name: string
}

export default function Home() {
  const [standings, setStandings] = useState<Standing[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async () => {
    setIsRefreshing(true)
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
      setIsRefreshing(false)
    }
  }

  const handleMatchAdded = () => {
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b py-6 px-4 mb-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center mb-4 md:mb-0"
              >
                <h1 className="text-3xl md:text-4xl font-bold mr-2">Torneo de Ping Pong BeCloud</h1>
                <span className="text-4xl">🏓</span>
              </motion.div>
              <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex gap-2"
              >
                <Button
                    onClick={fetchData}
                    className={cn(
                        "bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300",
                        isRefreshing && "animate-pulse",
                    )}
                    disabled={isRefreshing}
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                  {isRefreshing ? "Actualizando..." : "Actualizar datos"}
                </Button>
                <MatchEntryPopup players={players} onMatchAdded={handleMatchAdded}      disabled={isRefreshing} />
              </motion.div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4">
          <AnimatePresence>
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                >
                  <Skeleton className="h-[300px] w-full" />
                  <Skeleton className="h-[100px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                  <Tabs defaultValue="standings" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 mb-6">
                      <TabsTrigger value="standings">Clasificación</TabsTrigger>
                      <TabsTrigger value="pending">Pendientes</TabsTrigger>
                      <TabsTrigger value="history">Historial</TabsTrigger>
                      <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
                      <TabsTrigger value="rules">Reglas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="standings">
                      <StandingsTable standings={standings} />
                    </TabsContent>
                    <TabsContent value="pending">
                      <PendingMatchesCollapsible />
                    </TabsContent>
                    <TabsContent value="history">
                      <MatchHistory />
                    </TabsContent>
                    <TabsContent value="statistics">
                      <Statistics standings={standings} />
                    </TabsContent>
                    <TabsContent value="rules">
                      <Rules />
                    </TabsContent>
                  </Tabs>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  )
}

