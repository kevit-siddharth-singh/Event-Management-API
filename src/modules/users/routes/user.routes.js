import { Router } from 'express'
import {
    loginController,
    refreshTokenController,
    registerController,
} from '../controllers/user.controller.js'

const userRouter = Router()

// Login Route
userRouter.post('/login', loginController)

//Register Route
userRouter.post('/register', registerController)

// Refresh Token Route
userRouter.post('/refresh-token', refreshTokenController)

export default userRouter
