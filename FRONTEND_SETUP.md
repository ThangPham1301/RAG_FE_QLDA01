# RAG Frontend - React + Vite

Modern React frontend for the RAG application with authentication, protected routes, and comprehensive API integration.

## Technology Stack

- **React 19** - UI library
- **Vite 5** - Build tool and dev server
- **React Router 7.14.1** - Client-side routing
- **Tailwind CSS 4.2.3** - Utility-first CSS framework
- **Lucide React 1.8.0** - Icon library
- **Axios 1.6.5** - HTTP client with JWT interceptors
- **Node.js >=18** - Runtime

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── layout/          # Page layout components
│   │   ├── LoginPanel.jsx
│   │   ├── RegisterFormPanel.jsx
│   │   └── ...
│   └── ui/              # Reusable UI components
│       ├── TextInput.jsx
│       ├── FormInputField.jsx
│       ├── PrimaryButton.jsx
│       └── ...
├── context/             # React Context API
│   └── AuthContext.jsx   # Global auth state management
├── pages/               # Page components
│   ├── AuthPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   └── ...
├── services/            # API client and services
│   ├── api.js           # Axios instance with interceptors
│   └── authService.js   # Authentication API methods
├── utils/               # Utility functions
│   └── auth.js          # Auth helpers and validation
└── App.jsx              # Main app component with routing
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=RAG Application
```

**Environment Variables:**

- `VITE_API_URL` - Backend API base URL (default: http://localhost:8000/api)
- `VITE_APP_NAME` - Application name for display

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## Features

### Authentication

- **Sign Up** - Email registration with password validation
- **Login** - Email/password authentication with JWT tokens
- **Google OAuth** - Social login integration
- **Email Verification** - Mandatory email verification before login
- **Password Reset** - OTP-based password reset flow
- **Forgot Password** - Request password reset via email
- **Logout** - Revoke all sessions

### Protected Routes

- Auto-redirect unauthenticated users to login
- Auto-redirect authenticated users away from login/register pages
- Loading state while checking authentication

### API Integration

- **Axios HTTP Client** - Configured with base URL and interceptors
- **JWT Authentication** - Automatic token injection in requests
- **Token Refresh** - Auto-refresh expired access tokens
- **Error Handling** - Centralized error handling with automatic logout on 401

### Form Validation

- **Email Validation** - Valid email format checking
- **Password Validation** - Strength requirements enforcement
- **Password Matching** - Confirm password validation
- **Real-time Feedback** - Password strength indicator, error messages

### Components

#### Authentication Components

- **TextInput** - Controlled text input with label, helper, error states
- **FormInputField** - Styled form input with validation indicator
- **PrimaryButton** - CTA button with loading state
- **SocialButton** - Social login buttons

#### Layout Components

- **LoginPanel** - Login form with email/password, forgot password, social logins
- **RegisterFormPanel** - Registration form with password strength indicator
- **ProtectedRoute** - Route wrapper for authentication protection
- **PublicRoute** - Route wrapper for public-only pages

## API Integration

### Available Services

```javascript
// Authentication API methods (src/services/authService.js)
signUp(data)                          // Register new user
verifyEmail(token)                    // Verify email with token
login(email, password)                // Login with credentials
googleLogin(idToken, accessToken)     // Login with Google
requestOTP(email, purpose)            // Request OTP code
verifyOTP(email, otp, purpose)        // Verify OTP code
requestPasswordReset(email)           // Request password reset
confirmPasswordReset(token, password) // Confirm reset with new password
getCurrentUser()                      // Fetch current user data
updateProfile(data)                   // Update user profile
changePassword(old, new, confirm)     // Change password
getSessions()                         // List active sessions
logout()                              // Logout all sessions
logoutDevice(sessionId)               // Logout specific device
refreshToken()                        // Refresh access token
```

## Authentication Flow

### Sign Up Flow

1. User fills registration form
2. Submits signup data to backend
3. Backend sends verification email
4. User clicks link in email (or enters token)
5. Email is verified
6. User can now login

### Login Flow

1. User enters email and password
2. Backend validates credentials
3. Backend checks if email is verified
4. Backend creates JWT tokens and session
5. Tokens stored in localStorage
6. User redirected to dashboard

### Token Refresh Flow

1. Access token has 1-hour expiry
2. When token expires, axios interceptor catches 401
3. Refresh token used to get new access token
4. New tokens stored in localStorage
5. Original request retried with new token
6. If refresh fails, user logged out

## Environment Configuration

### Development

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=RAG Application
```

### Production

```env
VITE_API_URL=https://api.production.com/api
VITE_APP_NAME=RAG Application
```

## Debugging

### Check Authentication State

```javascript
// In browser console
localStorage.getItem("accessToken"); // Get access token
localStorage.getItem("refreshToken"); // Get refresh token
localStorage.getItem("user"); // Get user JSON
```

### Monitor API Requests

- Open DevTools Network tab
- Look for API requests to see headers and responses
- JWT token should be in `Authorization: Bearer <token>` header

### Common Issues

1. **CORS Error** - Ensure backend has CORS configured for frontend URL
2. **401 Errors** - Token may be expired; check browser storage
3. **Network Errors** - Check if backend is running and `VITE_API_URL` is correct
4. **Email Verification** - In development, check backend console for verification link

## Testing Authentication

### Manual Testing Flow

1. **Sign Up**

   ```
   GET http://localhost:5173/register
   Fill form with test email and password
   Click "REQUEST ACCESS"
   ```

2. **Verify Email**
   - Check backend console for verification link
   - Copy token and paste in browser
   - Or use API directly

3. **Login**

   ```
   GET http://localhost:5173/login
   Enter email and password from signup
   Click "SIGN IN"
   ```

4. **Protected Routes**

   ```
   GET http://localhost:5173/dashboard (should work if logged in)
   GET http://localhost:5173/login (should redirect to dashboard if logged in)
   ```

5. **Logout**
   - Click account menu
   - Click "Logout"
   - Should be redirected to login page

## Code Standards

### Controlled Components

All form inputs must be controlled components with state:

```javascript
const [email, setEmail] = useState('')
<TextInput value={email} onChange={setEmail} />
```

### Error Handling

Errors should be caught and displayed to users:

```javascript
try {
  const response = await login(email, password);
  // Success handling
} catch (err) {
  setError(err.response?.data?.detail || err.message);
}
```

### localStorage Usage

- `accessToken` - JWT access token (1 hour expiry)
- `refreshToken` - JWT refresh token (7 days expiry)
- `user` - Stringified user object

### API Calls

Always use auth service methods, not axios directly:

```javascript
// Good
import { login } from '@/services/authService'
const response = await login(email, password)

// Avoid
import apiClient from '@/services/api'
const response = await apiClient.post('/auth/login', {...})
```

## Deployment

### Build

```bash
npm run build
```

Output will be in `dist/` directory.

### Serve

```bash
npm run preview
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

Build and run:

```bash
docker build -t rag-fe .
docker run -p 5173:5173 rag-fe
```

## Support

For issues or questions:

1. Check browser console for errors
2. Check backend logs for API errors
3. Verify `.env.local` configuration
4. Ensure backend is running on correct port
