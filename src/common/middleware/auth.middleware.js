import { HTTP_STATUS } from '../config/constants.js'
import { verifyAccessToken } from '../config/jwt.js'
import { ErrorResponse } from '../utils/response.js'

/**
 * Middleware to authenticate requests using JWT access token
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader) {
            return ErrorResponse(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Authorization header missing'
            )
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return ErrorResponse(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Token missing from Authorization header'
            )
        }
        const DecodedUser = verifyAccessToken(token)

        req.user = DecodedUser
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return ErrorResponse(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Token has expired'
            )
        }
        if (error.name === 'JsonWebTokenError') {
            return ErrorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid token')
        }
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            `An error occurred during authentication, {error: ${error.message}}`
        )
    }
}

export default authenticate
