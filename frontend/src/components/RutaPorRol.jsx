import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { permisosPorRolId } from '../utils/permisosPorRol';

const RutaPorRol = ({ children }) => {
  const { usuario } = useAuth();
  const location = useLocation();

    if (!usuario) {
    return <p>⏳ Cargando usuario...</p>;
    }

  const rolId = parseInt(usuario.rolId);
  const rutaActual = location.pathname.replace(/\/+$/, '');

  const rutasPermitidas = (permisosPorRolId[rolId] || []).map(r => r.replace(/\/+$/, ''));

  const tienePermiso = rutasPermitidas.some(ruta =>
    rutaActual === ruta || rutaActual.startsWith(ruta + '/')
  );

  console.log('🧠 Ruta actual:', rutaActual);
  console.log('✅ Rutas permitidas:', rutasPermitidas);
  console.log('🔐 Tiene permiso:', tienePermiso);

    if (!tienePermiso) {
    return <Navigate to="/perfil" />;
    }

    return children;

};

export default RutaPorRol;