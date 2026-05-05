import { config } from 'dotenv'

config()

const requiredEnv = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'API_VERSION']

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`)
    }
})

const ENV = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_VERSION: process.env.API_VERSION || 'v1',
}

export default ENV
