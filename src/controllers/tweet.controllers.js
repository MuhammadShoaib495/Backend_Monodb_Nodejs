import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getUserTweets = asyncHandler(async(req,res) =>{
    const {userId} = req.params;
    const {page =1 , limit =10} = req.query;
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "User id Not found")
    }
    const tweet = await Tweet.aggregate(
        {$match:{ owner: userId}},
        {$sort:{ createdAt:-1}},
        {$skip:(parseInt(page) -1) * parseInt(limit)},
        {$limit: parseInt(limit)},
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"users"
            }
        },
        {$unwind : "$users"},
        {$project:{
            _id:0,
            content:1,
            createdAt:1,
            "user.name":1,
            "user.avatar":1
        }}
    );

    const totaltweets = await Tweet.countDocuments({owner:userId})
    const totalPages = Math.ceil(totaltweets/ limit);
    return res
    .status(200)
    .json(new ApiResponse(200, {tweet, totalPages}, "Tweets Retrived Succssfully"));
});



//Created Tweet is Successfully

const createTweet = asyncHandler(async(req,res) => {
    const {userId} = req.params;
    const {content} = req.body;
   
   try {
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User Id")
    }
    if(!content || content.trim() === "") {
        throw new ApiError(400, "Please Fill Content")
    }
    const createdtweet = await Tweet.create({
        content,
        owner: userId
    });

    return res
    .status(200)
    .json(new ApiResponse(200, createdtweet, "Tweet is successfully created"))
    
   } catch (error) {
     throw new ApiError(500, error)
   }
    
})

// Tweet Is Successfully Updated

const updateTweet = asyncHandler(async(req,res) => {
    const {Tweetid} = req.params;
    const {content} = req.body;

    if(!mongoose.Types.ObjectId.isValid(Tweetid)) {
        throw new ApiError(400, "Invalid user id")
    }
    if(!content || content.trim() === "") {
        throw new ApiError(404, "Please fill the Tweet message")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(Tweetid, {content});
    if(!updateTweet) {
        throw new ApiError(404, "Tweet is not Found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, updateTweet, "Tweet is Updated Successfully"))
})

// Delete The Tweet

const deleteTweet = asyncHandler(async(req,res) => {
    const {Tweetid} = req.params;
    if(!mongoose.Types.ObjectId.isValid(Tweetid)) {
        throw new ApiError(400, "Invalid UserId")
    }
    await Tweet.findByIdAndDelete(Tweetid)
    return res
    .status(200)
    .json(new ApiResponse(200, "Tweets Deleted Successfully"))
})

export {getUserTweets, createTweet, updateTweet, deleteTweet}