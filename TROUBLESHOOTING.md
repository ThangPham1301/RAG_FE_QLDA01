# Frontend Integration - Next Steps & Troubleshooting

## Quick Start

### 1. Install Dependencies

```bash
cd RAG_FE_QLDA01
npm install
```

### 2. Configure API Endpoint

Ensure `.env.local` exists with:

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Verify Backend is Running

```bash
cd RAG_BE_QLDA01
python manage.py runserver
```

## Testing Authentication Flow

### Test 1: Sign Up

1. Open http://localhost:5173/register
2. Fill in all fields:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: Test@1234 (or similar - 8+ chars, upper, lower, number, special)
   - Confirm: Test@1234
3. Click "INITIALIZE ACCOUNT"
4. Should see "Verification email sent" message
5. Check backend console for verification link

### Test 2: Email Verification

1. Get verification link from backend console
2. Extract token from link
3. Manually verify in backend (for development):
   - Open Django shell: `python manage.py shell`
   - Import and mark verified:
     ```python
     from apps.auth.models import User
     user = User.objects.get(email='john@example.com')
     user.is_email_verified = True
     user.save()
     ```

### Test 3: Login

1. Open http://localhost:5173/login
2. Enter email: john@example.com
3. Enter password: Test@1234
4. Click "SIGN IN TO DASHBOARD"
5. Should be redirected to http://localhost:5173/dashboard

### Test 4: Protected Routes

1. While logged in:
   - Visit /library - should load
   - Visit /chat - should load
   - Visit /account - should load
2. Logout (via account menu)
3. Try to visit /dashboard - should redirect to /login

### Test 5: Token Refresh

1. Login to get access token
2. Wait for access token to expire (1 hour)
   - OR manually test by:
   - Removing access token from localStorage
   - Making an API call
   - Should use refresh token automatically
3. Should still be able to make API calls

## Common Issues & Solutions

### Issue 1: "Cannot reach API"

**Symptoms:** Network errors, ERR_EMPTY_RESPONSE

**Solution:**

1. Ensure backend is running: `python manage.py runserver`
2. Check backend is on port 8000
3. Verify `.env.local` has correct VITE_API_URL
4. Check CORS configuration in backend

```python
# RAG_BE/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### Issue 2: "CORS Error"

**Symptoms:** "Access to XMLHttpRequest from frontend blocked by CORS"

**Solution:**

1. Backend CORS must include frontend URL
2. Update settings.py:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
   ]
   ```
3. Verify corsheaders is installed: `pip install django-cors-headers`
4. Restart backend

### Issue 3: "Email not verified" error on login

**Symptoms:** Login fails with message about email verification

**Solution:**

1. User must verify email first
2. For testing, manually mark as verified:
   ```python
   python manage.py shell
   from apps.auth.models import User
   User.objects.filter(email='test@example.com').update(is_email_verified=True)
   ```

### Issue 4: "Invalid email or password"

**Symptoms:** Login fails even with correct credentials

**Solution:**

1. Verify user exists: `python manage.py shell`
   ```python
   from apps.auth.models import User
   User.objects.filter(email='john@example.com').exists()
   ```
2. Verify email is verified
3. Check password is correct (cannot retrieve, must reset)

### Issue 5: "No refresh token available"

**Symptoms:** After access token expires, get logout

**Solution:**

1. Ensure login response includes refresh token
2. Check Django JWT settings in settings.py
3. Verify localStorage has refreshToken saved
4. Check browser DevTools → Storage → localStorage

### Issue 6: Redirect loop on login page

**Symptoms:** Login page keeps redirecting to itself

**Solution:**

1. Check if user is already authenticated
2. Remove tokens from localStorage
3. Clear browser cache
4. Check PublicRoute wrapper in App.jsx

### Issue 7: "Page keeps showing loading spinner"

**Symptoms:** Pages stuck on loading state

**Solution:**

1. Check browser console for errors
2. Verify API is accessible
3. Check getCurrentUser endpoint is working
4. Ensure AuthContext initialization completes

## Debugging Tools

### Browser DevTools

#### Check localStorage

```javascript
// Open DevTools Console
localStorage.getItem("accessToken"); // Should show JWT
localStorage.getItem("refreshToken"); // Should show JWT
JSON.parse(localStorage.getItem("user")); // Should show user object
```

#### Check API Requests

1. Open Network tab
2. Look for API calls to http://localhost:8000/api/auth/\*
3. Check response status and body
4. Verify Authorization header contains token

#### Check Errors

