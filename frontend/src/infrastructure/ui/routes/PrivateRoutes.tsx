import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/infrastructure/ui/context/AuthContext';

const PrivateRoutes = () => {
  const { user } = useAuth()

  return user ? <Outlet /> : <Navigate to="/auth/login" />;
}

export default PrivateRoutes