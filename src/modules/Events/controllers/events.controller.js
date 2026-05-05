import { HTTP_STATUS } from '../../../common/config/constants.js'
import {
    ErrorResponse,
    SuccessResponse,
} from '../../../common/utils/response.js'

import Event from '../models/event.models.js'

export const getAllEventsController = async (req, res) => {
    try {
        const events = await Event.find().select('-__v')
        return SuccessResponse(
            res,
            HTTP_STATUS.OK,
            'Events retrieved successfully',
            events
        )
    } catch (error) {
        console.error('Error retrieving events:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An error occurred while retrieving events',
            {
                error: error.message,
            }
        )
    }
}

export const createEventController = async (req, res) => {
    // Events Validation
    const { title, description, date, location } = req.body
    if (!title || !date) {
        return ErrorResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            'Title and Date are required'
        )
    }

    if (description && typeof description !== 'string') {
        return ErrorResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            'Description must be a string'
        )
    }

    if (date && isNaN(Date.parse(date))) {
        return ErrorResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            'Date must be a valid date string'
        )
    }

    if (location && typeof location !== 'string') {
        return ErrorResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            'Location must be a string'
        )
    }

    try {
        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            createdBy: req.user.userId,
        })

        return SuccessResponse(
            res,
            HTTP_STATUS.CREATED,
            'Event created successfully',
            newEvent
        )
    } catch (error) {
        console.error('Error creating event:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An error occurred while creating the event',
            {
                error: error.message,
            }
        )
    }
}

export const deleteEventController = async (req, res) => {
    const { eventId } = req.params

    if (!eventId) {
        return ErrorResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            'Event ID is required'
        )
    }

    try {
        const event = await Event.findById(eventId)

        if (!event) {
            return ErrorResponse(res, HTTP_STATUS.NOT_FOUND, 'Event not found')
        }

        await Event.deleteOne({ _id: eventId })

        return SuccessResponse(
            res,
            HTTP_STATUS.OK,
            'Event deleted successfully'
        )
    } catch (error) {
        console.error('Error deleting event:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An error occurred while deleting the event',
            {
                error: error.message,
            }
        )
    }
}
