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
    //const interval = setInterval(fetchData, 30000)

    //return () => clearInterval(interval)
  }, [])

  const handleConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)
  }

  //const handleMatchAdded = () => {
  //  fetchData()
  //  setShowConfetti(true)
  //  setTimeout(() => setShowConfetti(false), 5000)
  //}

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <ReactConfetti recycle={false} />}
      <div className="container mx-auto p-4">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Torneo de Ping Pong BeCloud 🏓
        </motion.h1>
        <div className="flex justify-center mb-4">
          <Button onClick={fetchData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar datos
          </Button>
        </div>
        {isLoading ? (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Clasificación 🏆</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Partidos Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[100px] w-full" />
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Historial de Partidos 📜</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Clasificación 🏆</CardTitle>
                </CardHeader>
                <CardContent>
                  <StandingsTable standings={standings} onHover={handleConfetti} />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <PendingMatchesCollapsible />
            </motion.div>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Partidos 📜</CardTitle>
                </CardHeader>
                <CardContent>
                  <MatchHistory />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <MatchEntryPopup players={players} onMatchAdded={handleConfetti} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

