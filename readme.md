# Event Management API

A RESTful API for managing events, user registrations, and analytics built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register, login, and token refresh with JWT
- **Role-Based Access Control**: Admin and user roles with protected routes
- **Event Management**: Create, read, update, delete events (admin only)
- **Event Registration**: Users can register/cancel for events
- **Analytics**: View events per month and top events by registrations (admin only)
- **Input Validation**: Robust validation using express-validator
- **Error Handling**: Consistent error responses and global error middleware

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## Project Structure

```
src/
├── app.js                 # Main Express app setup
├── common/
│   ├── config/
│   │   ├── constants.js   # App constants (roles, HTTP status, etc.)
│   │   ├── db.js          # MongoDB connection
│   │   ├── env.js         # Environment variables validation
│   │   └── jwt.js         # JWT utilities (sign, verify, hash)
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT authentication
│   │   ├── globalError.middleware.js # Global error handler
│   │   └── role.middleware.js     # Role-based authorization
│   └── utils/
│       ├── response.js    # Standardized API responses
│       └── validation.js  # Shared validation middleware
├── modules/
│   ├── analytics/
│   │   ├── controllers/
│   │   └── routes/
│   ├── Events/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── validations/    # Event-specific validations
│   └── users/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── validations/    # User-specific validations
└── index.js               # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/kevit-siddharth-singh/Event-Management-API.git
    cd Event-Management-API
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with the following variables:

    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/event-management
    JWT_SECRET=your-super-secret-jwt-key
    API_VERSION=v1
    NODE_ENV=development
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

The server will run on `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Events

- `GET /api/v1/events` - Get all events (with optional ?date=YYYY-MM-DD&location= filters)
- `GET /api/v1/events/:eventId` - Get event by ID
- `POST /api/v1/events` - Create event (admin only)
- `PUT /api/v1/events/:eventId` - Update event (admin only)
- `DELETE /api/v1/events/:eventId` - Delete event (admin only)
- `POST /api/v1/events/:eventId/register` - Register for event
- `DELETE /api/v1/events/:eventId/register` - Cancel registration

### Analytics

- `GET /api/v1/analytics/events/per-month` - Events per month for current year (admin only)
- `GET /api/v1/analytics/events/top` - Top 3 events by registrations (admin only)

## Authentication

The API uses JWT for authentication. Include the access token in the `Authorization` header:

```
Authorization: Bearer <your-access-token>
```

Refresh tokens are stored in HTTP-only cookies for security.

## User Roles

- **User**: Can view events, register/cancel for events
- **Admin**: All user permissions + create/update/delete events, view analytics

## Data Models

### User

```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: 'user', enum: ['admin', 'user']),
  createdAt: Date,
  updatedAt: Date
}
```

### Event

```javascript
{
  title: String (required),
  description: String,
  date: Date (required),
  location: String,
  maxAttendees: Number (default: 0),
  createdBy: ObjectId (ref: User, required),
  registrations: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns consistent error responses:

```json
{
    "success": false,
    "message": "Error description"
}
```

Common HTTP status codes:

- 200: Success
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

### Code Quality

- ESLint for linting
- Prettier for code formatting
- JSDoc for documentation

### Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `API_VERSION`: API version prefix (default: v1)
- `NODE_ENV`: Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC
