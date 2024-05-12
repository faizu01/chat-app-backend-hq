import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getAllMessages,sendMessage } from "../controllers/message.controller.js";
const router = Router();

router.route("/:chatId").get(verifyJWT, getAllMessages);
router.route("/send-message").post(verifyJWT,sendMessage)

export default router;
