export const SuccessResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    })
}

export const ErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    })
}

export const globalErrorHandler = (err, req, res) => {
    console.error(err.stack)
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    })
}
