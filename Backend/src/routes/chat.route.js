import {Router} from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import {fetchAllChats,createOneToOneChat,createGroupChat,renameGroup,addUserToGroup,removeUserFromGroup} from "../controllers/chat.controller.js"
const router=Router();

router.route("/").get(verifyJWT,fetchAllChats);
router.route("/one-to-one").post(verifyJWT,createOneToOneChat)
router.route("/group").post(verifyJWT,createGroupChat);
router.route("/group/rename").put(verifyJWT,renameGroup);
router.route("/group/adduser").put(verifyJWT,addUserToGroup)
router.route("/group/removeuser").put(verifyJWT,removeUserFromGroup);


export default router;