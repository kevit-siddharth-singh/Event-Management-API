import { HTTP_STATUS } from '../../../common/config/constants.js'
import ENV from '../../../common/config/env.js'
import {
    comparePassword,
    hashPassword,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from '../../../common/config/jwt.js'
import {
    ErrorResponse,
    SuccessResponse,
} from '../../../common/utils/response.js'
import User from '../models/user.model.js'

/**
 * Handle user login
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const loginController = async (req, res) => {
    const { email, password } = req.body

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

        // Generate tokens
        const accessToken = signAccessToken({
            userId: user._id,
            role: user.role,
        })
        const refreshToken = signRefreshToken({
            userId: user._id,
            role: user.role,
        })

        // Save refresh token in DB
        user.refreshToken = refreshToken
        await user.save()

        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production', // HTTPS only in prod
            sameSite: 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        //  Send access token in response
        return SuccessResponse(res, HTTP_STATUS.OK, 'Login successful', {
            accessToken,
        })
    } catch (error) {
        console.error('Error during login:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error during login'
        )
    }
}

/**
 * Handle user registration
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const registerController = async (req, res) => {
    const { email, password } = req.body

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

/**
 * Handle token refresh
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const refreshTokenController = async (req, res) => {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
        return ErrorResponse(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            'Refresh token is missing'
        )
    }

    try {
        const payload = verifyRefreshToken(refreshToken)

        if (!payload) {
            return ErrorResponse(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Invalid refresh token'
            )
        }

        const user = await User.findById(payload.userId)

        // Generate new access token
        const newAccessToken = signAccessToken({ userId: user._id })

        return SuccessResponse(res, HTTP_STATUS.OK, 'Token refreshed', {
            accessToken: newAccessToken,
        })
    } catch (error) {
        console.error('Error refreshing token:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error refreshing token'
        )
    }
}
