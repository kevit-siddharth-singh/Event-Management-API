/** Application-wide constants */

export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
}

export const JWT_EXPIRY = {
    ACCESS: '15m',
    REFRESH: '7d',
}

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
}

export const API_BASE_URL = `/api`

export const SALT_ROUNDS = 10
