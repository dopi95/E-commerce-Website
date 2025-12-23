import { Router } from 'express'
import { forgotPasswordController, getUserCount, loginController, logoutController, refreshToken, registerUserController, resetpassword, updateUserDetails, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOtp, getAllUsersController, deleteUserController, resendEmailVerificationOtp } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import upload from '../middleware/multer.js'

const userRouter = Router()

userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/resend-otp',resendEmailVerificationOtp)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)
userRouter.get('/user-count',auth,getUserCount)

// Admin routes
userRouter.get('/all-users', auth, admin, getAllUsersController)
userRouter.delete('/delete/:userId', auth, admin, deleteUserController)




export default userRouter