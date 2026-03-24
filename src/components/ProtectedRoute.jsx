import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuthStore();

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se é admin only e o usuário não é admin, redireciona para home
  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}