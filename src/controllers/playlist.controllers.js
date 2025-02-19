import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const {userId} = req.user?._id;

    const existingPlayList = await Playlist.findOne({name, owner:userId});

    if(existingPlayList) {
        throw new ApiError(400, "Playlist with this name already exists")
    } else {
        const newPlayList = await Playlist.create({name, description, owner:userId});
        return res
        .status(200)
        .json(new ApiResponse(201, newPlayList, "Playlist created Successfully"))
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User Id")
    }
    const getPlayList = await Playlist.find({owner:userId}).populate('videos');
    return res
    .status(200)
    .json(new ApiResponse(200, getPlayList, "Get User Playlist Fetched Successfully"))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid Playlist Id")
    }
    const playlistById = await Playlist.findById(playlistId).populate("videos");
    if(!playlistById) {
        throw new ApiError(404, "PlayList not Found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, playlistById, "Get Playlist fetched By Id Successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const {userId} = req.user?._id;
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Playlist and videoID")
    }
    const addplaylist = await Playlist.findById(playlistId);
    if(!addplaylist){
        throw new ApiError(400, "Playlist is not Found")
    }
    // Check the Video is found
    if(addplaylist.videos.includes(videoId)) {
        throw new ApiError(400, "Video Already Found")
    }
    addplaylist.videos.push(videoId);
    await addplaylist.save();

    return res.status(200).json(new ApiResponse(200, addplaylist, "Video Add Successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Id of Playlistid or VideoId")
    }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(400, "Video not Found here")
    }
    playlist.videos.pull(videoId);
    await playlist.save();
    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video Removed successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {userId} = req.user?._id;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Playlist not Found")
    }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(400, "Playlist not found")
    }
    if(playlist.owner.toString() !== userId ) {
        throw new ApiError(400, "Your not authorized to delete this ")
    }
    await Playlist.findByIdAndDelete(playlistId);
    return res
    .status(200)
    .json(new ApiResponse(200, "Successfuly delete Playlist"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    const {userId} = req.user?._id;

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Playlist not found")
    }
    if(!name || !description) {
        throw new ApiError(400, "Please fill the Fields")
    }
    if(name.trim() == "" || description.trim() == "") {
        throw new ApiError(404, "Please fill the empty requirements")
    }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(404, 'Playlist Not Found')
    }
    if(playlist.owner.toString() !== userId) {
        throw new ApiError(400, "You are not Authrozied")
    }
    const updatedplaylist = await Playlist.findByIdAndUpdate(playlistId,{name, description});

    return res
    .status(200)
    .json(new ApiResponse(200, updatedplaylist, "Video Updated Successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}