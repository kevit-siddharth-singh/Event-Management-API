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

const eventsRouter = Router()

// GET /events - Get all events (supports ?date= and ?location= filters)
eventsRouter.get('/', getAllEventsController)

// POST /events - Create a new event (admin only)
eventsRouter.post('/', authorize('admin'), createEventController)

// GET /events/:eventId - Get a specific event
eventsRouter.get('/:eventId', getEventByIdController)

// PUT /events/:eventId - Update an event (admin only)
eventsRouter.put('/:eventId', authorize('admin'), updateEventController)

// DELETE /events/:eventId - Delete an event (admin only)
eventsRouter.delete('/:eventId', authorize('admin'), deleteEventController)

// POST /events/:eventId/register - Register for an event (user)
eventsRouter.post('/:eventId/register', registerForEventController)

// DELETE /events/:eventId/register - Cancel registration (user)
eventsRouter.delete('/:eventId/register', cancelRegistrationController)

export default eventsRouter
