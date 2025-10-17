import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return session ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
