import { useAuth } from '../context/AuthContext';

const PerfilUsuario = () => {
  const { usuario } = useAuth();

  if (!usuario) return null;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>👤 Perfil del usuario</h3>
      <p><strong>Nombre:</strong> {usuario.nombres} {usuario.apellidos}</p>
      <p><strong>CI:</strong> {usuario.ci}</p>
      <p><strong>Rol:</strong> {typeof usuario.rol === 'string' ? usuario.rol : usuario.rol?.nombre}</p>
      {usuario.mina && (
        <p><strong>Mina asignada:</strong> {usuario.mina?.nombre}</p>
      )}
    </div>
  );
};

export default PerfilUsuario;