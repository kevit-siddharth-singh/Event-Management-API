import { body, param, query } from 'express-validator'

/**
 * Validation rules for creating an event
 */
export const validateCreateEvent = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    body('location')
        .optional()
        .isString()
        .withMessage('Location must be a string'),
    body('maxAttendees')
        .optional()
        .isInt({ min: 0 })
        .withMessage('maxAttendees must be a non-negative integer'),
]

/**
 * Validation rules for updating an event
 */
export const validateUpdateEvent = [
    param('eventId').isMongoId().withMessage('Invalid event ID'),
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    body('location')
        .optional()
        .isString()
        .withMessage('Location must be a string'),
    body('maxAttendees')
        .optional()
        .isInt({ min: 0 })
        .withMessage('maxAttendees must be a non-negative integer'),
    // Custom validation to ensure at least one field is provided
    body().custom((body) => {
        const updatableFields = [
            'title',
            'description',
            'date',
            'location',
            'maxAttendees',
        ]
        const hasAtLeastOneField = updatableFields.some(
            (field) => body[field] !== undefined
        )
        if (!hasAtLeastOneField) {
            throw new Error('At least one field must be provided for update')
        }
        return true
    }),
]

/**
 * Validation rules for event ID parameter
 */
export const validateEventId = [
    param('eventId').isMongoId().withMessage('Invalid event ID'),
]

/**
 * Validation rules for getting events with filters
 */
export const validateGetEvents = [
    query('date')
        .optional()
        .custom((value) => {
            const date = new Date(value)
            if (isNaN(date.getTime())) {
                throw new Error('Date must be a valid date')
            }
            return true
        }),
    query('location')
        .optional()
        .isString()
        .withMessage('Location must be a string'),
]