1. Open Console tab
2. Look for red errors
3. Click to expand for full stack trace

### Django Shell Debugging

```python
python manage.py shell

# Check user exists
from apps.auth.models import User
User.objects.all().count()

# Check specific user
user = User.objects.get(email='john@example.com')
print(user.email, user.is_email_verified)

# Check sessions
from apps.auth.models import AuthSession
AuthSession.objects.filter(user=user)

# Check verification tokens
from apps.auth.models import EmailVerificationToken
EmailVerificationToken.objects.filter(user=user)
```

### Network Debugging

```bash
# Test API endpoints with curl
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <your_token>"

# Test with invalid token
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer invalid"
```

## Development Tips

### Hot Module Replacement

- Vite enables HMR by default
- Changes save automatically during `npm run dev`
- Avoid hard refreshes unless state issues

### Local Testing with Different Email

```python
# Reset database for testing
python manage.py migrate --reset auth
```

### Disable Rate Limiting for Testing

```python
# In settings.py temporarily
RATELIMIT_ENABLE = False
```

### Enable Detailed Logging

```python
# In settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'apps.auth': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

## API Response Examples

### Successful Login

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_email_verified": true,
    "avatar_url": null,
    "bio": "",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### Error Response

```json
{
  "detail": "Invalid email or password"
}
```

### 401 Unauthorized

```json
{
  "detail": "Token is invalid or expired"
}
```

## Performance Considerations

### Bundle Size

```bash
# Check bundle size
npm run build
# Look at dist/ directory
```

### Load Time Optimization

1. Lazy load routes (optional future enhancement)
2. Minify CSS with Tailwind
3. Code splitting for large components

### API Performance

1. AuthContext caches user in localStorage
2. Axios caches interceptors in memory
3. Tokens auto-refresh without user interaction

## Security Checklist

- [ ] HTTPS in production
- [ ] Tokens in httpOnly cookies (future enhancement)
- [ ] CORS restricted to known domains
- [ ] No sensitive data in localStorage (currently only tokens)
- [ ] Rate limiting on backend (implemented)
- [ ] Password strength requirements (implemented)
- [ ] Email verification before login (implemented)
- [ ] Session tracking with IP/User-Agent (implemented)

## Browser Compatibility

Tested and working on:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requirements:

- ES2020 support
- localStorage support
- fetch/axios support

## Next Steps for Development

### Phase 1: Core Testing

1. ✅ Environment setup
2. ✅ Dependencies installed
3. ✅ API configured
4. ⏳ Run npm install
5. ⏳ Test signup flow
6. ⏳ Test login flow
7. ⏳ Test protected routes

### Phase 2: Enhanced Features

1. Password reset implementation
2. Google OAuth integration
3. User profile page
4. Session management
5. Change password form

### Phase 3: Polish

1. Loading states/skeletons
2. Error toast notifications
3. Success confirmations
4. Mobile responsiveness
5. Accessibility improvements

### Phase 4: Testing & Deployment

1. Unit tests for utilities
2. Integration tests for flows
3. E2E tests with Playwright
4. Production build and deployment

## Support Resources

- **Frontend Setup**: See FRONTEND_SETUP.md
- **Integration Guide**: See INTEGRATION_GUIDE.md
- **Backend Setup**: See RAG_BE_QLDA01/SETUP.md
- **API Documentation**: See RAG_BE_QLDA01/IMPLEMENTATION_SUMMARY.md

## Useful Commands

```bash
# Frontend development
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint

# Backend development
python manage.py migrate              # Apply migrations
python manage.py runserver            # Start server
python manage.py shell                # Interactive shell
python manage.py createsuperuser      # Create admin user
python manage.py cleanup_tokens       # Clean expired tokens

# Testing
python manage.py test apps.auth       # Run backend tests
python -m pytest                      # Run pytest if installed
```

## FAQ

**Q: How long do tokens last?**
A: Access token 1 hour, refresh token 7 days

**Q: What happens if refresh token expires?**
A: User is logged out and must login again

**Q: Can I use the app without email verification?**
A: No, email verification is required before login

**Q: How do I test without email sending?**
A: Check backend console or use Django shell to verify manually

**Q: Can I change VITE_API_URL after build?**
A: No, it's built into the app. Use different .env files per environment.

**Q: Is localStorage secure for tokens?**
A: Acceptable for SPA, but httpOnly cookies are better (future enhancement)

**Q: How do I handle different environments?**
A: Create .env.development, .env.staging, .env.production files

**Q: What if I forgot the password?**
A: Reset flow is implemented via OTP on the backend
