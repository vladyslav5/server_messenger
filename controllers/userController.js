const userModel = require("../models/UserModel")

const uuid = require("uuid")

const path = require("path")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {json} = require("express");
const getAccessToken = (_id, roles, login) => {
    const payload = {_id, roles, login}
    return jwt.sign(payload, "SECRET KEY", {expiresIn: 60 * 60})
}

class userController {
    async registration(req, res) {
        const {login, password} = req.body
        const candidate = await userModel.findOne({login: login})
        if (candidate) {
            return res.json("Пользователь с тиким ником уже существует")
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new userModel({login: login, password: hashedPassword, roles: ["USER"]})
        const savedUser = await newUser.save()
        const token = getAccessToken(savedUser._id, savedUser.roles, savedUser.login)
        req.accessToken = {token}
        res.json({token})

    }

    async login(req, res) {
        const {login, password} = req.body
        const user = await userModel.findOne({login})
        if (!user) {
            return res.json("Пользователь с таким ником не существует")
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            return res.json("пароль не верный")
        }
        const token = getAccessToken(user._id, user.roles, user.login)
        const {wss} = req
        res.json({token})

    }

    async setAvatar(req, res) {
        const {_id} = req.user
        const {avatar} = req.files
        const fileName = uuid.v4() + ".jpg"
        await avatar.mv(path.resolve(__dirname, "..", "static", fileName))
        await userModel.findByIdAndUpdate(_id, {avatar: fileName})
            .then((result) => res.json("Успешно изменено"))
    }

    async addContact(req, res) {
        const userId = req.body._id
        await userModel.findByIdAndUpdate(req.user._id, {$push: {contacts: userId}})
            .then(() => {
                res.json("Добавлено успешно")
            })
    }

    async getContact(req, res) {
        try {
            const user = await userModel.findById(req.user._id)
                .populate("contacts")
            res.json(user)
        } catch (e) {
            console.log(e)
        }

    }

    async getUserInfo(req, res) {
        const {_id} = req.params
        const user = await userModel.findById(_id)
        res.json(user)
    }

    async check(req, res) {
        const token = getAccessToken(req.user._id, req.user.roles, req.user.login)
        return res.json({token})
    }

    async getAll(req, res) {
        let {params} = req.query
        params = JSON.parse(params)
        const users = await userModel.find({...params})
        res.json(users)
    }

}

module.exports = new userController()