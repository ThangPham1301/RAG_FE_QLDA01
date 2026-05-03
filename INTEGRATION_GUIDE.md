# Frontend-Backend Integration Guide

This document provides a complete guide for integrating the React frontend with the Django backend authentication system.

## Overview

The frontend and backend are now fully integrated with:

- JWT-based authentication with token refresh
- Protected routes with automatic redirection
- Global auth state management with React Context
- Axios HTTP client with automatic interceptors
- Comprehensive error handling
- Email verification and OTP flows

## Files Modified/Created

### Frontend Changes

#### New Service Layer

- **src/services/api.js** - Axios instance with JWT interceptors
- **src/services/authService.js** - Authentication API methods
- **src/utils/auth.js** - Auth utilities and validation helpers

#### New Context

- **src/context/AuthContext.jsx** - Global auth state management with hooks

#### New Components

- **src/components/ProtectedRoute.jsx** - Protected and public route wrappers

#### Updated UI Components

- **src/components/ui/TextInput.jsx** - Added controlled input support
- **src/components/ui/FormInputField.jsx** - Added controlled input support
- **src/components/ui/PrimaryButton.jsx** - Added loading state and onClick

#### Updated Form Panels

- **src/components/layout/LoginPanel.jsx** - Fully integrated with API
- **src/components/layout/RegisterFormPanel.jsx** - Fully integrated with API

#### Updated Routing

- **src/App.jsx** - Added AuthProvider, ProtectedRoute, PublicRoute

#### Environment Configuration

- **.env.local** - API endpoint configuration
- **package.json** - Added axios dependency

## API Endpoints Connected

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/google/callback` - Google OAuth login
- `POST /api/auth/request-otp` - Request OTP code
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/sessions` - List active sessions
- `POST /api/auth/token/refresh` - Refresh access token

## Authentication Flow

### 1. Sign Up Flow

```
User fills form
    ↓
POST /api/auth/signup
    ↓
Verification email sent
    ↓
User clicks link or verifies manually
    ↓
Email marked as verified
    ↓
User can login
```

### 2. Login Flow

```
User enters email/password
    ↓
POST /api/auth/login
    ↓
Backend validates and returns tokens
    ↓
Tokens stored in localStorage
    ↓
User redirected to /dashboard
    ↓
ProtectedRoute verifies auth before rendering
```

### 3. Protected Route Flow

```
User accesses /dashboard
    ↓
ProtectedRoute checks isAuthenticated
    ↓
If authenticated: render page
If not authenticated: redirect to /login
    ↓
Loading state shown while checking auth
```

### 4. Token Refresh Flow

```
User requests resource
    ↓
Axios adds access token to request
    ↓
If token expired: intercept 401 response
    ↓
Use refresh token to get new access token
    ↓
Retry original request with new token
    ↓
If refresh fails: logout user
```

## Key Implementation Details

### JWT Token Storage

Tokens are stored in localStorage for persistence across page reloads:

```javascript
localStorage.setItem("accessToken", tokens.access); // 1 hour expiry
localStorage.setItem("refreshToken", tokens.refresh); // 7 days expiry
localStorage.setItem("user", JSON.stringify(userData)); // User object
```

### Axios Interceptors

Automatically add JWT token to all requests:

```javascript
// Request interceptor
Authorization: Bearer <accessToken>

// Response interceptor
On 401: Refresh token → Retry request → If refresh fails: Logout
```

### React Context Authentication

Global state accessible via `useAuth()` hook:

```javascript
const { user, isAuthenticated, loading, login, logout, setError } = useAuth();
```

### Controlled Form Inputs

All form inputs must have state:

```javascript
const [email, setEmail] = useState('')
<TextInput value={email} onChange={setEmail} />
```

### Error Handling

Errors are caught and displayed to users:

```javascript
try {
  const response = await login(email, password);
} catch (err) {
  const message = err.response?.data?.detail || err.message;
  setError(message);
}
```

## Configuration

### Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=RAG Application
```

### Backend CORS Configuration

Backend must have CORS enabled for frontend URL:

```python
# RAG_BE/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Frontend dev server
    "http://localhost:3000",  # Alternative port
    "https://yourdomain.com", # Production
]
```

## Testing the Integration

### 1. Start Backend

```bash
cd RAG_BE_QLDA01
python manage.py migrate
python manage.py runserver
```

### 2. Start Frontend

```bash
cd RAG_FE_QLDA01
npm install
npm run dev
```

### 3. Test Sign Up

1. Go to http://localhost:5173/register
2. Fill form with test data
3. Click "REQUEST ACCESS"
4. Check backend console for verification link
5. Copy token and paste in browser

### 4. Test Login

1. Go to http://localhost:5173/login
2. Enter email and password from signup
3. Click "SIGN IN"
4. Should be redirected to /dashboard

### 5. Test Protected Route

1. While logged in, go to /dashboard (should work)
2. Logout via account menu
3. Try to access /dashboard (should redirect to /login)

### 6. Test Token Refresh

1. Login to get tokens
2. Wait 1 hour (or manually expire token)
3. Make an API request
4. Token should refresh automatically
5. API call should succeed

## Common Issues

### Issue: CORS Error

**Solution:** Ensure backend has CORS configured for frontend URL

### Issue: 401 Unauthorized

**Solution:** Check if token is in localStorage and not expired

### Issue: "No refresh token available"

**Solution:** Ensure login response includes refresh token, check localStorage

### Issue: Redirect loop on login/register

**Solution:** Check if AuthProvider is wrapping Routes in App.jsx

### Issue: API base URL not working

**Solution:** Check VITE_API_URL in .env.local matches backend URL

## API Response Format

### Success Response (2xx)

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_email_verified": true,
    "avatar_url": null,
    "bio": "",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Error Response (4xx/5xx)

```json
{
  "detail": "Invalid email or password",
  "code": "invalid_credentials"
}
```

## Next Steps

### Implement Additional Features

1. **Password Reset** - Create forgot password page
2. **Google OAuth** - Integrate Google login button
3. **User Profile** - Create profile edit page
4. **Session Management** - List and manage active sessions
5. **Change Password** - Create change password form

### Enhance UI

1. **Loading States** - Add spinners for async operations
2. **Toast Notifications** - Show success/error messages
3. **Modals** - Confirm logout, verify email
4. **Responsive Design** - Mobile and tablet support

### Add Testing

1. **Unit Tests** - Test utilities and components
2. **Integration Tests** - Test API integration
3. **E2E Tests** - Test complete user flows

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    React App (App.jsx)              │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │        AuthProvider (AuthContext)             │   │
│  ├──────────────────────────────────────────────┤   │
│  │ State: user, tokens, loading, error          │   │
│  │ Methods: login, logout, updateUser            │   │
│  │                                               │   │
│  │  ┌──────────────────────────────────────┐    │   │
│  │  │      Routes                          │    │   │
│  │  ├──────────────────────────────────────┤    │   │
│  │  │ - PublicRoute (/login, /register)   │    │   │
│  │  │ - ProtectedRoute (/dashboard, etc.) │    │   │
│  │  │                                      │    │   │
│  │  │  ┌──────────────────────────────┐  │    │   │
│  │  │  │  Page Components             │  │    │   │
│  │  │  ├──────────────────────────────┤  │    │   │
│  │  │  │ - LoginPanel                 │  │    │   │
│  │  │  │ - RegisterFormPanel          │  │    │   │
│  │  │  │ - DashboardPage              │  │    │   │
│  │  │  │ - etc.                       │  │    │   │
│  │  │  └──────────────────────────────┘  │    │   │
│  │  │                                     │    │   │
│  │  │  ┌──────────────────────────────┐  │    │   │
│  │  │  │  UI Components               │  │    │   │
│  │  │  ├──────────────────────────────┤  │    │   │
│  │  │  │ - TextInput                  │  │    │   │
│  │  │  │ - FormInputField             │  │    │   │
│  │  │  │ - PrimaryButton              │  │    │   │
│  │  │  │ - SocialButton               │  │    │   │
│  │  │  └──────────────────────────────┘  │    │   │
│  │  └──────────────────────────────────┘    │   │
│  └──────────────────────────────────────────┘   │
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │      Services & Utilities                    │   │
│  ├──────────────────────────────────────────────┤   │
│  │ - apiClient (Axios with interceptors)       │   │
│  │ - authService (API methods)                 │   │
│  │ - auth utils (validation, helpers)          │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
└─────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────────────────────┐
        │   Django Backend API (8000)   │
        ├───────────────────────────────┤
        │ - Authentication              │
        │ - User Management             │
        │ - Sessions & Tokens           │
        │ - Email Verification          │
        │ - Password Reset              │
        └───────────────────────────────┘
                        ↓
        ┌───────────────────────────────┐
        │    PostgreSQL Database        │
        ├───────────────────────────────┤
        │ - Users                       │
        │ - Sessions                    │
        │ - Tokens                      │
        │ - Verification Tokens         │
        └───────────────────────────────┘
```

## Summary

The frontend is now fully integrated with the Django backend. All authentication endpoints are connected, protected routes are implemented, and global state management is in place. Users can:

1. Sign up with email and password
2. Verify their email
3. Login with verified email
4. Access protected pages
5. Auto-refresh tokens on expiry
6. Logout from all sessions

The integration follows React best practices with controlled components, proper error handling, and clear separation of concerns.
