import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuthStore();

  console.log('ProtectedRoute Debug:', {
    isAuthenticated,
    user,
    adminOnly,
    userIsAdmin: user?.is_admin,
  });

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    console.log('Não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Se é admin only e o usuário não é admin, redireciona para home
  if (adminOnly && !user?.is_admin) {
    console.log('Usuário não é admin, redirecionando para home');
    return <Navigate to="/" replace />;
  }

  return children;
}