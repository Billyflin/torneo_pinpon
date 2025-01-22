import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

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
    const getPositionBadge = (position: number) => {
        switch (position) {
            case 1:
                return <span className="text-2xl">🥇</span>
            case 2:
                return <span className="text-2xl">🥈</span>
            case 3:
                return <span className="text-2xl">🥉</span>
            default:
                return <span>{position}º</span>
        }
    }

    const getStreakEmoji = (streak: number) => {
        if (streak >= 5) return "🔥🔥🔥"
        if (streak >= 3) return "🔥🔥"
        if (streak >= 1) return "🔥"
        return "❄️"
    }

    const getRowStyle = (index: number) => {
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
    }

    return (
        <div className="relative overflow-hidden rounded-md border">
            <ScrollArea className="h-[calc(100vh-300px)]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-14 text-center">Pos</TableHead>
                            <TableHead>Jugador</TableHead>
                            <TableHead className="text-center">Pts</TableHead>
                            <TableHead className="text-center">PJ</TableHead>
                            <TableHead className="text-center">PG</TableHead>
                            <TableHead className="text-center">PP</TableHead>
                            <TableHead className="text-center">Efec</TableHead>
                            <TableHead className="text-center">Racha</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {standings.map((standing, index) => (
                            <TableRow key={standing.name} className={cn(getRowStyle(index))}>
                                <TableCell className="text-center font-medium">{getPositionBadge(index + 1)}</TableCell>
                                <TableCell className="font-medium">{standing.name}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="secondary" className="font-bold">
                                        {standing.points}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">{standing.matches_played}</TableCell>
                                <TableCell className="text-center">{standing.wins}</TableCell>
                                <TableCell className="text-center">{standing.losses}</TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            standing.effectiveness >= 0.7
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : standing.effectiveness >= 0.5
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                                        )}
                                    >
                                        {(standing.effectiveness * 100).toFixed(0)}%
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
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
                                            "text-white",
                                        )}
                                    >
                                        {standing.current_streak} {getStreakEmoji(standing.current_streak)}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    )
}

