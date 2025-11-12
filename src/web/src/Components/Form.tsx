import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Form({name, route}: {name: string, route: string}) {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try{
            const res = await api.post(route, {username, password})
            if (name === "Login") {
                localStorage.setItem("access_token", res.data.access)
                localStorage.setItem("refresh_token", res.data.refresh)
                localStorage.setItem("username", username)
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>{name}</h1>
            <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">{name}</button>
        </form>
    )
}