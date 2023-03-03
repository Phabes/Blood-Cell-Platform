const express = require("express")
const PORT = 4000
const app = express()


app.listen(PORT, (error) => {
    if (!error)
        console.log("Lisiten on the port " + PORT.toString())
    else
        console.log("Error")
})

