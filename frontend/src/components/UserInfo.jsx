import React from 'react';
import { getUserFromStorage, isUserAdmin, isUserPremium, isUserAuthenticated } from '../utils/localStorage';

/**
 * Example component demonstrating how to easily access user data from localStorage
 */
const UserInfo = () => {
  const user = getUserFromStorage();
  const isAuthenticated = isUserAuthenticated();
  const isAdmin = isUserAdmin();
  const isPremium = isUserPremium();

  if (!isAuthenticated) {
    return (
      <div className="user-info">
        <p>User not authenticated</p>
      </div>
    );
  }

  return (
    <div className="user-info">
      <h3>User Information (from localStorage)</h3>
      <div className="user-details">
        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
        <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
        <p><strong>Is Premium:</strong> {isPremium ? 'Yes' : 'No'}</p>
        <p><strong>Subscription Status:</strong> {user?.subscription?.status || 'N/A'}</p>
        <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
      </div>
      
      <div className="raw-data">
        <h4>Raw User Data:</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UserInfo;