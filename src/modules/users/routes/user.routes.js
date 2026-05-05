import { Router } from 'express'
import {
    loginController,
    registerController,
} from '../controllers/user.controller.js'

const userRouter = Router()

// Login Route
userRouter.post('/login', loginController)

//Register Route
userRouter.post('/register', registerController)

export default userRouter
