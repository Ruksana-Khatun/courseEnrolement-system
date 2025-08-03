import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isAuthenticated, getAuthToken, getUserData as getUserDataFromStorage, fixRoleFormat } from '../../Helper/authUtils';
import { refreshUserData } from '../../Redux/authSlice';

const AuthDebug = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const token = getAuthToken();
  const userData = getUserDataFromStorage();

  // Fix role format on component mount
  useEffect(() => {
    const wasFixed = fixRoleFormat();
    if (wasFixed) {
      console.log("🔧 Role format fixed, refreshing page...");
      window.location.reload();
    }
  }, []);

  const handleRefresh = () => {
    dispatch(refreshUserData());
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#333', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4>🔐 Auth Debug</h4>
      <div>Redux isLoggedIn: {authState.isLoggedIn ? '✅' : '❌'}</div>
      <div>Has Token: {token ? '✅' : '❌'}</div>
      <div>isAuthenticated(): {isAuthenticated() ? '✅' : '❌'}</div>
      <div>Has User Data: {userData ? '✅' : '❌'}</div>
      <div>Role: {authState.role || 'None'}</div>
      {token && (
        <div style={{ wordBreak: 'break-all', fontSize: '10px', marginTop: '5px' }}>
          Token: {token.substring(0, 20)}...
        </div>
      )}
      <button 
        onClick={handleRefresh}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '10px'
        }}
      >
        🔄 Refresh Role
      </button>
    </div>
  );
};

export default AuthDebug; 