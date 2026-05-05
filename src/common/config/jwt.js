import jwt from 'jsonwebtoken'
import ENV from '../config/env.js'
import { JWT_EXPIRY, SALT_ROUNDS } from './constants.js'
import bcrypt from 'bcryptjs'

// Generate Access Token (short-lived)
export const signAccessToken = (payload) => {
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: JWT_EXPIRY.ACCESS,
    })
}

// Generate Refresh Token (long-lived)
export const signRefreshToken = (payload) => {
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: JWT_EXPIRY.REFRESH,
    })
}

// Verify Access Token
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ENV.JWT_SECRET)
    } catch (err) {
        console.error('Access token verification failed:', err)
    }
}

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, ENV.JWT_SECRET)
    } catch (err) {
        console.error('Refresh token verification failed:', err)
    }
}

// Hash Password
export const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(plainPassword, salt)
    return hashedPassword
}

// Compare Password
export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}
