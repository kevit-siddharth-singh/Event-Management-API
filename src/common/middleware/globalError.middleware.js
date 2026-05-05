import { HTTP_STATUS } from '../config/constants.js'
import { ErrorResponse } from '../utils/response.js'

const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack)
    next(
        ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An unexpected error occurred',
            { error: err.message }
        )
    )
}

export default globalErrorHandler
