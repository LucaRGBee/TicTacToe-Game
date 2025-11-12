import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api"
import Button from "../Components/Button"
import Test from "../Components/Test"

export interface GameData {
  turn: number;
  playerOne: number;
  playerTwo: number;
  ended: boolean;
  winner: 1 | -1 | null
}

export default function Game(){
    const [data, setData] = useState<GameData | null>(null)
    const [id, setId] = useState<number | null>(null)
    const [playerNumber, setPlayerNumber] = useState<0 | 1| 2>(0)
    const [turn, setTurn] = useState<number>(1)

    const { gameid } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const res = await api.get(`/game/${gameid}/`)
            setData(res.data)
            console.log("a")
        }

        fetchData()

        const interval = setInterval(fetchData, 1000)

        return () => clearInterval(interval)
    }, [])


    useEffect(() => {
        const getPlayerID = async () => {
            const res = await api.get(`/user/${localStorage.getItem("username")}`)
            setId(res.data.id)
        }

        getPlayerID()
    }, [])

    useEffect(() => {
        if (id === null || data === null || playerNumber !== 0){
            return
        }
        
        if (data.playerOne === id) {
            setPlayerNumber(1)
        } else {
            setPlayerNumber(2)
        }
        
    }, [id, data])

    useEffect(() => {
    if (data?.turn === undefined) return; // wait until data exists
        setTurn(2 - (data.turn % 2));

    }, [data]);

    return(
        <>
        <div id="div">
            <h1>TicTacToe</h1>
            <h2>You are Player {playerNumber}</h2>
            <Test data={data} turn={turn}/>           
            <Button id={Number(gameid)} x={0} y={0} data={data}></Button>
            <Button id={Number(gameid)} x={1} y={0} data={data}></Button>
            <Button id={Number(gameid)} x={2} y={0} data={data}></Button>
            <br />
            <Button id={Number(gameid)} x={0} y={1} data={data}></Button>
            <Button id={Number(gameid)} x={1} y={1} data={data}></Button>
            <Button id={Number(gameid)} x={2} y={1} data={data}></Button>
            <br />
            <Button id={Number(gameid)} x={0} y={2} data={data}></Button>
            <Button id={Number(gameid)} x={1} y={2} data={data}></Button>
            <Button id={Number(gameid)} x={2} y={2} data={data}></Button>
        </div>
        </>
    )
}