import mongoose, { isValidObjectId } from "mongoose";
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


//get videos All from descending Query, UserId and filter then choosing $or fro selecting regex method (query)
const getAllVideos = asyncHandler(async(req, res) => {
    const { page =1, limit=10, query, sortBy, sortType, userId } = req.query;
   const filter = {};
   if(query) {
    filter.$or = [
        {title:{$regex:query,$options:"i"}},
        {description:{$regrex:query,$options:"i"}}
    ]
   }
   if(userId) {
    filter.owner = userId;
   }
   const videos = await Video.find(filter).sort({[sortBy]: sortType === "desc" ? -1 : 1}).skip((page - 1) * limit).limit(Number(limit));
   res.json(new ApiResponse(200,videos, "Videos retrived successfully "))
})

// upload video
const publishAVideo = asyncHandler(async(req,res) => {
    const { title, description } = req.body;
    if(!req.file) {
        throw new ApiError(400, "Video file is required")
    }
    const uploadVideo = await uploadOnCloudinary(req.file.path)
    if(!uploadVideo) {
        throw new ApiError(500,"Server Failed to uploaded file")
    }
    const video = await Video.insertOne({
        title,
        description,
        videoFile: uploadVideo.secure_url,
        thumbnail: uploadVideo.secure_url,
        duration:0,
        owner: req.user?._id,
    });
    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Successfully Uploaded"))
    // 
})

// Video By Id
const getVideoById = asyncHandler(async(req,res) => {
    const {videoId} = req.params;
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }
   const video = await Video.findById(videoId)
   if(!video) {
    throw new ApiError(404, "Video not Found")
   }
   return res
   .status(200)
   .json(new ApiResponse(200, video ,"video Loaded Successfully"))
})

// Update Video exist directory
const updateVideo = asyncHandler(async(req,res) => {
    const { videoId } = req.params;
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is not found")
    }
    if(!req.body || Object.keys(req.body).length ==0){
        throw new ApiError(400, "no Fields provided for updated")
    }
    // Allowed fields for update
    const allowedUpdates = ["title", "description", "thumbnail"];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((keys) => allowedUpdates.includes(keys));
    if(!isValidUpdate) {
        throw new ApiError(400, "Invalid updated fields")
    }

    const updatedvideo = await Video.findByIdAndUpdate(videoId, req.body, {new:true, runValidators:true});
        if(!updatedvideo) {
            throw new ApiError(404, "Video not Found");
        }
        return res
        .status(200)
        .json(new ApiResponse(200, updatedvideo , "Video Updated Successfully"))
})

const deleteVideo = asyncHandler(async(req,res) => {
    const { videoId } = req.params;
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video ID is not found")
    }
    const deleteVideo = await Video.findByIdAndDelete(videoId);
    if(!deleteVideo) {
        throw new ApiError(404, "Video not Found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, null ,"Video Deleted Successfully"))
})

const togglePublishStatus = asyncHandler(async(req,res) => {
    const {videoId} = req.params;
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }
   const video = await Video.findById(videoId);
   if(!video) {
    throw new ApiError(404, "video Not Found")
   }
   video.isPublished = !video.isPublished;
   await video.save();
   return res
   .status(200)
   .json(new ApiResponse(200, video, "Video published Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
}