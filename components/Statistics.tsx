"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
}

interface StatisticsProps {
  standings: Standing[]
}

export default function Statistics({ standings }: StatisticsProps) {
  const sortedByEffectiveness = [...standings].sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 5)
  const sortedByLongestStreak = [...standings].sort((a, b) => b.longest_streak - a.longest_streak).slice(0, 5)

  return (
    <div className="space-y-8">
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
              <BarChart data={sortedByEffectiveness}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="effectiveness"
                  fill="var(--color-effectiveness)"
                  radius={[4, 4, 0, 0]}
                  label={{ position: "top", formatter: (value: number) => `${(value * 100).toFixed(0)}%` }}
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
              <BarChart data={sortedByLongestStreak}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="longest_streak"
                  fill="var(--color-longest_streak)"
                  radius={[4, 4, 0, 0]}
                  label={{ position: "top" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

