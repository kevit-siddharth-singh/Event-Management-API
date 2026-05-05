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
