import { Outlet, useNavigate } from 'react-router-dom';
import PerfilUsuario from './PerfilUsuario';
import { useAuth } from '../context/AuthContext';
import { permisosPorRolId, botonesPorRuta } from '../utils/permisosPorRol';

const Layout = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleNavigate = (ruta) => {
    console.log(`Usuario ${usuario.id} navegó a ${ruta}`);
    navigate(ruta);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const rutasPermitidas = permisosPorRolId[usuario?.rolId] || [];

  return (
    <div className="container py-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📋 Panel principal</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          🔒 Cerrar sesión
        </button>
      </div>

      {/* Perfil */}
      <div className="mb-4">
        <PerfilUsuario />
      </div>

      {/* Navegación por botones */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {botonesPorRuta
          .filter(b => rutasPermitidas.includes(b.ruta))
          .map(b => (
            <button
              key={b.ruta}
              className="btn btn-outline-primary"
              onClick={() => handleNavigate(b.ruta)}
            >
              {b.label}
            </button>
          ))}
      </div>

      {/* Contenido dinámico */}
      <Outlet />
    </div>
  );
};

export default Layout;