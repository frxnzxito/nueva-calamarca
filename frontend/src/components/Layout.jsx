import { Outlet, useNavigate } from 'react-router-dom';
import PerfilUsuario from './PerfilUsuario';
import { useAuth } from '../context/AuthContext';
import { permisosPorRolId } from '../utils/permisosPorRol';
import { botonesPorRuta } from '../utils/permisosPorRol';

const Layout = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const rutasPermitidas = permisosPorRolId[usuario?.rolId] || [];

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📋 Panel principal</h2>
      <PerfilUsuario />
      
      <p>Rol ID detectado: {usuario?.rolId}</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {botonesPorRuta
          .filter(b => rutasPermitidas.includes(b.ruta))
          .map(b => (
            <button key={b.ruta} onClick={() => navigate(b.ruta)}>
              {b.label}
            </button>
          ))}

        <button onClick={handleLogout} style={{ marginLeft: 'auto', backgroundColor: '#f44336', color: 'white' }}>
          🔒 Cerrar sesión
        </button>
        
      </div>

      <Outlet />
    </div>
    
  );
};

export default Layout;