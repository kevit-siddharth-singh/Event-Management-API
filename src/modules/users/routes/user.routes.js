import { Router } from 'express'
import {
    loginController,
    refreshTokenController,
    registerController,
} from '../controllers/user.controller.js'
import {
    validateLogin,
    validateRegister,
} from '../validations/user.validations.js'
import { handleValidationErrors } from '../../../common/utils/validation.js'

const userRouter = Router()

// Login Route
userRouter.post(
    '/login',
    validateLogin,
    handleValidationErrors,
    loginController
)

//Register Route
userRouter.post(
    '/register',
    validateRegister,
    handleValidationErrors,
    registerController
)

// Refresh Token Route
userRouter.post('/refresh-token', refreshTokenController)

export default userRouter
