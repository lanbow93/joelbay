require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const InstrumentRouter = require("./controllers/Instrument");
const AdminRouter = require("./controllers/Admin");

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use("/admin", AdminRouter);
app.use("/instruments", InstrumentRouter);

app.get("/", (request, response) => {
    response.send("Server is functional");
})

PORT = 7777
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})