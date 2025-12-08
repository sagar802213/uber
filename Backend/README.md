# User Integration - Uber Backend

This README documents the user registration integration for the Uber backend service. The integration is complete and ready for use.

## Features

- User registration with validation (email, first name, password)
- User login with email and password authentication
- Password hashing using bcrypt
- JWT authentication token generation
- Modular MVC structure (controllers, models, services, routes)

<!--
This section describes the structure of the project's folders, outlining the organization and purpose of each directory within the backend codebase.
-->

## Folder Structure

## User Registration Flow

1. **Route**: `POST /register` (see `routes/user.routes.js`)
2. **Validation**: Checks for valid email, first name (min 3 chars), password (min 6 chars)
3. **Controller**: Handles request, validates input, hashes password, calls service
4. **Service**: Creates user in MongoDB using Mongoose model
5. **Model**: Defines user schema, password hashing, JWT token methods
6. **Response**: Returns created user and JWT token

## Example Request

```
POST /register
Content-Type: application/json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

## Example Response

```
Status: 201 Created
{
  "user": { ...user fields... },
  "token": "<JWT token>"
}
```

## User Login Flow

1. **Route**: `POST /login` (see `routes/user.routes.js`)
2. **Validation**: Checks for valid email and password (min 6 chars)
3. **Controller**: Validates input, retrieves user by email, compares password hash
4. **Model**: Queries user from MongoDB with password field selected
5. **Response**: Returns user and JWT token on successful authentication

## Login Example Request

```
POST /login
Content-Type: application/json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

## Login Example Response

```
Status: 200 OK
{
  "user": { ...user fields... },
  "token": "<JWT token>"
}
```

## Login Error Response

```
Status: 401 Unauthorized
{
  "message": "Invalid email or password"
}
```

## Notes

- **All required fields must be provided.**
- **Passwords are securely hashed** before storage using `bcrypt`.
- **JWT secret** must be set in environment variables (`process.env.JWT_SECRET`).

## User Profile

1. **Route**: `GET /profile` (protected — see `middlewares/auth.middleware`)
2. **Purpose**: Returns the authenticated user's profile information
3. **Auth**: Requires a valid JWT provided either in an `Authorization: Bearer <token>` header or a `token` cookie

### Example Request

```
GET /profile
Authorization: Bearer <JWT token>
```

### Example Response

```
Status: 200 OK
{
  "user": { ...user fields... }
}
```

## Logout

1. **Route**: `GET /logout` (protected — see `middlewares/auth.middleware`)
2. **Purpose**: Logs the user out by clearing the `token` cookie and adding the token to a blacklist so it cannot be reused
3. **Implementation**: Creates an entry in the `BlacklistToken` collection (see `models/blacklistToken.model.js`) and clears the cookie

### Example Request

```
GET /logout
Authorization: Bearer <JWT token>
```

### Example Response

```
Status: 200 OK
{
  "message": "Logged out successfully"
}
```

## Blacklist Token

- The project includes a `BlacklistToken` model (`models/blacklistToken.model.js`) which stores tokens that were explicitly logged out. Blacklisted tokens are set to expire after 24 hours using a TTL index on the `blacklistedAt` field.
- Authentication middleware should check this collection to reject requests that present a blacklisted token.

## Auth Middleware

- The codebase exposes an authentication middleware (e.g. `middlewares/auth.middleware`) used to protect routes. It should:
  - Validate the JWT signature and expiry
  - Verify the token is not present in the `BlacklistToken` collection
  - Attach the user object to `req.user` for downstream handlers

## Next Steps

- Add automated tests for registration, login, profile, and logout flows
- Add token refresh / refresh-token endpoint if long sessions are required
- Harden cookie settings (`httpOnly`, `secure`, `sameSite`) for production

---

User integration (register, login, profile, logout) is complete and functional.

## Captain Registration

This project includes a captain registration flow similar to user registration. The captain endpoints live under the `captain` router (see `routes/captain.routes.js`).

