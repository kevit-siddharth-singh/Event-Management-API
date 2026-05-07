import { HTTP_STATUS } from '../config/constants.js'
import { ErrorResponse } from '../utils/response.js'

// middleware/role.middleware.ts

/**
 * Middleware factory to authorize requests based on user roles
 * @param {...string} allowedRoles - The roles allowed to access the resource
 * @returns {Function} Express middleware function
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const user = req.user

            if (!user) {
                return ErrorResponse(
                    res,
                    HTTP_STATUS.UNAUTHORIZED,
                    'Unauthorized: You do not have permission to access this resource'
                )
            }

            if (!allowedRoles.includes(user.role)) {
                return ErrorResponse(
                    res,
                    HTTP_STATUS.FORBIDDEN,
                    'Forbidden: You do not have permission to access this resource'
                )
            }

            next()
        } catch (error) {
            return ErrorResponse(
                res,
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'An unexpected error occurred',
                { error: error.message }
            )
        }
    }
}

export default authorize
