const {Schema, model} = require("mongoose")

module.exports = model("Message", new Schema({
    text: String,
    createdAt: String,
    files:[String],
    audio:String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}))
