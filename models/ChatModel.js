const {Schema, model} = require("mongoose")

const chatSchema = new Schema({
    name: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }],
    avatar: String,
    createdAt: {type: Date, default: Date.now()}
})
module.exports = model("Chat", chatSchema)
