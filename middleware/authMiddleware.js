const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
    if (req.methods === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(" ")[1]
        if(!token){
            return res.json("Пользователь не авторизован")
        }
        const decodedData = jwt.verify(token,"SECRET KEY")
        res.locals.user = decodedData
        req.user = decodedData
        next()
    } catch (e) {
        res.json("пользователь не авторизован "  + e.message)
    }
}