1. **Route**: `POST /captain/register` (see `routes/captain.routes.js`)
2. **Validation**: The route validates:
   - `email` (must be a valid email)
   - `fullname.firstname` (min 3 chars)
   - `password` (min 6 chars)
   - `vehicle.color` (min 3 chars)
   - `vehicle.plate` (min 3 chars)
   - `vehicle.capacity` (integer, min 1)
   - `vehicle.vehicleType` (one of `car`, `motorcycle`, `auto`)
3. **Controller**: `controllers/captain.controller.js` checks for existing captain by email, hashes the password, and calls `captain.service` to create the captain model instance.
4. **Service**: `services/captain.service.js` builds the `captain` document. Note: ensure the service saves the document (e.g. using `await captain.save()` or `captainModel.create(...)`) so the record is persisted.

### Example Request

```
POST /captain/register
Content-Type: application/json
{
  "fullname": { "firstname": "Alice", "lastname": "Smith" },
  "email": "alice@example.com",
  "password": "securePass123",
  "vehicle": { "color": "Blue", "plate": "ABC123", "capacity": 4, "vehicleType": "car" }
}
```

### Example Response

```
Status: 201 Created
{
  "captain": { ...captain fields... },
  "token": "<JWT token>"
}
```

## Captain Login

1. **Route**: \POST /captain/login\ (see \outes/captain.routes.js\)
2. **Validation**: Checks for valid email and password (min 6 chars)
3. **Controller**: Validates input, retrieves captain by email, compares password hash
4. **Response**: Returns captain and JWT token on successful authentication

### Captain Login Request

\\\
POST /captain/login
Content-Type: application/json
{
  "email": "alice@example.com",
  "password": "securePass123"
}
\\\

### Captain Login Response

\\\
Status: 200 OK
{
  "captain": { ...captain fields... },
  "token": "<JWT token>"
}
\\\

### Captain Login Error Response

\\\
Status: 401 Unauthorized
{
  "message": "Invalid email or password"
}
\\\

## Captain Profile

1. **Route**: \GET /captain/profile\ (protected  requires valid JWT)
2. **Purpose**: Returns the authenticated captain's profile information including vehicle details
3. **Auth**: Requires a valid JWT provided either in an \Authorization: Bearer <token>\ header or a \	oken\ cookie
4. **Middleware**: Uses \uthMiddleware.authCaptain\ to validate token and fetch captain

### Captain Profile Request

\\\
GET /captain/profile
Authorization: Bearer <JWT token>
\\\

### Captain Profile Response

\\\
Status: 200 OK
{
  "captain": {
    "_id": "...",
    "fullname": { "firstname": "Alice", "lastname": "Smith" },
    "email": "alice@example.com",
    "vehicle": { "color": "Blue", "plate": "ABC123", "capacity": 4, "vehicleType": "car" },
    "status": "inactive",
    "location": { "ltd": null, "lng": null }
  }
}
\\\

## Captain Logout

1. **Route**: \GET /captain/logout\ (protected  requires valid JWT)
2. **Purpose**: Logs the captain out by clearing the \	oken\ cookie and adding the token to the blacklist
3. **Implementation**: Creates an entry in the \BlacklistToken\ collection and clears the cookie
4. **Middleware**: Uses \uthMiddleware.authCaptain\ to validate token before logout

### Captain Logout Request

\\\
GET /captain/logout
Authorization: Bearer <JWT token>
\\\

### Captain Logout Response

\\\
Status: 200 OK
{
  "message": "Logged out successfully"
}
\\\

### Troubleshooting Captain Endpoints

- **401 Unauthorized on logout/profile**: Ensure your token is valid and not expired. The captain must exist in the database.
- **No token provided**: Make sure you're sending the JWT token in either:
  - \Authorization: Bearer <token>\ header, or
  - \	oken\ cookie (set after login)

---

Captain integration (register, login, profile, logout) is complete and functional.
