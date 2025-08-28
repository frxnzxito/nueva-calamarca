import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // ← asegúrate que esta ruta sea correcta

const UsuariosPage = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ ci: '', nombres: '', apellidos: '', rolId: '', minaId: '', password: '' });
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [roles, setRoles] = useState([]);
  const [minas, setMinas] = useState([]);
  const [filtroRolId, setFiltroRolId] = useState('');
  const [filtroMinaId, setFiltroMinaId] = useState('');

  const verificarDuplicadoCI = async (ci, id = null) => {
    const res = await fetch('http://localhost:3000/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const duplicado = data.find(u => u.ci === ci && u.id !== id);
    return !!duplicado;
  };

  const cargarUsuarios = async () => {
    const res = await fetch('http://localhost:3000/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsuarios(data);
  };

  const cargarMinas = async () => {
    const res = await fetch('http://localhost:3000/minas', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMinas(data);
  };

  const cargarRoles = async () => {
    const res = await fetch('http://localhost:3000/roles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRoles(data);
  };

  useEffect(() => {
    cargarUsuarios();
    cargarMinas();
    cargarRoles();
  }, []);

  const crearUsuario = async () => {
    if (await verificarDuplicadoCI(form.ci)) {
      alert('Ya existe un usuario con ese CI');
      return;
    }

    await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    setForm({ ci: '', nombres: '', apellidos: '', rolId: '', minaId: '', password: '' });
    cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    cargarUsuarios();
  };

  const guardarCambios = async () => {
    if (await verificarDuplicadoCI(usuarioEditando.ci, usuarioEditando.id)) {
      alert('Otro usuario ya tiene ese CI');
      return;
    }

    await fetch(`http://localhost:3000/usuarios/${usuarioEditando.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(usuarioEditando)
    });

    setUsuarioEditando(null);
    cargarUsuarios();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>👥 Gestión de Usuarios</h2>

      <div style={{ marginTop: '2rem' }}>
        <label>Filtrar por rol: </label>
        <select value={filtroRolId} onChange={e => setFiltroRolId(e.target.value)}>
          <option value="">Todos</option>
          {roles.map(rol => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
        </select>

        <label style={{ marginLeft: '1rem' }}>Filtrar por mina: </label>
        <select value={filtroMinaId} onChange={e => setFiltroMinaId(e.target.value)}>
          <option value="">Todas</option>
          {minas.map(mina => (
            <option key={mina.id} value={mina.id}>{mina.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <input placeholder="CI" value={form.ci} onChange={e => setForm({ ...form, ci: e.target.value })} />
        <input placeholder="Nombres" value={form.nombres} onChange={e => setForm({ ...form, nombres: e.target.value })} />
        <input placeholder="Apellidos" value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} />
        <input placeholder="Contraseña" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <select value={form.rolId} onChange={e => setForm({ ...form, rolId: e.target.value })}>
          <option value="">Seleccione un rol</option>
          {roles.map(rol => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
        </select>
        <select value={form.minaId} onChange={e => setForm({ ...form, minaId: e.target.value })}>
          <option value="">Seleccione una mina</option>
          {minas.map(mina => (
            <option key={mina.id} value={mina.id}>{mina.nombre}</option>
          ))}
        </select>
        <button onClick={crearUsuario}>➕ Crear</button>
      </div>

      {usuarioEditando && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
          <h3>✏️ Editar Usuario</h3>
          <input placeholder="CI" value={usuarioEditando.ci} onChange={e => setUsuarioEditando({ ...usuarioEditando, ci: e.target.value })} />
          <input placeholder="Nombres" value={usuarioEditando.nombres} onChange={e => setUsuarioEditando({ ...usuarioEditando, nombres: e.target.value })} />
          <input placeholder="Apellidos" value={usuarioEditando.apellidos} onChange={e => setUsuarioEditando({ ...usuarioEditando, apellidos: e.target.value })} />
          <select value={usuarioEditando.rolId} onChange={e => setUsuarioEditando({ ...usuarioEditando, rolId: parseInt(e.target.value) })}>
            <option value="">Seleccione un rol</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
          <select value={usuarioEditando.minaId ?? ''} onChange={e => setUsuarioEditando({ ...usuarioEditando, minaId: parseInt(e.target.value) })}>
            <option value="">Seleccione una mina</option>
            {minas.map(mina => (
              <option key={mina.id} value={mina.id}>{mina.nombre}</option>
            ))}
          </select>
          <button onClick={guardarCambios}>💾 Guardar cambios</button>
          <button onClick={() => setUsuarioEditando(null)}>❌ Cancelar</button>
        </div>
      )}

      <ul style={{ marginTop: '2rem' }}>
        {usuarios
          .filter(u => !filtroRolId || u.rolId === parseInt(filtroRolId))
          .filter(u => !filtroMinaId || u.minaId === parseInt(filtroMinaId))
          .map(u => (
            <li key={u.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{u.nombres} {u.apellidos}</strong> — CI: {u.ci} — Rol: {u.rol?.nombre} — Mina: {u.mina?.nombre ?? 'Sin asignar'}
              <br />
              <button onClick={() => setUsuarioEditando(u)}>✏️ Editar</button>
              <button onClick={() => eliminarUsuario(u.id)}>🗑️ Eliminar</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UsuariosPage;