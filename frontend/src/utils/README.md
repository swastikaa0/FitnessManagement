# localStorage Utilities

This module provides utility functions for easily accessing and managing user data in localStorage.

## Available Functions

### `getUserFromStorage()`
Returns the complete user object from localStorage.
```javascript
import { getUserFromStorage } from '../utils/localStorage';

const user = getUserFromStorage();
console.log(user); // { id: 1, name: 'John', email: 'john@example.com', role: 'admin', ... }
```

### `getTokenFromStorage()`
Returns the authentication token from localStorage.
```javascript
import { getTokenFromStorage } from '../utils/localStorage';

const token = getTokenFromStorage();
console.log(token); // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### `isUserAdmin()`
Checks if the current user has admin role.
```javascript
import { isUserAdmin } from '../utils/localStorage';

if (isUserAdmin()) {
  // Show admin features
  console.log('User is an admin');
}
```

### `isUserPremium()`
Checks if the current user has an active premium subscription.
```javascript
import { isUserPremium } from '../utils/localStorage';

if (isUserPremium()) {
  // Show premium features
  console.log('User has premium subscription');
}
```

### `isUserAuthenticated()`
Checks if the user is authenticated (has both token and user data).
```javascript
import { isUserAuthenticated } from '../utils/localStorage';

if (isUserAuthenticated()) {
  // User is logged in
  console.log('User is authenticated');
}
```

### `saveUserToStorage(user)`
Saves user data to localStorage with error handling.
```javascript
import { saveUserToStorage } from '../utils/localStorage';

const userData = { id: 1, name: 'John', email: 'john@example.com' };
saveUserToStorage(userData);
```

### `saveTokenToStorage(token)`
Saves authentication token to localStorage.
```javascript
import { saveTokenToStorage } from '../utils/localStorage';

saveTokenToStorage('your-jwt-token-here');
```

### `clearAuthData()`
Clears all authentication data from localStorage.
```javascript
import { clearAuthData } from '../utils/localStorage';

// On logout
clearAuthData();
```

## Usage Examples

### In a React Component
```javascript
import React from 'react';
import { getUserFromStorage, isUserAdmin } from '../utils/localStorage';

const MyComponent = () => {
  const user = getUserFromStorage();
  const isAdmin = isUserAdmin();

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      {isAdmin && <button>Admin Panel</button>}
    </div>
  );
};
```

### In API Services
```javascript
import { getTokenFromStorage, isUserAuthenticated } from '../utils/localStorage';

const makeAuthenticatedRequest = async () => {
  if (!isUserAuthenticated()) {
    throw new Error('User not authenticated');
  }

  const token = getTokenFromStorage();
  const response = await fetch('/api/protected-route', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

### In Route Guards
```javascript
import { isUserAdmin, isUserAuthenticated } from '../utils/localStorage';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  if (!isUserAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isUserAdmin()) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
```

## Benefits

1. **Easy Access**: No need to parse JSON or handle errors manually
2. **Type Safety**: Consistent return types and error handling
3. **Reusability**: Use across different components and services
4. **Maintainability**: Centralized localStorage logic
5. **Error Handling**: Built-in try-catch for JSON parsing
6. **Performance**: Direct localStorage access without React context overhead

## Notes

- These functions provide direct access to localStorage data
- They don't trigger React re-renders (use useAuth hook for reactive data)
- Perfect for one-time checks, API calls, and utility functions
- Always handle the case where user data might be null