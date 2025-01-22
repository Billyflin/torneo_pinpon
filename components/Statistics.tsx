"use client"

import { useState, useMemo } from "react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Standing {
  name: string
  points: number
  matches_played: number
  wins: number
  losses: number
  current_streak: number
  longest_streak: number
  effectiveness: number
  total_sets: number
  total_points: number
}

interface StatisticsProps {
  standings: Standing[]
}

export default function Statistics({ standings }: StatisticsProps) {
  const [sortBy, setSortBy] = useState<keyof Standing>("points")

  const sortedStandings = [...standings].sort((a, b) => {
    if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") {
      return (b[sortBy] as number) - (a[sortBy] as number)
    }
    if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
      return (b[sortBy] as string).localeCompare(a[sortBy] as string)
    }
    return 0
  })

  const top5ByEffectiveness = [...standings].sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 5)
  const top5ByLongestStreak = [...standings].sort((a, b) => b.longest_streak - a.longest_streak).slice(0, 5)
  useMemo(() => Math.max(...standings.map((s) => s.longest_streak)), [standings]);
  const radarData = useMemo(() => {
    return standings.map((player) => ({
      name: player.name,
      averagePointsPerSet: player.total_sets > 0 ? player.total_points / player.total_sets : 0,
    }))
  }, [standings])
  return (
      <div className="space-y-8">

        <Card>
          <CardHeader>
            <CardTitle>Comparación de Jugadores</CardTitle>
            <CardDescription>Puntos promedio por set</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                  <Radar
                      name="Puntos promedio por set"
                      dataKey="averagePointsPerSet"
                      stroke="#ff7300"
                      fill="#ff7300"
                      fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Generales</CardTitle>
            <CardDescription>Resumen de las estadísticas de todos los jugadores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Select onValueChange={(value) => setSortBy(value as keyof Standing)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points">Puntos</SelectItem>
                  <SelectItem value="matches_played">Partidos Jugados</SelectItem>
                  <SelectItem value="wins">Victorias</SelectItem>
                  <SelectItem value="effectiveness">Efectividad</SelectItem>
                  <SelectItem value="longest_streak">Racha más larga</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jugador</TableHead>
                  <TableHead className="text-right">Puntos</TableHead>
                  <TableHead className="text-right">PJ</TableHead>
                  <TableHead className="text-right">Victorias</TableHead>
                  <TableHead className="text-right">Derrotas</TableHead>
                  <TableHead className="text-right">Efectividad</TableHead>
                  <TableHead className="text-right">Racha Actual</TableHead>
                  <TableHead className="text-right">Racha más larga</TableHead>
                  <TableHead className="text-right">Pts/Set</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStandings.map((player) => (
                    <TableRow key={player.name}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell className="text-right">{player.points}</TableCell>
                      <TableCell className="text-right">{player.matches_played}</TableCell>
                      <TableCell className="text-right">{player.wins}</TableCell>
                      <TableCell className="text-right">{player.losses}</TableCell>
                      <TableCell className="text-right">{(player.effectiveness * 100).toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{player.current_streak}</TableCell>
                      <TableCell className="text-right">{player.longest_streak}</TableCell>
                      <TableCell className="text-right">
                        {player.total_sets > 0 ? (player.total_points / player.total_sets).toFixed(2) : "N/A"}
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Jugadores por Efectividad</CardTitle>
              <CardDescription>Porcentaje de partidos ganados</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                  config={{
                    effectiveness: {
                      label: "Efectividad",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top5ByEffectiveness}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                        dataKey="effectiveness"
                        fill="var(--color-effectiveness)"
                        radius={[4, 4, 0, 0]}
                        label={{
                          position: "top",
                          formatter: (value: number) => (isNaN(value) ? "N/A" : `${(value * 100).toFixed(0)}%`),
                        }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Jugadores por Racha Más Larga</CardTitle>
              <CardDescription>Número máximo de victorias consecutivas</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                  config={{
                    longest_streak: {
                      label: "Racha más larga",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top5ByLongestStreak}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                        dataKey="longest_streak"
                        radius={[4, 4, 0, 0]}
                        label={{
                          position: "top",
                          formatter: (value: number) => (isNaN(value) ? "N/A" : value.toString()),
                        }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

      </div>
  )
}

