import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

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
                        <li>El saque debe ser <strong>cruzado</strong> (diagonal) en todo momento.</li>
                        <li>El saque debe ser visible <strong>SIN TRUCOS</strong></li>
                        <li>El jugador que hace el saque continúa sacando hasta que pierda el punto.</li>
                        <li> No se permite <strong>tocar la pelota</strong> de forma intencionada con ninguna parte del
                            cuerpo que no sea
                            la raqueta.
                        </li>
                        <li>Si la pelota <strong>toca el techo</strong> durante el juego, es punto para el adversario.
                        </li>
                        <li>En caso de doble falta en el saque (dos intentos fallidos), el punto es para el adversario.
                            <ul className="list-disc pl-6 mt-2">
                                <li>Si la pelota toca la red y cae en el lado contrario, se repite el saque.</li>
                                <li>Si la pelota toca la red y cae en el mismo lado, el punto es para el adversario.
                                </li>
                                <li>Si la pelota toca la mesa y cae en el lado contrario, el punto es para el
                                    adversario.
                                </li>
                                <li>Si la pelota toca la mesa y cae en el mismo lado, se repite el punto.</li>
                                <li>No se permite tocar la mesa con la mano durante el juego. Pero si con la cadera</li>
                            </ul>
                        </li>
                        <li>
                            En caso de contacto accidental con el dedo:
                            <ul className="list-disc pl-6 mt-2">
                                <li>El juez o el público decidirá si el punto es válido o no.</li>
                                <li>Si el punto es válido, se reanuda el juego.</li>
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
                        <li>No existe limite de tiempo en los partidos</li>
                        <li><strong>No existe el empate</strong>, el partido continuará hasta que haya un ganador.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

