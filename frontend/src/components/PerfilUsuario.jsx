import { useAuth } from '../context/AuthContext';

const PerfilUsuario = () => {
  const { usuario } = useAuth();

  if (!usuario) return null;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>👤 Perfil del usuario</h3>
      <p><strong>Nombre:</strong> {usuario.nombres} {usuario.apellidos}</p>
      <p><strong>CI:</strong> {usuario.ci}</p>
      <p><strong>Rol:</strong> {usuario.rol}</p>
    </div>
  );
};

export default PerfilUsuario;