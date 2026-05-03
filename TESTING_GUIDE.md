# Profile Management - Step-by-Step Testing Guide

## Prerequisites

- Frontend running: `npm run dev` (port 5174 or 5173)
- Backend running: Django development server
- Cloudinary account created and backend `.env` configured with credentials

## Test Case 1: Edit Profile - Update Name & Bio

**Steps**:

1. Log in to the RAG application
2. Click "Settings" in left sidebar → Navigate to Account Settings page
3. In the profile card (left side), click the blue "Edit Profile" button
4. **Expected**: Edit Profile modal opens

**Form Verification**:

- [ ] First Name field pre-filled with current first name (or empty)
- [ ] Last Name field pre-filled with current last name (or empty)
- [ ] Bio field pre-filled with current bio
- [ ] Avatar preview shows current avatar

**Edit & Save**: 5. Clear First Name field and type: `John` 6. Clear Last Name field and type: `Developer` 7. Click in Bio field and type: `Full Stack Engineer | RAG Enthusiast` 8. Click "Save Changes" button 9. **Expected**:

- [ ] Loading state shows: "Saving..."
- [ ] Modal closes
- [ ] Profile card updates with new name: `John Developer`
- [ ] Bio shows: `Full Stack Engineer | RAG Enthusiast`

**Persistence**: 10. Refresh page (F5 or Cmd+R) 11. **Expected**: Profile data persists with updated values

---

## Test Case 2: Avatar Upload - Backend Integration

**Steps**:

1. From Account Settings page, click the **pencil icon** on the avatar
2. **Expected**: File picker opens

**Upload Image**: 3. Select a local image file 4. **Expected**:

- [ ] Upload completes
- [ ] Avatar image on page updates to new image
- [ ] Profile card shows new avatar

**Persistence**: 5. Refresh page 6. **Expected**: New avatar persists

---

## Test Case 3: Change Password

**Steps**:

1. From Account Settings page, scroll right to "Security Protocols" section
2. Click the blue "CHANGE" button next to "Change Password"
3. **Expected**: Change Password modal opens

**Password Visibility Toggle**: 4. Click eye icon next to "Current Password" field 5. **Expected**: Password becomes visible (not masked) 6. Click eye icon again 7. **Expected**: Password masked again

**Validation Test - Empty Fields**: 8. Leave all fields empty 9. Click "Change Password" button 10. **Expected**: Error message: "All fields are required"

**Validation Test - Password Mismatch**: 11. Enter: - Current Password: `YourCurrentPassword123` - New Password: `NewPassword456` - Confirm: `DifferentPassword789` 12. Click "Change Password" 13. **Expected**: Error message: "New passwords do not match"

**Validation Test - Short Password**: 14. Enter: - Current Password: `YourCurrentPassword123` - New Password: `short` - Confirm: `short` 15. Click "Change Password" 16. **Expected**: Error message: "New password must be at least 8 characters"

**Successful Password Change**: 17. Enter: - Current Password: `YourCurrentPassword123` (your actual current password) - New Password: `YourNewPassword456!` - Confirm: `YourNewPassword456!` 18. Click "Change Password" 19. **Expected**: - [ ] Loading state shows: "Changing..." - [ ] Success message shows: ✓ "Password changed successfully!" - [ ] Modal auto-closes after 1.5 seconds

**Verify Password Changed**: 20. Log out (click logout button in top right) 21. Try logging in with old password 22. **Expected**: Login fails (invalid credentials) 23. Log in with new password 24. **Expected**: Login succeeds, dashboard loads

---

## Test Case 4: Edit Avatar via Modal

**Steps**:

1. Click "Edit Profile" button
2. In the modal, next to avatar preview, click "Upload Avatar"
3. **Expected**: File picker opens
4. Upload an image
5. Upload completes, avatar in form updates
6. Update name and bio as well
7. Click "Save Changes"
8. **Expected**: Everything saves - avatar, name, bio all update

---

## Test Case 5: Modal Close Behavior

**Steps**:

1. Click "Edit Profile" button
2. Modal opens
3. Click the "X" button in top-right corner
4. **Expected**: Modal closes, no changes saved

