import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

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

interface StandingsTableProps {
    standings: Standing[]
}

export default function StandingsTable({ standings }: StandingsTableProps) {
    const [openTooltip, setOpenTooltip] = useState<string | null>(null)

    const getRowStyle = useCallback((index: number) => {
        switch (index) {
            case 0:
                return "bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500"
            case 1:
                return "bg-gray-100 dark:bg-gray-800/30 border-l-4 border-gray-500"
            case 2:
                return "bg-orange-100 dark:bg-orange-900/30 border-l-4 border-orange-500"
            default:
                return ""
        }
    }, [])

    const getStreakEmoji = useCallback((streak: number) => {
        if (streak >= 5) return "🔥🔥🔥"
        if (streak >= 3) return "🔥🔥"
        if (streak >= 1) return "🔥"
        return "❄️"
    }, [])

    const getPositionBadge = useCallback((position: number) => {
        switch (position) {
            case 1:
                return <Badge className="bg-yellow-500">1º 🥇</Badge>
            case 2:
                return <Badge className="bg-gray-400">2º 🥈</Badge>
            case 3:
                return <Badge className="bg-orange-500">3º 🥉</Badge>
            default:
                return <Badge variant="outline">{position}º</Badge>
        }
    }, [])

    return (
        <TooltipProvider>
            <div className="relative">
                <ScrollArea className="h-[calc(100vh-300px)] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Pos</TableHead>
                                <TableHead>Jugador</TableHead>
                                <TableHead className="text-right">Pts</TableHead>
                                <TableHead className="text-right hidden md:table-cell">PJ</TableHead>
                                <TableHead className="text-right hidden md:table-cell">PG</TableHead>
                                <TableHead className="text-right hidden md:table-cell">PP</TableHead>
                                <TableHead className="text-right hidden md:table-cell">Efec</TableHead>
                                <TableHead className="text-right">Racha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {standings.map((standing, index) => (
                                <Tooltip key={standing.name} open={openTooltip === standing.name}>
                                    <TooltipTrigger asChild>
                                        <TableRow
                                            className={cn("cursor-pointer transition-colors", getRowStyle(index))}
                                            onClick={() => setOpenTooltip(openTooltip === standing.name ? null : standing.name)}
                                        >
                                            <TableCell className="font-medium">{getPositionBadge(index + 1)}</TableCell>
                                            <TableCell className="font-medium">{standing.name}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="secondary" className="text-lg font-bold">
                                                    {standing.points}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right hidden md:table-cell">{standing.matches_played}</TableCell>
                                            <TableCell className="text-right hidden md:table-cell">{standing.wins}</TableCell>
                                            <TableCell className="text-right hidden md:table-cell">{standing.losses}</TableCell>
                                            <TableCell className="text-right hidden md:table-cell">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        standing.effectiveness >= 0.7
                                                            ? "bg-green-100 text-green-800"
                                                            : standing.effectiveness >= 0.5
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-red-100 text-red-800",
                                                    )}
                                                >
                                                    {(standing.effectiveness * 100).toFixed(0)}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant="default"
                                                    className={cn(
                                                        standing.current_streak >= 5
                                                            ? "bg-purple-500"
                                                            : standing.current_streak >= 3
                                                                ? "bg-blue-500"
                                                                : standing.current_streak >= 1
                                                                    ? "bg-green-500"
                                                                    : "bg-red-500",
                                                    )}
                                                >
                                                    {standing.current_streak} {getStreakEmoji(standing.current_streak)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="p-4 w-64" sideOffset={5}>
                                        <div className="text-sm">
                                            <h3 className="font-bold mb-2">{standing.name}</h3>
                                            <p>Puntos: {standing.points} 🏆</p>
                                            <p>Partidos jugados: {standing.matches_played}</p>
                                            <p>Victorias: {standing.wins} 🎉</p>
                                            <p>Derrotas: {standing.losses} 😢</p>
                                            <p>Efectividad: {(standing.effectiveness * 100).toFixed(2)}% ⚡</p>
                                            <p>
                                                Racha actual: {standing.current_streak} {getStreakEmoji(standing.current_streak)}
                                            </p>
                                            <p>Mejor racha: {standing.longest_streak} 🌟</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </TooltipProvider>
    )
}

