const Router = require("express")
const router = Router()

const chatRouter = require("./chatRouter")
const userRouter = require("./userRouter")

router.use('/chat',chatRouter)
router.use("/user",userRouter)

module.exports =  router