import { Router } from 'express'
import auth from '../middleware/auth.js'
import uploadImageController from '../controllers/uploadImage.controller.js'
import upload from '../middleware/multer.js'

const uploadRouter = Router()

uploadRouter.post("/upload",auth,upload.single("image"),uploadImageController)

export default uploadRouter

// can you make the route folder rename to routes and in that folder rename this file upload.router to upload.route this  and check any thing that use this changed file so see all my project and if it must needed any change with the updated name do that for my project