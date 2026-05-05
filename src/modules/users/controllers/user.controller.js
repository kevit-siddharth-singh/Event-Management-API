import { HTTP_STATUS } from '../../../common/config/constants.js'
import { comparePassword, hashPassword, signAccessToken } from '../../../common/config/jwt.js'
import {
    ErrorResponse,
    SuccessResponse,
} from '../../../common/utils/response.js'
import User from '../models/user.model.js'

export const loginController = async (req, res) => {
    // Validating request body
    const { email, password } = req.body
    if (!email || !password) {
        return ErrorResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            'Email and password are required'
        )
    }

    // check if user exists and password is correct
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return ErrorResponse(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Invalid email or password'
            )
        }

        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            return ErrorResponse(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Invalid email or password'
            )
        }
    } catch (error) {
        console.error('Error during login:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error during login'
        )
    }

    // JWT Access and Refresh token generation logic
    const accessToken = signAccessToken({ email })

    return SuccessResponse(res, HTTP_STATUS.OK, 'Login successful', {
        accessToken,
    })
}

export const registerController = async (req, res) => {
    // Validating request body
    const { email, password, confirmPassword } = req.body
    if (!email || !password || !confirmPassword) {
        return ErrorResponse(
            res,
            400,
            'Email, password and confirm password are required'
        )
    }

    if (password !== confirmPassword) {
        return ErrorResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            'Password and confirm password do not match'
        )
    }

    // Check if user with the same email already exists
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return ErrorResponse(
                res,
                HTTP_STATUS.CONFLICT,
                'Email is already registered'
            )
        }
    } catch (error) {
        console.error('Error checking existing user:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error checking existing user'
        )
    }

    // User Registration logic
    try {
        const hashedPassword = await hashPassword(password)
        const user = await User.create({
            email,
            password: hashedPassword,
        })

        return SuccessResponse(
            res,
            HTTP_STATUS.CREATED,
            'User registered successfully',
            {
                id: user._id,
                email: user.email,
            }
        )
    } catch (error) {
        console.error('Error registering user:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error registering user'
        )
    }
}
