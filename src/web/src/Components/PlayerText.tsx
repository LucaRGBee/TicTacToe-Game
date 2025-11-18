interface playerTextProps{
    playerNumber: 0 | 1| 2
}

export default function PlayerText({playerNumber}: playerTextProps){
    if (playerNumber > 0){
        return (
            <h2>
                You are Player {playerNumber}
            </h2>
        )
    } else {
        return <h2>You are a Spectator</h2>
    }
}