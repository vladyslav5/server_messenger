const {Schema, model} = require("mongoose")

module.exports = model("User", new Schema({
    login: String,
    password: String,
    avatar: String,
    contacts:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    roles: [{
        type: String,
        ref: "Role"
    }]


}))
