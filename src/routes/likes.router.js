import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos } from '../controllers/likes.controller.js';


const router = Router();
router.use(verifyJwt);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;