"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Card, CardContent } from "@/app/components/ui/card"
import { Label } from "@/app/components/ui/label"
import type { Player, Match } from "@/app/types/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Lock, Unlock } from "lucide-react"

export function MatchForm({ players, onSubmit }: { players: Player[]; onSubmit: (match: Match) => void }) {
  const [player1, setPlayer1] = useState("")
  const [player2, setPlayer2] = useState("")
  const [set1Player1, setSet1Player1] = useState("")
  const [set1Player2, setSet1Player2] = useState("")
  const [set2Player1, setSet2Player1] = useState("")
  const [set2Player2, setSet2Player2] = useState("")
  const [set3Player1, setSet3Player1] = useState("")
  const [set3Player2, setSet3Player2] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const player1Wins =
      (Number(set1Player1) > Number(set1Player2) ? 1 : 0) +
      (Number(set2Player1) > Number(set2Player2) ? 1 : 0) +
      (Number(set3Player1) > Number(set3Player2) ? 1 : 0)
    const player2Wins =
      (Number(set1Player2) > Number(set1Player1) ? 1 : 0) +
      (Number(set2Player2) > Number(set2Player1) ? 1 : 0) +
      (Number(set3Player2) > Number(set3Player1) ? 1 : 0)
    const winnerId = player1Wins > player2Wins ? player1 : player2
    onSubmit({
      player1Id: Number.parseInt(player1),
      player2Id: Number.parseInt(player2),
      winnerId: Number.parseInt(winnerId),
      set1Player1: Number(set1Player1),
      set1Player2: Number(set1Player2),
      set2Player1: Number(set2Player1),
      set2Player2: Number(set2Player2),
      set3Player1: Number(set3Player1),
      set3Player2: Number(set3Player2),
    } as Match)
  }

  const handleAuthentication = () => {
    console.log(process.env.DATA_ENTRY_PASSWORD)
    if (password === process.env.DATA_ENTRY_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert("Contraseña incorrecta")
    }
  }

  if (!isAuthenticated) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Lock className="mr-2" />
            Desbloquear Ingreso de Datos
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autenticación</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleAuthentication}>
              <Unlock className="mr-2" />
              Entrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="player1">Jugador 1</Label>
          <Select onValueChange={setPlayer1}>
            <SelectTrigger id="player1">
              <SelectValue placeholder="Seleccionar Jugador 1" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={String(player.id)}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="player2">Jugador 2</Label>
          <Select onValueChange={setPlayer2}>
            <SelectTrigger id="player2">
              <SelectValue placeholder="Seleccionar Jugador 2" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={String(player.id)}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="set1Player1">Set 1 - Jugador 1</Label>
              <Input
                id="set1Player1"
                type="number"
                value={set1Player1}
                onChange={(e) => setSet1Player1(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="set1Player2">Set 1 - Jugador 2</Label>
              <Input
                id="set1Player2"
                type="number"
                value={set1Player2}
                onChange={(e) => setSet1Player2(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="set2Player1">Set 2 - Jugador 1</Label>
              <Input
                id="set2Player1"
                type="number"
                value={set2Player1}
                onChange={(e) => setSet2Player1(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="set2Player2">Set 2 - Jugador 2</Label>
              <Input
                id="set2Player2"
                type="number"
                value={set2Player2}
                onChange={(e) => setSet2Player2(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="set3Player1">Set 3 - Jugador 1 (opcional)</Label>
              <Input
                id="set3Player1"
                type="number"
                value={set3Player1}
                onChange={(e) => setSet3Player1(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="set3Player2">Set 3 - Jugador 2 (opcional)</Label>
              <Input
                id="set3Player2"
                type="number"
                value={set3Player2}
                onChange={(e) => setSet3Player2(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Button type="submit" className="w-full">
        Registrar Partido 🎉
      </Button>
    </form>
  )
}

