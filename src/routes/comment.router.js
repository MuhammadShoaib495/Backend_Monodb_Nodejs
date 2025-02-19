import {Router} from "express";
import {getVideoComments, addComment, updateComment, deleteComment} from '../controllers/comments.controller.js'
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();
router.use(verifyJwt);
router
.route("/:videoId").get(getVideoComments).post(addComment);

router
.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router