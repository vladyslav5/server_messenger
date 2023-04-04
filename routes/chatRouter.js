const Router = require("express")
const router = Router()

const chatController = require("../controllers/chatController")
const authMiddleware = require("../middleware/authMiddleware")
const messageRouter = require("./MessageRouter")

router.get("/",chatController.getAll)
router.get("/my",authMiddleware,chatController.getMy)
router.use('/:_id/message',messageRouter)
router.get("/:_id",chatController.getOne)
router.patch("/:_id/join",authMiddleware,chatController.join)
router.post("/",authMiddleware,chatController.add)
router.delete("/:_id",authMiddleware,chatController.leave)

module.exports =  router