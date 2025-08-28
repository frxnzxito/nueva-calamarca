import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { permisosPorRolId } from '../utils/permisosPorRol';

const RutaPorRol = ({ children }) => {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) return <p>⏳ Cargando usuario...</p>;
  if (!location.pathname) return null;

  const rolId = parseInt(usuario.rolId);
  const rutaActual = location.pathname.replace(/\/+$/, '');
  const rutasPermitidas = (permisosPorRolId[rolId] || []).map(r => r.replace(/\/+$/, ''));

  const tienePermiso = rutasPermitidas.some(ruta => rutaActual.startsWith(ruta));

  console.log(`🧠 Ruta actual: ${rutaActual}`);
  console.log(`✅ Rutas permitidas para rol ${rolId}:`, rutasPermitidas);
  console.log(`🔐 Acceso ${tienePermiso ? 'permitido' : 'denegado'} a ${rutaActual}`);

  if (!tienePermiso) return <Navigate to="/perfil" />;
  return children;
};

export default RutaPorRol;