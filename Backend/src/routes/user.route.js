import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { registerUser, loginUser , logoutUser , updateStatus} from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/update-status").post(verifyJWT,updateStatus);

export default router;
