import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { session, loading, isAdmin } = useAuth();
  if (loading) return <p>Loading...</p>;
  // allow a development override stored in localStorage so the admin area can be used without Supabase
  let devAdmin = false;
  try { devAdmin = typeof window !== 'undefined' && localStorage.getItem('dev_admin') === 'true'; } catch (e) { devAdmin = false; }
  if (!session && !devAdmin) return <Navigate to="/login" replace />;
  // admin table verification disabled for now — only require a valid session
  return children;
}

export default ProtectedRoute;
