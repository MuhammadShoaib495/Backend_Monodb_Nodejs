import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()
app.use(cors(
    {origin: process.env.CORS_ORIGIN,
    Credentials: true,}
))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Imports routes 
import userRouter from './routes/user.routes.js'
import subscritpionsRouter from './routes/subscriptions.router.js'
import videosRouter from './routes/video.routes.js'
import commentRouter from './routes/comment.router.js'
import tweetRouter from './routes/tweet.router.js'
import likesRouter from './routes/likes.router.js'
import playListRouter from './routes/playlist.route.js'
import dashboardRouter from './routes/dashboard.router.js'
import healthcheckRouter from './routes/healthchecker.router.js'
app.use("/api/v1/users", userRouter)
app.use("/api/v1/subscriptions", subscritpionsRouter)
app.use("/api/v1/video", videosRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("api/v1/likes", likesRouter)
app.use("/api/v1/playlist", playListRouter)
app.use("/api/v1/channel", dashboardRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)


export {app}