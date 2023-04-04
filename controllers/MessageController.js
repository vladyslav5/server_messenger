const messageModel = require("../models/MessageModel")
const chatModel = require("../models/ChatModel")
const path = require("path")
const uuid = require("uuid")

class chatController {
    async getAll(req, res) {
        const {_id} = req.params
        res.json("message of " + _id)
    }

    async getByUser(req, res) {

    }

    async getOne(req, res) {

    }

    async add(req, res) {
        const files = req.files
        const fileNames = []
        let audio;
        files &&  Object.keys(files).map(async (key) => {
            const fileName = uuid.v4() + "." + files[key].name.split(".")[1]
            if(key==="audio"){
                audio=fileName
            }else{
                fileNames.push(fileName)
            }
            await files[key].mv(path.resolve(__dirname, "..", "static", fileName))

        })
        // console.log(fileNames)
        const {_id} = req.params
        const {text} = req.body
        const newMessage = new messageModel({
            text: text,
            user: req.user._id,
            createdAt: new Date().toDateString(),
            files: fileNames,
            audio:audio
        })
        const savedMessage = await newMessage.save()
        await savedMessage.populate({path: "user", select: ["login", "_id", "avatar"]})
        await chatModel.findByIdAndUpdate(_id, {$push: {messages: savedMessage._id}})
        res.json(savedMessage)

    }

}

module.exports = new chatController()