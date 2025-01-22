import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Rules() {
    const [language, setLanguage] = useState<"es" | "ru">("es")

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "es" ? "ru" : "es"))
    }

    return (
        <div className="space-y-6">
            <div className="mb-4 flex justify-end">
                <Button onClick={toggleLanguage}>{language === "es" ? "Ver en Ruso" : "Смотреть на испанском"}</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{language === "es" ? "Reglas Generales" : "Общие правила"}</CardTitle>
                    <CardDescription>
                        {language === "es" ? "Normas básicas del torneo" : "Основные правила турнира"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                        {language === "es" ? (
                            <>
                                <li>Los partidos se juegan al mejor de 3 sets.</li>
                                <li>Cada set se gana al llegar a 21 puntos con una diferencia de 2 puntos.</li>
                                <li>No existen empates. Los partidos se juegan hasta que haya un ganador.</li>
                                <li>Los jugadores cambian de lado de la mesa después de cada set.</li>
                                <li>Se permite un tiempo de calentamiento de 2 minutos antes de cada partido.</li>
                            </>
                        ) : (
                            <>
                                <li>Матчи играются до двух побед в сетах.</li>
                                <li>Каждый сет выигрывается при достижении 21 очка с разницей в 2 очка.</li>
                                <li>Ничьих не бывает. Матчи играются до определения победителя.</li>
                                <li>Игроки меняются сторонами стола после каждого сета.</li>
                                <li>Перед каждым матчем разрешается 2-минутная разминка.</li>
                            </>
                        )}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{language === "es" ? "Reglas Específicas" : "Особые правила"}</CardTitle>
                    <CardDescription>
                        {language === "es" ? "Normas particulares de nuestro torneo" : "Специфические правила нашего турнира"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                        {language === "es" ? (
                            <>
                                <li>
                                    El saque debe ser <strong>cruzado</strong> (diagonal) en todo momento.
                                </li>
                                <li>
                                    El saque debe ser visible <strong>SIN TRUCOS</strong>
                                </li>
                                <li>El jugador que hace el saque continúa sacando hasta que pierda el punto.</li>
                                <li>
                                    No se permite <strong>tocar la pelota</strong> de forma intencionada con ninguna parte del cuerpo que
                                    no sea la raqueta.
                                </li>
                                <li>
                                    No se permite <strong>tocar la mesa</strong> con la mano durante el juego. Pero si con la cadera
                                </li>
                                <li>
                                    Si la pelota <strong>toca el techo</strong> durante el juego, es punto para el adversario.
                                </li>
                                <li>
                                    En caso de doble falta en el saque (dos intentos fallidos), el punto es para el adversario.
                                    <ul className="list-disc pl-6 mt-2">
                                        <li>Si la pelota toca la red y cae en el lado contrario, se repite el saque.</li>
                                        <li>Si la pelota toca la red y cae en el mismo lado, el punto es para el adversario.</li>
                                        <li>Si la pelota toca la mesa y cae en el lado contrario, el punto es para el adversario.</li>
                                        <li>Si la pelota toca la mesa y cae en el mismo lado, se repite el punto.</li>
                                    </ul>
                                </li>
                                <li>
                                    En caso de contacto accidental con el dedo:
                                    <ul className="list-disc pl-6 mt-2">
                                        <li>El juez o el público decidirá si el punto es válido o no.</li>
                                        <li>Si el punto es válido, se reanuda el juego.</li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    Подача должна быть <strong>по диагонали</strong> всегда.
                                </li>
                                <li>
                                    Подача должна быть видимой <strong>БЕЗ ТРЮКОВ</strong>
                                </li>
                                <li>Игрок, выполняющий подачу, продолжает подавать, пока не проиграет очко.</li>
                                <li>
                                    <strong>Нельзя касаться мяча</strong> намеренно какой-либо частью тела, кроме ракетки.
                                </li>
                                <li>
                                    <strong>Нельзя касаться стола</strong> рукой во время игры. Но можно бедром
                                </li>
                                <li>
                                    Если мяч <strong>касается потолка</strong> во время игры, очко присуждается сопернику.
                                </li>
                                <li>
                                    В случае двойной ошибки при подаче (два неудачных попытки), очко присуждается сопернику.
                                    <ul className="list-disc pl-6 mt-2">
                                        <li>Если мяч касается сетки и падает на сторону соперника, подача повторяется.</li>
                                        <li>Если мяч касается сетки и падает на ту же сторону, очко присуждается сопернику.</li>
                                        <li>Если мяч касается стола и падает на сторону соперника, очко присуждается сопернику.</li>
                                        <li>Если мяч касается стола и падает на ту же сторону, очко переигрывается.</li>
                                    </ul>
                                </li>
                                <li>
                                    В случае случайного контакта с пальцем:
                                    <ul className="list-disc pl-6 mt-2">
                                        <li>Судья или зрители решат, засчитывать ли очко.</li>
                                        <li>Если очко засчитано, игра продолжается.</li>
                                    </ul>
                                </li>
                            </>
                        )}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{language === "es" ? "Sistema de Puntuación" : "Система подсчета очков"}</CardTitle>
                    <CardDescription>
                        {language === "es" ? "Cómo se calculan los puntos en el torneo" : "Как подсчитываются очки в турнире"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                        {language === "es" ? (
                            <>
                                <li>Victoria: 3 puntos</li>
                                <li>Derrota: 0 puntos</li>
                                <li>La clasificación se determina por el total de puntos acumulados.</li>
                                <li>No existe limite de tiempo en los partidos</li>
                                <li>
                                    <strong>No existe el empate</strong>, el partido continuará hasta que haya un ganador.
                                </li>
                            </>
                        ) : (
                            <>
                                <li>Победа: 3 очка</li>
                                <li>Поражение: 0 очков</li>
                                <li>Рейтинг определяется по общему количеству набранных очков.</li>
                                <li>В матчах нет ограничения по времени</li>
                                <li>
                                    <strong>Ничьих не бывает</strong>, матч продолжается до определения победителя.
                                </li>
                            </>
                        )}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

