# Profile Management Setup & Testing Guide

## Features Implemented

### 1. Edit Profile Modal

- **File**: `src/components/layout/EditProfileModal.jsx`
- **Fields**: First Name, Last Name, Bio
- **Avatar Upload**: Backend-only (server-side Cloudinary)
- **API**: PUT `/api/auth/profile`

### 2. Change Password Modal

- **File**: `src/components/layout/ChangePasswordModal.jsx`
- **Fields**: Old Password, New Password, Confirm Password
- **Validation**: Password length >= 8, confirmation match
- **API**: POST `/api/auth/change-password`
- **Security**: Password visibility toggle, masked input

### 3. Avatar Upload via Backend

- **Integration**: Backend uploads to Cloudinary
- **Features**:
  - Preview before save
  - Max file size: 100MB
  - Supports: local upload

## Configuration Steps

### Step 1: Setup Cloudinary Account (Backend)

1. Create account at https://cloudinary.com
2. Go to **Console > Settings > Basic**
3. Copy your **Cloud Name**
4. Note your **API Key** and **API Secret**

### Step 2: Configure Backend Environment

1. Open backend `.env`
2. Fill in Cloudinary credentials:
   ```
   CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
3. Save file
4. Restart backend server

### Step 3: Verify Setup

1. Navigate to Account page (Settings)
2. Click "Edit Profile" button
3. Click "Upload Avatar" button
4. Verify file picker opens and upload succeeds

## Testing Checklist

### Edit Profile

- [ ] Navigate to Account page
- [ ] Click "Edit Profile" button → modal opens
- [ ] Update First Name, Last Name, Bio
- [ ] Click "Save Changes"
- [ ] Verify user data updates on page
- [ ] Refresh page - data persists

### Avatar Upload

- [ ] Click pencil icon on avatar OR "Change Avatar" in modal
- [ ] File picker opens
- [ ] Upload an image (local file)
- [ ] Avatar updates on page
- [ ] Close modal and reopen - avatar persists

### Change Password

- [ ] Click "CHANGE" button in Security section
- [ ] Modal opens with 3 password fields
- [ ] Enter: old password, new password, confirm
- [ ] Try mismatched passwords → error shows
- [ ] Try password < 8 chars → error shows
- [ ] Enter correct passwords → success message
- [ ] Modal closes, user stays on page
- [ ] Log out and log in with new password

### Error Scenarios

- [ ] Close file picker without uploading
- [ ] Submit form with validation errors
- [ ] Network error during save
- [ ] Invalid Cloudinary credentials on backend

## Backend Validation

### Profile Update Endpoint

```
PUT /api/auth/profile
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Software Engineer",
  "avatar_url": "https://res.cloudinary.com/..."
}

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Software Engineer",
  "avatar_url": "https://...",
  ...
}
```

### Avatar Upload Endpoint

```
POST /api/auth/profile/avatar
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

avatar: <file>

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Software Engineer",
  "avatar_url": "https://res.cloudinary.com/...",
  ...
}
```

### Change Password Endpoint

```
POST /api/auth/change-password
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword456!",
  "new_password_confirm": "NewPassword456!"
}

Response: 200 OK
{
  "message": "Password changed successfully. Please log in again."
}
```

## Troubleshooting

### Issue: File picker doesn't open

**Solution**:

- Check browser permissions or popup blockers
- Check browser console for errors

### Issue: Avatar upload fails

**Solution**:

- Verify backend Cloudinary credentials
- Check backend logs for upload errors
- Check network tab for POST request to `/api/auth/profile/avatar`

### Issue: Avatar doesn't update after upload

**Solution**:

- Check network tab for PUT request to `/api/auth/profile`
- Verify response contains new avatar_url
- Check browser console for React errors
- Try clearing browser cache and reload

### Issue: Password change fails

**Solution**:

- Verify current password is correct
- New password must be >= 8 characters
- New passwords must match in both fields
- Check network tab for POST request to `/api/auth/change-password`

## Files Modified

1. **New Files**:
   - `src/components/layout/EditProfileModal.jsx` - Edit profile form
   - `src/components/layout/ChangePasswordModal.jsx` - Change password form

2. **Modified Files**:
   - `src/pages/AccountPage.jsx` - Import modals, manage state
   - `src/components/layout/AccountProfileCard.jsx` - Display user data, click handlers
   - `src/components/layout/AccountSecurityPanel.jsx` - Add change password row
   - `src/components/ui/SecuritySettingRow.jsx` - Add onAction callback
   - `src/services/authService.js` - Add avatar upload API call
   - `src/services/api.js` - Allow multipart uploads
   - `index.html` - Remove Cloudinary Upload Widget script
   - `.env.local` - Remove Cloudinary config

3. **No Changes Needed**:
   - `src/context/AuthContext.jsx` - Already has updateUser function
   - Backend endpoints - Added avatar upload

## Next Steps (Optional Enhancements)

1. **Add profile picture crop editor** - Allow users to crop before upload
2. **Add bio character limit** - Show remaining characters
3. **Add email update** - Currently read-only
4. **Add profile visibility** - Public/Private profile setting
5. **Add session management UI** - Revoke specific devices
6. **Add 2FA setup** - Current UI is placeholder

## Deployed Features Summary

✅ **Phase 1**: Backend-frontend connection  
✅ **Phase 2**: Login with error handling  
✅ **Phase 3**: Logout functionality  
✅ **Phase 4**: Google OAuth 2.0  
✅ **Phase 5** (Current): **Profile Management**

- Edit profile (name, bio)
- Avatar upload via backend
- Change password with validation
- Real-time UI updates
