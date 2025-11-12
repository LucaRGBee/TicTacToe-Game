import api from "../api"

type ButtonProps = {
    id: number;
    x: number;
    y: number;
    data: any
}

export default function Button({id, x, y, data}: ButtonProps){
    const handleClick = async () => {
        console.log(x, y)
        try{
            await api.post("/game/make-turn/", {id, x, y})
        } catch (error) {
            alert(error)
        }
    }
    
    return(
        <button onClick={handleClick} className="gamebutton" id={`p${data?.board?.[y]?.[x] ?? "0"}`}></button>
    )
}