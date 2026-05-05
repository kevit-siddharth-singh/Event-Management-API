import { HTTP_STATUS } from '../config/constants.js'
import { ErrorResponse } from '../utils/response.js'

// middleware/role.middleware.ts

const authorize = (...allowedRoles) => {
    console.log('🚀 ~ authorize ~ allowedRoles:', allowedRoles)
    return (req, res, next) => {
        console.log('🚀 ~ authorize ~ req:', req.user)

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
