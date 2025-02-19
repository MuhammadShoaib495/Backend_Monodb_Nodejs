import mongoose from "mongoose";
import {Like} from "../models/likes.models.js"
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {userId} = req.user?._id;
    // Check the User Already Liked this video
   const existingLike = await Like.findOne({video:videoId, likedBy:userId})
   if(existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
   } else {
    const newVideoLike = await Like.create({
        video:videoId,
        likedBy:userId,
    })
    return res
    .status(200)
    .json(new ApiResponse(200, newVideoLike, "Video Liked Successfully"))
   }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {userId} = req.user?._id;

    const existingCommentLike = await Like.findOne({comment:commentId, likedBy:userId});
    if(existingCommentLike) {
        await Like.findByIdAndDelete(existingCommentLike._id)
    } else {
        const newCommentLike = await Like.create({
            comment:commentId,
            likedBy:userId,
        });
    }
    return res
    .status(200)
    .json(new ApiResponse(200, newCommentLike, "Comment Liked Successfuly"));
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {userId} = req.user?._id;
    if(!userId) {
        throw new ApiError(400, "User not Found")
    }
   const existingTweetLiked = await Like.findOne({tweet:tweetId, likedBy:userId});
   if(existingTweetLiked) {
    await Like.findByIdAndDelete(existingTweetLiked._id);
   } else {
    const newTweetLiked = await Like.create({
        tweet:tweetId,
        likedBy:userId,
    })
   }
   return res
   .status(200)
   .json(new ApiResponse(200, newTweetLiked, "Tweet Liked Successfully" ))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id;
    const likedVideos = await Like.find({likedBy:userId, video:{$ne:null}}).populate('video').select('video');
    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Like video Successfully Fetchedd"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}