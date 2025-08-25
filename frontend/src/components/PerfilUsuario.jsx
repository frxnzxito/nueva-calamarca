import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PerfilUsuario = () => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) return null;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>👤 Perfil del usuario</h3>
      <p><strong>Nombre:</strong> {usuario.nombres} {usuario.apellidos}</p>
      <p><strong>CI:</strong> {usuario.ci}</p>
      <p><strong>Rol:</strong> {usuario.rol}</p>
      {usuario.minaId && <p><strong>Mina asignada:</strong> {usuario.minaId}</p>}
    </div>
  );
};

export default PerfilUsuario;