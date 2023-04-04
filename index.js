const express = require("express")
const {json} = require("express")
const fileupload = require("express-fileupload")
const {static} = express
const app = express()
require('dotenv').config();
const cors = require("cors")
const router = require("./routes/index")
const mongoose = require("mongoose")
const DB_URL = "mongodb+srv://vladmorshch:DwMnmvtAftoUDeXi@cluster0.vsfpg.mongodb.net/?retryWrites=true&w=majority"
const expressWs = require("express-ws")(app)
const path = require("path");
const jwt = require("jsonwebtoken");
app.use(json())
const wss = expressWs.getWss()
const chatModel = require("./models/ChatModel")
const clients = new Map()
app.ws("/:token", (ws, req) => {
    const {token} = req.params
    const decodedData = jwt.verify(token, "SECRET KEY")
    ws._id = decodedData._id
    clients.set(decodedData._id, ws)
    console.log(wss.clients.size)
    ws.send('Hi there, I am a WebSocket server');
    ws.on('message', async (m) => {
        const message = JSON.parse(m)
        const {users} = await chatModel.findById(message.chatId)
        users.forEach(user => {
            const client = clients.get(user._id.toString())
            // console.log(user._id,ws._id)
            if (client !== ws) {
                client?.send(JSON.stringify(message));
            }
        })
        console.log('received: %s', message.message, message.chatId);
    })
})

app.use((req, res, next) => {
    req.wss = wss
    return next()
})
app.use(cors())

app.use(static(path.join(__dirname, "static")))
app.use(fileupload())

app.get("/", (req, res) => {
    res.json("working")
})
app.use('/api', router)
const Port = process.env.PORT
const start = () => {
    mongoose.connect(DB_URL)
        .then(() => {
            console.log("mongo connected")
        })
        .catch(e => {
            console.log("mongo err ", e.message)
        })
    app.listen(Port, () => {
        console.log("start server on port " + Port)
    })

}

start()