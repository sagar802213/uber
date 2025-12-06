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

- All required fields must be provided.
- Passwords are securely hashed before storage.
- JWT secret must be set in environment variables (`process.env.JWT_SECRET`).

## Next Steps

- Add login and authentication middleware
- Implement user profile and update endpoints
- Add tests for user registration

---

User integration is complete and functional.
