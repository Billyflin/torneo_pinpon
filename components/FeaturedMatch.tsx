import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FeaturedMatchProps {
  player1: string
  player2: string
}

export function FeaturedMatch({ player1, player2 }: FeaturedMatchProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Partido Destacado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {player1}
          </Badge>
          <span className="text-2xl font-bold">VS</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {player2}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

