import { HTTP_STATUS } from '../config/constants.js'
import ENV from '../config/env.js'
import { ErrorResponse } from '../utils/response.js'

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {void}
 */
const globalErrorHandler = (err, req, res) => {
    console.error(err.stack)

    // In development, show the actual error message
    const isDevelopment = ENV.NODE_ENV !== 'production'
    const errorMessage = isDevelopment
        ? err.message
        : 'An unexpected error occurred'

    return ErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, errorMessage)
}

export default globalErrorHandler
