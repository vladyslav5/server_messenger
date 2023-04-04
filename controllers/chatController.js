const chatModel = require("../models/ChatModel")
const messageModel = require("../models/MessageModel")
const path = require("path")
const uuid = require("uuid")

class chatController {
    async getAll(req, res) {
        let {params} = req.query
        params =  JSON.parse(params)
        const chats = await chatModel.find({...params})
            .populate([
                {
                    path: "messages", populate: {
                        path: "user", select: ["avatar", "login", "_id"]
                    }
                },
                {path: "users", select: ["avatar", "login", "_id"]}
            ])
        res.json(chats)
    }

    async join(req, res) {
        const {wss}  = req
        const chatId = req.params._id
        const userId = req.user._id
        const newMessage = new messageModel({
            text: req.user.login + " вступил в чат",
            createdAt: new Date().toDateString()
        })
        const savedMessage = await newMessage.save()
        wss.clients
            .forEach(client=>client.send(JSON.stringify(savedMessage)))
        const chat = await chatModel.findByIdAndUpdate(chatId, {$push: {users: userId, messages: savedMessage._id}})
            .populate([
                {
                    path: "messages", populate: {
                        path: "user", select: ["avatar", "login", "_id"]
                    }
                },
                {path: "users", select: ["avatar", "login", "_id"]}
            ])
        res.json(chat)
    }
    async leave(req, res) {
        const {wss} = req
        const chatId = req.params._id
        const userId = req.user._id
        const newMessage = new messageModel({
            text: req.user.login + " Покинул чат",
            createdAt: new Date().toDateString()
        })
        const savedMessage = await newMessage.save()
        wss.clients
            .forEach(client=>client.send(JSON.stringify(savedMessage)))
        await chatModel.findByIdAndUpdate(chatId, {$push: {messages: savedMessage._id},$pullAll:{users:[userId]}})
            .populate([
                {
                    path: "messages", populate: {
                        path: "user", select: ["avatar", "login", "_id"]
                    }
                },
                {path: "users", select: ["avatar", "login", "_id"]}
            ])
        res.json("вы покинули чат")
    }

    async getMy(req, res) {
        const {_id} = req.user
        const chats = await chatModel.find({users: _id})
            .populate([
                {
                    path: "messages", populate: {
                        path: "user", select: ["avatar", "login", "_id"]
                    }
                },
                {path: "users", select: ["avatar", "login", "_id"]}
            ])
        res.json(chats)
    }

    async getOne(req, res) {
        try {
            const {_id} = req.params
            const chats = await chatModel.findById(_id)
                .populate('messages')
            res.json(chats)
        } catch (e) {
            res.json(e.message)
        }

    }

    async add(req, res) {
        try{
            const userId = req.user._id
            const {name} = req.body
            const {avatar} = req.files
            const fileName = uuid.v4() + ".jpg"
            await avatar.mv(path.resolve(__dirname, "..", "static", fileName))
            const newMessage = new messageModel({
                text: req.user.login + " Создал группу",
                createdAt: new Date().toDateString()
            })
            const savedMessage = await newMessage.save()
            const newChat = new chatModel({
                name: name,
                users: [userId],
                messages: [savedMessage._id],
                avatar: fileName,
                createdAt: new Date().toDateString()
            })
            const savedChat = await newChat.save()
            res.json(savedChat)
        } catch (e) {
            console.log(e)
            res.json("err" + e.message)
        }

    }
}

module.exports = new chatController()