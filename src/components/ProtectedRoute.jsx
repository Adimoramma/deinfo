import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { session, loading, isAdmin } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!session) return <Navigate to="/login" replace />;
  // admin table verification disabled for now — only require a valid session
  return children;
}

export default ProtectedRoute;
