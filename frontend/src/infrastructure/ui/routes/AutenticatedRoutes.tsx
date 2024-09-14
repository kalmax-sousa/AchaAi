import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/infrastructure/ui/context/AuthContext';

const AutenticatedRoutes = () => {
  const { user } = useAuth()

  return !user ? <Outlet /> : <Navigate to="/" />;
}

export default AutenticatedRoutes