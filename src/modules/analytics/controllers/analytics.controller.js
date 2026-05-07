import { HTTP_STATUS } from '../../../common/config/constants.js'
import {
    ErrorResponse,
    SuccessResponse,
} from '../../../common/utils/response.js'
import Event from '../../Events/models/event.models.js'

/**
 * Returns total number of events per month for the current year.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const eventsPerMonthController = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear()
        const result = await Event.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$date' },
                    total: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    total: 1,
                },
            },
        ])

        return SuccessResponse(
            res,
            HTTP_STATUS.OK,
            `Events per month for ${currentYear}`,
            result
        )
    } catch (error) {
        console.error('Error fetching events per month:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An error occurred while fetching analytics',
            { error: error.message }
        )
    }
}

/**
 * Returns the top 3 events with the highest number of registrations.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const topEventsController = async (req, res) => {
    try {
        const result = await Event.aggregate([
            {
                $project: {
                    title: 1,
                    date: 1,
                    location: 1,
                    registrationCount: { $size: '$registrations' },
                },
            },
            { $sort: { registrationCount: -1 } },
            { $limit: 3 },
        ])

        return SuccessResponse(
            res,
            HTTP_STATUS.OK,
            'Top 3 events by registrations',
            result
        )
    } catch (error) {
        console.error('Error fetching top events:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An error occurred while fetching analytics',
            { error: error.message }
        )
    }
}