**Verification**: 5. Click "Edit Profile" again 6. **Expected**: Form shows original values (not changed)

**Cancel Button Test**: 7. Modal is open 8. Update a field (e.g., name) 9. Click "Cancel" button 10. **Expected**: Modal closes, changes discarded

---

## Test Case 6: Error Handling

**Test Network Error**:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Edit Profile" and update name
4. While request is in-flight, right-click in Network tab → "Block" the request
5. Try to save
6. **Expected**: Error message shows about network/API failure

**Test Invalid Cloudinary Config**:

1. Remove or corrupt `CLOUDINARY_API_KEY` in backend `.env`
2. Restart backend server
3. Click avatar pencil icon and select a file
4. **Expected**: Error message: "Cloudinary not configured on server."

---

## Test Case 7: Multi-Tab Consistency

**Steps**:

1. Open Account Settings in Tab 1
2. Open Account Settings in Tab 2
3. In Tab 1, edit profile (name, bio, avatar) and save
4. Switch to Tab 2
5. **Expected**:
   - [ ] Tab 2 still shows old data (since it's not refreshed)
   - [ ] Refresh Tab 2 (F5)
   - [ ] New data appears

---

## Browser Console Debugging

While testing, keep browser console open (F12) to check:

**Successful Profile Update**:

```
✓ PUT /api/auth/profile - 200 OK
User data updated in localStorage
AuthContext updateUser called
```

**Successful Password Change**:

```
✓ POST /api/auth/change-password - 200 OK
Success response received
```

**Avatar Upload**:

```
✓ POST /api/auth/profile/avatar - 200 OK
✓ Upload successful
✓ Secure URL returned: https://res.cloudinary.com/...
```

---

## Expected UI Behavior After All Tests Pass

### Profile Card Should Show:

- ✓ Real avatar image from latest upload
- ✓ Correct first name + last name
- ✓ Correct bio
- ✓ Correct email address
- ✓ Badge indicators (PRO RESEARCHER, ARCHIVE ADMIN)
- ✓ Edit Profile button

### Security Section Should Show:

- ✓ Two-Factor Authentication toggle
- ✓ Change Password row with CHANGE button
- ✓ Active Sessions row with REVOKE ALL button

### No Hardcoded Values:

- ✗ Should NOT show "Dr. Elias Vance"
- ✗ Should NOT show "elias.vance@cognitiveslate.ai"
- ✓ Should show actual logged-in user's data

---

## Quick Test Checklist

```
EDIT PROFILE
- [ ] Modal opens
- [ ] Form fields pre-filled
- [ ] Can edit first name
- [ ] Can edit last name
- [ ] Can edit bio
- [ ] Save works
- [ ] Data persists after refresh

AVATAR UPLOAD
- [ ] Pencil icon opens file picker
- [ ] Can upload image
- [ ] Avatar updates on page
- [ ] Avatar persists after refresh

CHANGE PASSWORD
- [ ] Modal opens
- [ ] Visibility toggle works
- [ ] Validation catches errors
- [ ] Can change password
- [ ] Old password doesn't work
- [ ] New password works
- [ ] Modal closes on success

ERROR HANDLING
- [ ] Shows errors clearly
- [ ] No console errors
- [ ] Graceful failure on network issues
```

---

## Rollback Steps (If Something Goes Wrong)

If you encounter issues:

1. **Clear localStorage**:

   ```javascript
   // In browser console
   localStorage.clear();
   location.reload();
   ```

2. **Check Backend Cloudinary Config**:

   ```text
   # In backend .env
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

3. **Restart Dev Server**:

   ```bash
   npm run dev
   ```

4. **Check Backend Endpoints**:
   ```bash
   # From project root, test endpoints:
   curl -X GET http://localhost:8000/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## Summary

All features work when:

- ✅ Modal opens and closes smoothly
- ✅ Forms validate input correctly
- ✅ API calls succeed (check Network tab)
- ✅ UI updates match API responses
- ✅ Data persists across page refreshes
- ✅ No console errors
- ✅ Avatar upload works

**Estimated Testing Time**: 15-20 minutes for complete coverage
