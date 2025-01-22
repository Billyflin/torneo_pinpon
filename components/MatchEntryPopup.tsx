import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

interface Player {
    id: number
    name: string
}

interface MatchEntryPopupProps {
    players: Player[]
    onMatchAdded: () => void
    disabled?: boolean
}

export default function MatchEntryPopup({ players, onMatchAdded, disabled }: MatchEntryPopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<"password" | "matchData">("password")
    const [password, setPassword] = useState("")
    const [matchData, setMatchData] = useState({
        player1: "",
        player2: "",
        set1Player1: "",
        set1Player2: "",
        set2Player1: "",
        set2Player2: "",
        set3Player1: "",
        set3Player2: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPasswordAlert, setShowPasswordAlert] = useState(false)
    const [newPlayerName, setNewPlayerName] = useState("")

    useEffect(() => {
        const storedPassword = localStorage.getItem("tournamentPassword")
        if (storedPassword) {
            setPassword(storedPassword)
            verifyPassword(storedPassword)
        } else {
            setShowPasswordAlert(true)
        }
    }, [])

    const verifyPassword = async (pwd: string) => {
        try {
            const response = await fetch("/api/verify-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: pwd }),
            })

            if (response.ok) {
                setStep("matchData")
                localStorage.setItem("tournamentPassword", pwd)
            } else {
                setStep("password")
                localStorage.removeItem("tournamentPassword")
                setShowPasswordAlert(true)
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Error al verificar la contraseña")
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await verifyPassword(password)
    }

    const handleMatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)

        // Validar que los sets sean correctos
        const sets = [
            [Number.parseInt(matchData.set1Player1), Number.parseInt(matchData.set1Player2)],
            [Number.parseInt(matchData.set2Player1), Number.parseInt(matchData.set2Player2)],
            [Number.parseInt(matchData.set3Player1), Number.parseInt(matchData.set3Player2)],
        ].filter((set) => !isNaN(set[0]) && !isNaN(set[1]))

        if (sets.length < 2) {
            alert("Debes ingresar al menos dos sets válidos")
            setIsSubmitting(false)
            return
        }

        if (sets.some((set) => set[0] < 21 && set[1] < 21)) {
            alert("Al menos un jugador debe llegar a 21 puntos en cada set")
            setIsSubmitting(false)
            return
        }

        if (sets.some((set) => Math.abs(set[0] - set[1]) < 2)) {
            alert("Debe haber una diferencia de al menos 2 puntos en cada set")
            setIsSubmitting(false)
            return
        }

        const winner =
            sets.filter((set) => set[0] > set[1]).length > sets.filter((set) => set[1] > set[0]).length
                ? matchData.player1
                : matchData.player2

        try {
            const response = await fetch("/api/tournament", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${password}`,
                },
                body: JSON.stringify({
                    player1: matchData.player1,
                    player2: matchData.player2,
                    set1: `${matchData.set1Player1}-${matchData.set1Player2}`,
                    set2: `${matchData.set2Player1}-${matchData.set2Player2}`,
                    set3: sets.length === 3 ? `${matchData.set3Player1}-${matchData.set3Player2}` : null,
                    winner,
                }),
            })

            if (response.ok) {
                alert("Partido registrado con éxito")
                setIsOpen(false)
                setMatchData({
                    player1: "",
                    player2: "",
                    set1Player1: "",
                    set1Player2: "",
                    set2Player1: "",
                    set2Player2: "",
                    set3Player1: "",
                    set3Player2: "",
                })
                onMatchAdded()
            } else {
                const errorData = await response.json()
                alert(`Error al registrar el partido: ${errorData.error}`)
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Error al registrar el partido")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClearPassword = () => {
        localStorage.removeItem("tournamentPassword")
        setPassword("")
        setStep("password")
        setShowPasswordAlert(true)
    }

    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/players", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${password}`,
                },
                body: JSON.stringify({ name: newPlayerName }),
            })

            if (response.ok) {
                alert("Jugador agregado con éxito")
                setNewPlayerName("")
                onMatchAdded() // Refresh the players list
            } else {
                const errorData = await response.json()
                alert(`Error al agregar el jugador: ${errorData.error}`)
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Error al agregar el jugador")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled}>Ingresar Partido</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ingresar Nuevo Partido o Jugador</DialogTitle>
                </DialogHeader>
                {showPasswordAlert && (
                    <Alert>
                        <AlertTitle>Contraseña no guardada</AlertTitle>
                        <AlertDescription>
                            No se ha guardado ninguna contraseña. Por favor, ingrese la contraseña para continuar.
                        </AlertDescription>
                    </Alert>
                )}
                {step === "password" ? (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            required
                        />
                        <Button type="submit">Verificar</Button>
                    </form>
                ) : (
                    <Tabs defaultValue="match" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="match">Agregar Partido</TabsTrigger>
                            <TabsTrigger value="player">Agregar Jugador</TabsTrigger>
                        </TabsList>
                        <TabsContent value="match">
                            <form onSubmit={handleMatchSubmit} className="space-y-4">
                                <Select onValueChange={(value) => setMatchData({ ...matchData, player1: value })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Jugador 1" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {players.map((player) => (
                                            <SelectItem key={player.id} value={player.name}>
                                                {player.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={(value) => setMatchData({ ...matchData, player2: value })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Jugador 2" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {players.map((player) => (
                                            <SelectItem key={player.id} value={player.name}>
                                                {player.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex space-x-2">
                                    <Input
                                        type="number"
                                        value={matchData.set1Player1}
                                        onChange={(e) => setMatchData({ ...matchData, set1Player1: e.target.value })}
                                        placeholder="Set 1 J1"
                                        required
                                    />
                                    <Input
                                        type="number"
                                        value={matchData.set1Player2}
                                        onChange={(e) => setMatchData({ ...matchData, set1Player2: e.target.value })}
                                        placeholder="Set 1 J2"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <Input
                                        type="number"
                                        value={matchData.set2Player1}
                                        onChange={(e) => setMatchData({ ...matchData, set2Player1: e.target.value })}
                                        placeholder="Set 2 J1"
                                        required
                                    />
                                    <Input
                                        type="number"
                                        value={matchData.set2Player2}
                                        onChange={(e) => setMatchData({ ...matchData, set2Player2: e.target.value })}
                                        placeholder="Set 2 J2"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <Input
                                        type="number"
                                        value={matchData.set3Player1}
                                        onChange={(e) => setMatchData({ ...matchData, set3Player1: e.target.value })}
                                        placeholder="Set 3 J1 (opcional)"
                                    />
                                    <Input
                                        type="number"
                                        value={matchData.set3Player2}
                                        onChange={(e) => setMatchData({ ...matchData, set3Player2: e.target.value })}
                                        placeholder="Set 3 J2 (opcional)"
                                    />
                                </div>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Guardando..." : "Guardar"}
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="player">
                            <form onSubmit={handleAddPlayer} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPlayerName">Nombre del nuevo jugador</Label>
                                    <Input
                                        id="newPlayerName"
                                        value={newPlayerName}
                                        onChange={(e) => setNewPlayerName(e.target.value)}
                                        placeholder="Nombre del jugador"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Agregando..." : "Agregar Jugador"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}
                {step === "matchData" && (
                    <Button variant="outline" onClick={handleClearPassword} className="mt-4">
                        <X className="mr-2 h-4 w-4" /> Borrar contraseña guardada
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    )
}

