import mongoose, {isValidObjectId} from "mongoose";
import { Comment } from "../models/comments.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// get videos comments

const getVideoComments = asyncHandler(async(req,res) => {
    const {videoId} = req.params;
    const {page = 1, limit = 10} = req.query
   if(!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video Id for Comment ")
   }
   const comments = await Comment.aggregate([
    {
        $match:{ video: new mongoose.Types.inputId(videoId)},
    },
    {$sort: {createdAt: -1}},
    {$skip:(parseInt(page) -1) * parseInt(limit)},
    {$limit: parseInt(limit)},
    {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"user"
        }
    },
    {$unwind: "$user"},
    {
        $project:{
            _id:1,
            content:1,
            video:1,
            createdAt:1,
            "user_id":1,
            "user.name":1,
            "user.avatar":1
        }
    }
   ]);

   const totalComments = await Comment.countDocuments({video:videoId});
   const totalPages = Math.ceil(totalComments/limit);
   return res
   .status(200)
   .json(new ApiResponse(200, { comments, totalPages }, "Comments retrived Succesfully"))
})

// Add Comment In database
const addComment = asyncHandler(async(req, res) => {
    const {content, videoId, owner} = req.body

    if(!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video Id ")
    }
    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content is Empty");
    }
  const newCommentData = 
       {
        content,
        video: videoId
       };
       if(owner && mongoose.Types.ObjectId.isValid(owner)) {
        newCommentData.owner = owner;
       }
       const newComment = await Comment.create(newCommentData);

       return res
       .status(200)
       .json(new ApiResponse(200, newComment, "Succesfuly added new Comment"))

})

//Update Comment 
const updateComment = asyncHandler(async(req,res) => {
    const {commentId} = req.params;
    const {content} = req.body;
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid Video Id");
    }
    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content Is required");
    }
   const updateComment = await Comment.findByIdAndUpdate(commentId, {content, updatedAt: new Date()}, {new:true})
   if(!updateComment) {
    throw new ApiError(404, "Comment not Found")
   }
   return res
   .status(200)
   .json(new ApiResponse(200, updateComment, "CommentUpdated"))

})

// Delete Comment

const deleteComment = asyncHandler(async(req,res) => {
    const {commentId} = req.params;
    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Comment Id Not valid")
    }
    await Comment.findByIdAndDelete(commentId);
    return res
    .status(200)
    .json(new ApiResponse(200, null, "Succefully Delete Comment"))
})
export {getVideoComments, addComment, updateComment, deleteComment};