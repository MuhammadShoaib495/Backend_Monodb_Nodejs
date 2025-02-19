import { Router } from "express";
import {verfiyJwt } from '../middlewares/auth.middleware.js'
import { toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels } from '../controllers/subscriptions.controllers.js';

const router = Router();

router.use(verfiyJwt);

router
.route('/c/:userId')
.get(getSubscribedChannels)
.post(toggleSubscription)

router
.route("/u/:subscriberId")
.get(getSubscribedChannels)

export default router