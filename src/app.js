import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { API_BASE_URL } from './common/config/constants.js'
import ENV from './common/config/env.js'
import globalErrorHandler from './common/middleware/globalError.middleware.js'
import authenticate from './common/middleware/auth.middleware.js'

import userRoutes from './modules/users/routes/user.routes.js'
import eventsRouter from './modules/Events/routes/events.routes.js'

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())

const API_URL = `${API_BASE_URL}/${ENV.API_VERSION}`

// USER ROUTES
app.use(`${API_URL}/auth`, userRoutes)

// EVENT ROUTES
app.use(`${API_URL}/events`, authenticate, eventsRouter)

// TODO: Add more routes here

// Global Error Handler
app.use(globalErrorHandler)

export default app
