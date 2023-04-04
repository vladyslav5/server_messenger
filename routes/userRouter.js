const Router = require("express")
const router = Router()

const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/login", userController.login)
router.patch("/edite", authMiddleware, userController.setAvatar)
router.post("/registration", userController.registration)
router.get("/all", authMiddleware, userController.getAll)
router.get("/check/", authMiddleware, userController.check)
router.get("/contact", authMiddleware, userController.getContact)
router.patch("/contact", authMiddleware, userController.addContact)
router.get("/:_id", userController.getUserInfo)


module.exports = router