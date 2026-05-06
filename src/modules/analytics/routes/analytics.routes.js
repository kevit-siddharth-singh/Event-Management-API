import { Router } from 'express'

import {
    eventsPerMonthController,
    topEventsController,
} from '../controllers/analytics.controller.js'

import authorize from '../../../common/middleware/role.middleware.js'

const analyticsRouter = Router()

// GET /analytics/events/per-month - Total events per month for the current year
analyticsRouter.get(
    '/events/per-month',
    authorize('admin'),
    eventsPerMonthController
)

// GET /analytics/events/top - Top 3 events by registrations
analyticsRouter.get('/events/top', authorize('admin'), topEventsController)

export default analyticsRouter
