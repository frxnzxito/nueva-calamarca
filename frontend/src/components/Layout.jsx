import { Outlet, useNavigate } from 'react-router-dom';
import PerfilUsuario from './PerfilUsuario';
import { useAuth } from '../context/AuthContext';
import { permisosPorRolId, botonesPorRuta } from '../utils/permisosPorRol';

const Layout = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const rutasPermitidas = permisosPorRolId[usuario?.rolId] || [];

  const handleNavigate = (ruta) => {
    navigate(ruta);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container-fluid px-3">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
        <h2 className="text-primary">📋 Panel principal</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          🔒 Cerrar sesión
        </button>
      </div>

      {/* Menú hamburguesa */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm mb-4">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {botonesPorRuta
                .filter(b => rutasPermitidas.includes(b.ruta))
                .map(b => (
                  <li className="nav-item" key={b.ruta}>
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => handleNavigate(b.ruta)}
                    >
                      {b.label}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Perfil */}
      <div className="mb-4">
        <PerfilUsuario />
      </div>

      {/* Contenido dinámico */}
      <Outlet />
    </div>
  );
};

export default Layout;