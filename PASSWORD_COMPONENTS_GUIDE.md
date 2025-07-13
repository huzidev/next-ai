# Password Components Usage Guide

This document explains how to use the reusable password components in the authentication system.

## Components

### 1. PasswordInput
A single password input field with show/hide functionality.

```tsx
import PasswordInput from "@/components/auth/PasswordInput";

<PasswordInput
  id="password"
  name="password"
  label="Password"
  placeholder="Enter your password"
  value={password}
  onChange={handlePasswordChange}
  required={true}
  showMismatchError={false}
  mismatchErrorMessage="Custom error message"
/>
```

### 2. PasswordFields
A compound component that handles both password and confirm password fields.

```tsx
import PasswordFields from "@/components/auth/PasswordFields";

<PasswordFields
  password={formData.password}
  confirmPassword={formData.confirmPassword}
  onPasswordChange={handlePasswordChange}
  onConfirmPasswordChange={handleConfirmPasswordChange}
  passwordsMatch={passwordsMatch}
  required={true}
  showPasswordRequirements={true}
  passwordLabel="New Password"
  confirmPasswordLabel="Confirm New Password"
  passwordPlaceholder="Create a new password"
  confirmPasswordPlaceholder="Confirm your new password"
/>
```

## Props

### PasswordInput Props
- `id`: string - HTML id attribute
- `name`: string - HTML name attribute
- `label`: string - Label text
- `placeholder`: string - Placeholder text
- `value`: string - Current value
- `onChange`: function - Change handler
- `required`: boolean (optional) - Whether field is required
- `showMismatchError`: boolean (optional) - Show error state
- `mismatchErrorMessage`: string (optional) - Custom error message
- `className`: string (optional) - Additional CSS classes

### PasswordFields Props
- `password`: string - Password value
- `confirmPassword`: string - Confirm password value
- `onPasswordChange`: function - Password change handler
- `onConfirmPasswordChange`: function - Confirm password change handler
- `passwordsMatch`: boolean (optional) - Whether passwords match
- `required`: boolean (optional) - Whether fields are required
- `showPasswordRequirements`: boolean (optional) - Show password requirements
- `passwordLabel`: string (optional) - Custom password label
- `confirmPasswordLabel`: string (optional) - Custom confirm password label
- `passwordPlaceholder`: string (optional) - Custom password placeholder
- `confirmPasswordPlaceholder`: string (optional) - Custom confirm password placeholder
- `className`: string (optional) - Additional CSS classes

## CSS Classes

The components use the following CSS classes defined in `globals.css`:

- `.password-input-container` - Container for password input
- `.password-input-field` - Password input field styling
- `.password-toggle-button` - Show/hide password button
- `.password-mismatch-container` - Container for mismatch error
- `.password-mismatch-message` - Error message styling
- `.password-mismatch-icon` - Error icon styling

## Example Implementation

```tsx
const [formData, setFormData] = useState({
  password: "",
  confirmPassword: "",
});
const [passwordsMatch, setPasswordsMatch] = useState(true);

const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newFormData = {
    ...formData,
    password: e.target.value,
  };
  setFormData(newFormData);
  
  setPasswordsMatch(
    e.target.value === formData.confirmPassword ||
    formData.confirmPassword === ""
  );
};

const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newFormData = {
    ...formData,
    confirmPassword: e.target.value,
  };
  setFormData(newFormData);
  
  setPasswordsMatch(e.target.value === formData.password);
};

// In your JSX:
<PasswordFields
  password={formData.password}
  confirmPassword={formData.confirmPassword}
  onPasswordChange={handlePasswordChange}
  onConfirmPasswordChange={handleConfirmPasswordChange}
  passwordsMatch={passwordsMatch}
  required={true}
/>
```

## Files Updated

The following files have been updated to use these reusable components:

1. `/src/pages/auth/user/signup/index.tsx` - User signup form
2. `/src/pages/auth/user/forgot-password/reset.tsx` - User password reset
3. `/src/pages/auth/admin/forgot-password/reset.tsx` - Admin password reset

This ensures consistency across all password input forms in the application.
