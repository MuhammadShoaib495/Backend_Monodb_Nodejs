import { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle Subscription: Subscribe/Unsubscribe User to Channel
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { userId } = req.body;
    
    if (!isValidObjectId(channelId) || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid Channel or UserId");
    }

    // Check if subscription exists
    const existingSubscription = await Subscription.findOne({ userId, channelId });
    if (existingSubscription) {
        // If subscription exists, unsubscribe the user
        await Subscription.findOneAndDelete({ userId, channelId });
        return res.status(200).json(new ApiResponse(200, "Unsubscribed Successfully"));
    }
    
    // If no existing subscription, subscribe the user
    await Subscription.create({ userId, channelId });
    return res.status(200).json(new ApiResponse(200, "Subscribed Successfully"));
});

// Controller to return the subscriber list of a channel with count
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel Id");
    }

    // Fetch the users who are subscribed to this channel
    const subscribers = await Subscription.find({ channelId }).populate("userId", "name email");

    // Get the count of subscribers
    const subscriberCount = await Subscription.countDocuments({ channelId });

    return res.status(200).json(new ApiResponse(200, { subscribers, subscriberCount }, "Subscribers Fetched Successfully"));
});

// Controller to return the list of channels to which a user has subscribed with count
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid Subscriber Id");
    }

    // Fetch the channels the user is subscribed to
    const subscriptions = await Subscription.find({ userId: subscriberId }).populate("channelId", "name description");

    // Get the count of subscribed channels
    const subscribedChannelCount = await Subscription.countDocuments({ userId: subscriberId });

    return res.status(200).json(new ApiResponse(200, { subscriptions, subscribedChannelCount }, "Subscribed Channels Fetched Successfully"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};
