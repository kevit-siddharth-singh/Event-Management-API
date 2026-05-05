import express from 'express'
import cors from 'cors'
import userRoutes from './modules/users/routes/user.routes.js'
import { API_BASE_URL } from './common/config/constants.js'
import ENV from './common/config/env.js'
import { globalErrorHandler } from './common/utils/response.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())

const API_URL = `${API_BASE_URL}/${ENV.API_VERSION}`

// USER ROUTES
app.use(`${API_URL}/auth`, userRoutes)

// TODO: Add more routes here

// Global Error Handler
app.use(globalErrorHandler)

export default app
