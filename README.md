# Authentication System - Clean Architecture

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust authentication system built with **Node.js**, **Express**, and **MongoDB**, following the **Clean Architecture** principles. This project provides a secure and scalable foundation for managing user authentication and authorization.

---

## 🚀 Key Features

- **User Authentication**: Secure register, login, and logout.
- **OTP Verification**: Email-based One-Time Password for account verification and password reset.
- **Password Management**: Forgot password functionality with OTP.
- **Security**:
  - JWT (JSON Web Tokens) for stateless authentication.
  - BCrypt for secure password hashing.
  - Helmet for security headers.
  - Rate limiting to prevent brute-force attacks.
  - CORS configuration.
  - Input validation using Express Validator.
- **Clean Architecture**: Decoupled layers for business logic, data access, and transport.
- **Graceful Shutdown**: Properly handles process termination signals (SIGINT, SIGTERM).
- **Comprehensive Logging**: Winston logger for structured logs.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JSON Web Token (JWT)](https://jwt.io/)
- **Security**: `bcryptjs`, `helmet`, `express-rate-limit`
- **Validation**: `express-validator`
- **Mailing**: `nodemailer`
- **Logging**: `winston`, `morgan`

---

## 📂 Project Structure

```text
src/
├── config/         # Server, Database, and Mail configurations
├── controllers/    # Express controllers (Entry points)
├── entities/       # Domain business logic & plain objects
├── middlewares/    # Custom Express middlewares (Auth, Error, Validation)
├── models/         # Mongoose schemas/models
├── repositories/   # Data access layer (Abstraction over Mongoose)
├── routes/         # Express API route definitions
├── services/       # External service integrations (Email)
├── use-cases/      # Core application business logic
├── utils/          # Helper functions & Utilities (Logger, Error types)
└── server.js       # App entry point & initialization
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)

### 2. Clone the repository
```bash
git clone <repository-url>
cd Clean_Architecture
```

### 3. Install dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/auth-db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_EXPIRE=1d
JWT_REFRESH_EXPIRE=7d

# Mail (Nodemailer)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
MAIL_FROM=noreply@example.com

# Security
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 5. Running the Application
- **Development mode**:
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

---

## 🛤️ API Endpoints

### Health Check
- `GET /health` - Check if the server is healthy.

### Authentication (`/api/auth`)
- `POST /register` - Register a new user.
- `POST /login` - Login and receive tokens.
- `POST /logout` - Logout (requires authentication).
- `POST /forgot-password` - Request a password reset OTP.
- `POST /verify-otp` - Verify OTP for account activation or reset.

### User Management (`/api/users`)
- `GET /me` - Get current user profile (requires authentication).
- `PATCH /me` - Update current user profile.
- `GET /admin/dashboard` - Admin-only dashboard access.

---

## 📜 License
This project is licensed under the MIT License.
# Clean-Architecture
