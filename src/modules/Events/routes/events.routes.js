import { Router } from 'express'

import {
    createEventController,
    deleteEventController,
    getAllEventsController,
    getEventByIdController,
    updateEventController,
    registerForEventController,
    cancelRegistrationController,
} from '../controllers/events.controller.js'

import authorize from '../../../common/middleware/role.middleware.js'
import {
    validateCreateEvent,
    validateUpdateEvent,
    validateEventId,
    validateGetEvents,
} from '../validations/event.validations.js'
import { handleValidationErrors } from '../../../common/utils/validation.js'

const eventsRouter = Router()

// GET /events - Get all events (supports ?date= and ?location= filters)
eventsRouter.get(
    '/',
    validateGetEvents,
    handleValidationErrors,
    getAllEventsController
)

// POST /events - Create a new event (admin only)
eventsRouter.post(
    '/',
    authorize('admin'),
    validateCreateEvent,
    handleValidationErrors,
    createEventController
)

// GET /events/:eventId - Get a specific event
eventsRouter.get(
    '/:eventId',
    validateEventId,
    handleValidationErrors,
    getEventByIdController
)

// PUT /events/:eventId - Update an event (admin only)
eventsRouter.put(
    '/:eventId',
    authorize('admin'),
    validateUpdateEvent,
    handleValidationErrors,
    updateEventController
)

// DELETE /events/:eventId - Delete an event (admin only)
eventsRouter.delete(
    '/:eventId',
    authorize('admin'),
    validateEventId,
    handleValidationErrors,
    deleteEventController
)

// POST /events/:eventId/register - Register for an event (user)
eventsRouter.post(
    '/:eventId/register',
    validateEventId,
    handleValidationErrors,
    registerForEventController
)

// DELETE /events/:eventId/register - Cancel registration (user)
eventsRouter.delete(
    '/:eventId/register',
    validateEventId,
    handleValidationErrors,
    cancelRegistrationController
)

export default eventsRouter
