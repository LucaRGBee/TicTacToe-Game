import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"

export default function CreateGame(){
    const [password, setPassword] = useState("")
    const nav = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try{
            const res = await api.post("game/create/", {password})
            nav(`/game/${res.data.id}`)
        } catch (error) {
            alert(error)
        }
    }
    
    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Create a Game (you can add an optional Password)</h1>
                <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                <button>Create Game</button>
            </form>
        </>
    )
}