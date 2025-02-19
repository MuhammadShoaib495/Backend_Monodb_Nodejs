import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
} from '../controllers/video.controller.js';

import {verfiyJwt} from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verfiyJwt);
router
.route("/")
.get(getAllVideos)
.post(upload.fields([
    {
        name:"videoFile",
        maxCount:1,
    },
    {
        name:"thumbnail",
        maxCount:1,
    },
]),
    publishAVideo
);

router
.route("/video:Id")
.get(getVideoById)
.delete(deleteVideo)
.patch(upload.single("thumbnail"),updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router