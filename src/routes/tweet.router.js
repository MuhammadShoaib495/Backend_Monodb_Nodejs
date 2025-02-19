import {getUserTweets, createTweet, updateTweet, deleteTweet} from '../controllers/tweet.controllers.js'
import {verifyJwt} from '../middlewares/auth.middleware.js'
import { Router } from 'express';

const router = Router();

router.use(verifyJwt)
router.route("/").post(createTweet)
router.route("/user/:userId").get(getUserTweets)
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet)

export default router