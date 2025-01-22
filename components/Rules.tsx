import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Rules() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Reglas Generales</CardTitle>
                    <CardDescription>Normas básicas del torneo</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Los partidos se juegan al mejor de 3 sets.</li>
                        <li>Cada set se gana al llegar a 21 puntos con una diferencia de 2 puntos.</li>
                        <li>No existen empates. Los partidos se juegan hasta que haya un ganador.</li>
                        <li>Los jugadores cambian de lado de la mesa después de cada set.</li>
                        <li>Se permite un tiempo de calentamiento de 2 minutos antes de cada partido.</li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Reglas Específicas</CardTitle>
                    <CardDescription>Normas particulares de nuestro torneo</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>El saque debe ser cruzado (diagonal) en todo momento.</li>
                        <li>El jugador que hace el saque continúa sacando hasta que pierda el punto.</li>
                        <li>Si la pelota toca el techo durante el juego, es punto para el adversario.</li>
                        <li>No se permite soplar la pelota durante el juego.</li>
                        <li>
                            No se permite tocar la pelota de forma intencionada con ninguna parte del cuerpo que no sea la raqueta.
                        </li>
                        <li>
                            En caso de contacto accidental con el dedo:
                            <ul className="list-disc pl-6 mt-2">
                                <li>El juez o el público decidirá si el punto es válido o no.</li>
                                <li>Si se determina que fue accidental, se repetirá el punto.</li>
                            </ul>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Sistema de Puntuación</CardTitle>
                    <CardDescription>Cómo se calculan los puntos en el torneo</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Victoria: 3 puntos</li>
                        <li>Derrota: 0 puntos</li>
                        <li>La clasificación se determina por el total de puntos acumulados.</li>
                        <li>En caso de empate en puntos, se considerará la diferencia de sets ganados y perdidos.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

