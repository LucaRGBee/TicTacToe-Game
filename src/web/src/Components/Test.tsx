import type { GameData } from "../Pages/Game"

interface TestProps{
    data: GameData | null,
    turn: number
}

export default function Test({ data, turn }: TestProps ) {
    console.log(data)
    if (data) {
        if (data.ended === false) {
            return (
                <h2>
                    Player {turn}´s Turn
                </h2>
            )
        } else {
            const x = (3 - data.winner!) / 2
            if (x === 1.5){
                return (
                    <h2>
                        It's a Draw
                    </h2>
                )
            }
            return (
                <h2>
                    Player {x} won
                </h2>
            )
        }
    } else {
        return (
            <h2>Loading...</h2>
        )
    }
}