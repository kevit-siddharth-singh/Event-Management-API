import { HTTP_STATUS } from '../../../common/config/constants.js'
import {
    ErrorResponse,
    SuccessResponse,
} from '../../../common/utils/response.js'

import Event from '../models/event.models.js'

/**
 * Get all events with optional filters
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getAllEventsController = async (req, res) => {
    try {
        const { date, location } = req.query
        const filter = {}

        if (date) {
            const start = new Date(date)
            const end = new Date(start)
            end.setDate(end.getDate() + 1)
            filter.date = { $gte: start, $lt: end }
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' }
        }

        const events = await Event.find(filter).select('-__v')
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
            { error: error.message }
        )
    }
}

/**
 * Get a specific event by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getEventByIdController = async (req, res) => {
    const { eventId } = req.params
    try {
        const event = await Event.findById(eventId)
            .select('-__v')
            .populate('createdBy', 'name email')
        if (!event) {
            return ErrorResponse(res, HTTP_STATUS.NOT_FOUND, 'Event not found')
        }
        return SuccessResponse(
            res,
            HTTP_STATUS.OK,
            'Event retrieved successfully',
            event
        )
    } catch (error) {
        console.error('Error retrieving event:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An error occurred while retrieving the event',
            { error: error.message }
        )
    }
}

/**
 * Create a new event
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const createEventController = async (req, res) => {
    const { title, description, date, location, maxAttendees } = req.body

    try {
        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            maxAttendees,
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

/**
 * Update an existing event
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const updateEventController = async (req, res) => {
    const { eventId } = req.params
    const { title, description, date, location, maxAttendees } = req.body

    // Business logic for updating the event
    try {
        const event = await Event.findById(eventId)
        if (!event) {
            return ErrorResponse(res, HTTP_STATUS.NOT_FOUND, 'Event not found')
        }

        // Prevent shrinking capacity below current registrations
        if (
            maxAttendees !== undefined &&
            maxAttendees < event.registrations.length
        ) {
            return ErrorResponse(
                res,
                HTTP_STATUS.BAD_REQUEST,
                'maxAttendees cannot be less than the number of existing registrations'
            )
        }

        const updated = await Event.findByIdAndUpdate(
            eventId,
            { title, description, date, location, maxAttendees },
            { new: true, runValidators: true }
        ).select('-__v')

        return SuccessResponse(
            res,
            HTTP_STATUS.OK,
            'Event updated successfully',
            updated
        )
    } catch (error) {
        console.error('Error updating event:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An error occurred while updating the event',
            { error: error.message }
        )
    }
}

/**
 * Delete an event
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const deleteEventController = async (req, res) => {
    const { eventId } = req.params

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

/**
 * Register the authenticated user for an event
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const registerForEventController = async (req, res) => {
    const { eventId } = req.params
    const userId = req.user.userId

    try {
        const event = await Event.findById(eventId)
        if (!event) {
            return ErrorResponse(res, HTTP_STATUS.NOT_FOUND, 'Event not found')
        }

        if (event.registrations.some((id) => id.toString() === userId)) {
            return ErrorResponse(
                res,
                HTTP_STATUS.CONFLICT,
                'You are already registered for this event'
            )
        }

        if (
            event.maxAttendees > 0 &&
            event.registrations.length >= event.maxAttendees
        ) {
            return ErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Event is full')
        }

        event.registrations.push(userId)
        await event.save()

        return SuccessResponse(
            res,
            HTTP_STATUS.OK,
            'Successfully registered for the event',
            { eventId, registrations: event.registrations.length }
        )
    } catch (error) {
        console.error('Error registering for event:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An error occurred while registering for the event',
            { error: error.message }
        )
    }
}

/**
 * Cancel the authenticated user's registration for an event
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const cancelRegistrationController = async (req, res) => {
    const { eventId } = req.params
    const userId = req.user.userId

    try {
        const event = await Event.findById(eventId)
        if (!event) {
            return ErrorResponse(res, HTTP_STATUS.NOT_FOUND, 'Event not found')
        }

        const index = event.registrations.findIndex(
            (id) => id.toString() === userId
        )
        if (index === -1) {
            return ErrorResponse(
                res,
                HTTP_STATUS.NOT_FOUND,
                'You are not registered for this event'
            )
        }

        event.registrations.splice(index, 1)
        await event.save()

        return SuccessResponse(
            res,
            HTTP_STATUS.OK,
            'Registration cancelled successfully',
            { eventId, registrations: event.registrations.length }
        )
    } catch (error) {
        console.error('Error cancelling registration:', error)
        return ErrorResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'An error occurred while cancelling the registration',
            { error: error.message }
        )
    }
}
