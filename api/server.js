const express = require("express");
const app = express()
const PORT = 8080

app.use(express.json())

app.post("/cpu-move", (req, res) => {
    const { board } = req.body;

    if(!board){
        res.status(418).send({message: "no board provided"})
    }
    
    res.status(200).send(
        {
            board: "test"
        }
    )
})

app.listen(PORT, () => {
    console.log(`Server is Running on http://localhost:${PORT}`)
});