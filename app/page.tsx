import { Suspense } from "react"
import { getPlayers, getMatches, addMatch } from "./lib/db"
import { runMigrations } from "./lib/migrations"
import { Leaderboard } from "./components/leaderboard"
import { MatchHistory } from "./components/match-history"
import { MatchForm } from "./components/match-form"
import type { Match } from "@/app/types/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { TableIcon as TableTennis, Trophy, ClipboardList } from "lucide-react"


export const dynamic = "force-dynamic"

export default async function Home() {
  await runMigrations()
  const players = await getPlayers()
  const matches = await getMatches()

  async function handleAddMatch(match: Match) {
    "use server"
    await addMatch(match)
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center my-8">
        <TableTennis className="inline-block mr-2" />
        Torneo Épico de Tenis de Mesa
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2" />
              Clasificación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Cargando clasificación... ⏳</div>}>
              <Leaderboard players={players} />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2" />
              Registrar Partido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MatchForm players={players} onSubmit={handleAddMatch} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TableTennis className="mr-2" />
            Historial de Partidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Cargando historial... ⏳</div>}>
            <MatchHistory matches={matches} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}

