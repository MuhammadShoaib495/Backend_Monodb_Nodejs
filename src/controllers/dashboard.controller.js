import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const {userId} = req.user?._id;
    // Total Videos: Count the number of videos uploaded by the user
    const totalVideos = await Video.countDocuments({owner:userId})
    // Total Video Views: Sum the views
   const totalViews = await Video.aggregate([
        {$match: {owner:userId}},
        {$group:{
            _id:null,
            totalViews:{$sum:"$views"}
        }}
    ]);
    const totalSubscribers = await Subscription.countDocuments({channel:userId});

    const totalLikes = await Like.countDocuments({video:{$in: await Video.find({owner:userId}).select('_id')}});
    return res
    .status(200)
    .json(new ApiResponse(200, {totalVideos, totalViews: totalViews[0]?.totalViews || 0, totalSubscribers, totalLikes}, "Get Channel Successfully Fetched"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const videos = await Video.find({owner:userId}).sort({createdAt:-1});
    if(!videos || videos.length === 0) {
        throw new ApiError(404,"No Videos Found for this channel")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {totalVideos: videos.length, videos}, "Channel Video Fecthc Successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }