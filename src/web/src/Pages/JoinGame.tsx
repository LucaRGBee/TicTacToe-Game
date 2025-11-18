import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"

export default function JoinGame(){

    const [id, setId] = useState(0)
    const [password, setPassword] = useState("")

    const nav = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try{
            const res = await api.post("/game/join/", {id, password})
            nav(`/game/${res.data.id}`)        
        } catch (error){
            alert(error)
        }
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <h1>Join A Game</h1>
            <input type="number" onChange={(e) => {setId(Number(e.target.value))}}/>
            <input type="password" onChange={(e) => {setPassword(e.target.value)}}/>
            <button>Join Game</button>
        </form>
    )
}