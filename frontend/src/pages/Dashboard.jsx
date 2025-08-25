import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PerfilUsuario from '../components/PerfilUsuario';

const Dashboard = () => {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📋 Panel principal</h2>
      <PerfilUsuario />

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={() => navigate('/produccion')}>🛠️ Producción</button>
        <button onClick={() => navigate('/asistencia')}>🧑‍🏭 Asistencia</button>
        <button onClick={() => navigate('/reportes')}>📊 Reportes</button>
        <button onClick={() => navigate('/usuarios')}>👥 Usuarios</button>
      </div>
    </div>
  );
};

export default Dashboard;