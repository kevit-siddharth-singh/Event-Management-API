import { body } from 'express-validator'

/**
 * Validation rules for user registration
 */
export const validateRegister = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
        }
        return true
    }),
]

/**
 * Validation rules for user login
 */
export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
]
