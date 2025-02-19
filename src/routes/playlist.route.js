import { Router } from "express"
import { createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist} from "../controllers/playlist.controllers.js"

import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJwt);

router
.route("/").post(createPlaylist)

router
.route("/:playlistId").get(getPlaylistById).patch(updatePlaylist).delete(deletePlaylist);

router
.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)
router
.route("/user/:userId").get(getPlaylistById);

export default router;