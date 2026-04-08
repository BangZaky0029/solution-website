// Protected Route Component - Clean production version

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import SurveyInterceptor from './surveys/SurveyInterceptor';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

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

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <SurveyInterceptor>{children}</SurveyInterceptor>;
};


export default ProtectedRoute;