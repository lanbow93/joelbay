require("dotenv").config();
const express = require("express");

const app = express();


app.get("/", (request, response) => {
    response.send("Server is functional");
})

PORT = 7777

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})