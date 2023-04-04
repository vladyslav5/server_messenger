const {Router} = require("express")
const router = Router({mergeParams:true})

const messageController = require("../controllers/MessageController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/",messageController.getAll)
router.get("/:_id",messageController.getOne)
router.get("/user/:id",authMiddleware,messageController.getByUser)
router.post("/",authMiddleware,messageController.add)
module.exports =  router