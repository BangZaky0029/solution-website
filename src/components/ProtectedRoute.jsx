// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\components\ProtectedRoute.jsx
// Protected Route Component

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log('🔒 ProtectedRoute Check:');
  console.log('   Loading:', loading);
  console.log('   Authenticated:', isAuthenticated());

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated()) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;