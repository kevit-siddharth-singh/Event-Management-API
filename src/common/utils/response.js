/**
 * Send a success response
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {any} [data] - Optional data to include in response
 * @returns {import('express').Response} The response object
 */
export const SuccessResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    })
}

/**
 * Send an error response
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {any} [error] - Optional error details
 * @returns {import('express').Response} The response object
 */
export const ErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    })
}
