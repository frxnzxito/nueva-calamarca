import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
    try {
      const res = await fetch('http://localhost:3000/minas', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const error = await res.json();
        console.warn('⚠️ Error al obtener minas:', error);
        setMinas([]);
        return;
      }

      const data = await res.json();
      setMinas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error inesperado al cargar minas:', err);
      setMinas([]);
    }
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
    cargarRoles();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const puedeVerMinas = [1, 2].includes(usuario.rolId) || (usuario.rolId === 3 && usuario.minaId);
    if (usuario && puedeVerMinas) {
      cargarMinas();
    }
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
    <div className="container py-4">
      <h2 className="text-primary mb-4">👥 Gestión de Usuarios</h2>

      <form className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Filtrar por rol</label>
          <select className="form-select" value={filtroRolId} onChange={e => setFiltroRolId(e.target.value)}>
            <option value="">Todos</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Filtrar por mina</label>
          <select className="form-select" value={filtroMinaId} onChange={e => setFiltroMinaId(e.target.value)}>
            <option value="">Todas</option>
            {minas.map(mina => (
              <option key={mina.id} value={mina.id}>{mina.nombre}</option>
            ))}
          </select>
        </div>
      </form>

      <form className="row g-3 mb-5">
        <div className="col-md-2"><input className="form-control" placeholder="CI" value={form.ci} onChange={e => setForm({ ...form, ci: e.target.value })} /></div>
        <div className="col-md-2"><input className="form-control" placeholder="Nombres" value={form.nombres} onChange={e => setForm({ ...form, nombres: e.target.value })} /></div>
        <div className="col-md-2"><input className="form-control" placeholder="Apellidos" value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} /></div>
        <div className="col-md-2"><input className="form-control" type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        <div className="col-md-2">
          <select className="form-select" value={form.rolId} onChange={e => setForm({ ...form, rolId: e.target.value })}>
            <option value="">Rol</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={form.minaId} onChange={e => setForm({ ...form, minaId: e.target.value })}>
            <option value="">Mina</option>
            {minas.map(mina => (
              <option key={mina.id} value={mina.id}>{mina.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-12 text-end">
          <button type="button" className="btn btn-success" onClick={crearUsuario}>➕ Crear</button>
        </div>
      </form>
        {usuarioEditando && (
        <div className="border-top pt-4 mb-5">
          <h4 className="text-warning mb-3">✏️ Editar Usuario</h4>
          <form className="row g-3">
            <div className="col-md-2">
              <input className="form-control" placeholder="CI" value={usuarioEditando.ci} onChange={e => setUsuarioEditando({ ...usuarioEditando, ci: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Nombres" value={usuarioEditando.nombres} onChange={e => setUsuarioEditando({ ...usuarioEditando, nombres: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Apellidos" value={usuarioEditando.apellidos} onChange={e => setUsuarioEditando({ ...usuarioEditando, apellidos: e.target.value })} />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={usuarioEditando.rolId} onChange={e => setUsuarioEditando({ ...usuarioEditando, rolId: parseInt(e.target.value) })}>
                <option value="">Rol</option>
                {roles.map(rol => (
                  <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={usuarioEditando.minaId ?? ''} onChange={e => setUsuarioEditando({ ...usuarioEditando, minaId: parseInt(e.target.value) })}>
                <option value="">Mina</option>
                {minas.map(mina => (
                  <option key={mina.id} value={mina.id}>{mina.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-12 text-end">
              <button type="button" className="btn btn-primary me-2" onClick={guardarCambios}>💾 Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={() => setUsuarioEditando(null)}>❌ Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>CI</th>
              <th>Rol</th>
              <th>Mina</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios
              .filter(u => !filtroRolId || u.rolId === parseInt(filtroRolId))
              .filter(u => !filtroMinaId || u.minaId === parseInt(filtroMinaId))
              .map(u => (
                <tr key={u.id}>
                  <td>{u.nombres} {u.apellidos}</td>
                  <td>{u.ci}</td>
                  <td>{u.rol?.nombre}</td>
                  <td>{u.mina?.nombre ?? 'Sin asignar'}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => setUsuarioEditando(u)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarUsuario(u.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosPage;