import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PendingMatch {
    player1: string
    player2: string
}

export default function PendingMatchesTable() {
    const [pendingMatches, setPendingMatches] = useState<PendingMatch[]>([])

    useEffect(() => {
        const fetchPendingMatches = async () => {
            const response = await fetch("/api/pending-matches")
            const data = await response.json()
            setPendingMatches(data)
        }

        fetchPendingMatches()
    }, [])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Jugador 1</TableHead>
                    <TableHead>Jugador 2</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pendingMatches.map((match, index) => (
                    <TableRow key={index}>
                        <TableCell>{match.player1} 🏓</TableCell>
                        <TableCell>{match.player2} 🏓</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

