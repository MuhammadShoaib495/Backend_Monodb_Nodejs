import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const healthcheck = asyncHandler(async(req,res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        {
            status:"ok",
            message:"Server is Running Ok"
        }
    ))
})

export {
    healthCheck
}