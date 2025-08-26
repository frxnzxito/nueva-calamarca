import { Outlet, useNavigate } from 'react-router-dom';
import PerfilUsuario from './PerfilUsuario';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📋 Panel principal</h2>
      <PerfilUsuario />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => navigate('/usuarios')}>👥 Usuarios</button>
        <button onClick={() => navigate('/produccion')}>🛠️ Producción</button>
        <button onClick={() => navigate('/asistencias')}>🧑‍🏭 Asistencia</button>
        <button onClick={() => navigate('/salidaMineral')}>🚚 Salida Mineral</button>
        <button onClick={() => navigate('/entradaMineral')}>⛏️ Entrada Mineral</button>
        <button onClick={() => navigate('/planillas')}>📄 Planillas</button>
        <button onClick={handleLogout} style={{ marginLeft: 'auto', backgroundColor: '#f44336', color: 'white' }}>
            🔒 Cerrar sesión
        </button>
      </div>

      {/* Aquí se renderiza la página interna */}
      <Outlet />
    </div>
  );
};

export default Layout;