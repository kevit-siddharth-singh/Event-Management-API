import jwt from 'jsonwebtoken'
import ENV from '../config/env.js'
import { JWT_EXPIRY, SALT_ROUNDS } from './constants.js'
import bcrypt from 'bcryptjs'

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - The payload to encode in the token
 * @param {string} payload.userId - The user ID
 * @param {string} payload.role - The user role
 * @returns {string} The signed access token
 */
export const signAccessToken = (payload) => {
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: JWT_EXPIRY.ACCESS,
    })
}

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} payload - The payload to encode in the token
 * @param {string} payload.userId - The user ID
 * @param {string} payload.role - The user role
 * @returns {string} The signed refresh token
 */
export const signRefreshToken = (payload) => {
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: JWT_EXPIRY.REFRESH,
    })
}

/**
 * Verify Access Token
 * @param {string} token - The JWT token to verify
 * @returns {Object} The decoded payload
 * @throws {TokenExpiredError|JsonWebTokenError} If token is invalid or expired
 */
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ENV.JWT_SECRET)
}

/**
 * Verify Refresh Token
 * @param {string} token - The JWT token to verify
 * @returns {Object} The decoded payload
 * @throws {TokenExpiredError|JsonWebTokenError} If token is invalid or expired
 */
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, ENV.JWT_SECRET)
}

/**
 * Hash Password
 * @param {string} plainPassword - The plain text password
 * @returns {Promise<string>} The hashed password
 */
export const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(plainPassword, salt)
    return hashedPassword
}

/**
 * Compare Password
 * @param {string} plainPassword - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}
