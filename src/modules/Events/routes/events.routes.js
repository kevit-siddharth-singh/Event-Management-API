import { Router } from 'express'

import {
    createEventController,
    deleteEventController,
    getAllEventsController,
} from '../controllers/events.controller.js'

import authorize from '../../../common/middleware/role.middleware.js'

const eventsRouter = Router()

// GET /events - Get all events
eventsRouter.get('/', getAllEventsController)

// POST /events - Create a new event
eventsRouter.post('/', authorize('admin'), createEventController)

// DELETE /events/:id - Delete an event (admin only)
eventsRouter.delete('/:eventId', authorize('admin'), deleteEventController)

export default eventsRouter
