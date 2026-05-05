import { Router } from 'express'
import { getAllEventsController } from '../controllers/events.controller.js'

const eventsRouter = Router()

eventsRouter.get('/', getAllEventsController)

export default eventsRouter
