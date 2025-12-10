# Authentication System Restored

## Overview
The login/signup authentication system has been restored with secure event handling (no inline event handlers).

## How It Works

### 1. **index.html** - Login/Signup Page
- Users see a login/signup form when they first visit
- Can create a new account with: Name, Email, Password
- Or log in with existing Email + Password
- Accounts stored in browser localStorage
- No inline event handlers (secure implementation)

### 2. **home.html** - Product Store (Protected)
- Requires user to be logged in
- Shows full product catalog, search, filters, cart, wallet
- Header displays logged-in user's name
- "Logout" button redirects back to login page
- Clears session when logging out

## Features

✅ **User Registration**
- Create new account with name, email, password
- Password confirmation required
- Prevents duplicate email registration
- Validation for 6+ character passwords

✅ **User Login**
- Login with email and password
- Invalid credentials show error message
- Successful login redirects to product store

✅ **Session Management**
- Stores `currentUser` in localStorage
- Stores `LS_SESSION_KEY` with user info and timestamp
- Authentication check on page load
- Redirects to login if not authenticated

✅ **Logout**
- Logout button in home.html header
- Clears all session data
- Redirects to login page

✅ **Secure Implementation**
- No inline event handlers (onclick, onchange, etc.)
- All events use addEventListener pattern
- CSP headers present
- No sensitive data in code

## File Structure

```
index.html              → Login/Signup page (entry point)
home.html              → Product store (protected, requires login)
home.js                → Product functionality + auth checks
checkout.js            → Cart/checkout operations
index_product_store.html → Backup of product store
```

## Local Storage

**Users array:**
```json
{
  "id": 1733770000,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "createdAt": "2025-12-10T..."
}
```

**Current user:**
```json
{
  "id": 1733770000,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Session key:**
```json
{
  "userEmail": "john@example.com",
  "userId": 1733770000,
  "timestamp": 1733770000000
}
```

## Testing

**Test Login/Signup Flow:**
1. Go to site → sees login page
2. Click "Sign Up" tab
3. Enter name, email, password, confirm password
4. Click "Create Account"
5. Should redirect to product store
6. Logout button appears in header with user name
7. Click logout → back to login page

**Test Protected Route:**
1. Try to access home.html directly without logging in
2. Should redirect to index.html (login page)

## Security Notes

⚠️ **Important:** This is a **demo authentication system**
- Passwords are stored in plaintext (use hashing in production)
- localStorage is not encrypted (not suitable for real secrets)
- No backend server (data lost if browser cleared)

## Future Improvements

For production, consider:
- Backend server for authentication
- Password hashing (bcrypt, Argon2)
- JWT tokens or sessions
- Encrypted localStorage
- Email verification
- Password reset flow
- Rate limiting on login attempts
- Remember me functionality

## Deploy

Site is live at: https://kormancarter.github.io/electronic-store-ai/
- index.html = Login page
- home.html = Product store
- Fully functional with no inline event handlers
