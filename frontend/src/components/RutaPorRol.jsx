import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { permisosPorRolId } from '../utils/permisosPorRol';

const RutaPorRol = ({ children }) => {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) return <Navigate to="/" />;

  const rutasPermitidas = permisosPorRolId[usuario.rolId] || [];
  const rutaActual = location.pathname;

  return rutasPermitidas.includes(rutaActual)
    ? children
    : <Navigate to="/perfil" />;
};

export default RutaPorRol;