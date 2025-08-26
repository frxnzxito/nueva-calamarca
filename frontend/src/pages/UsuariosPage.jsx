import { useEffect, useState } from 'react';
import axios from 'axios';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ ci: '', nombres: '', apellidos: '', rolId: '', minaId: '', password: '' });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const res = await axios.get('http://localhost:3000/usuarios');
    setUsuarios(res.data);
  };

  const crearUsuario = async () => {
    await axios.post('http://localhost:3000/usuarios', form);
    setForm({ ci: '', nombres: '', apellidos: '', rolId: '', minaId: '', password: '' });
    cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    await axios.delete(`http://localhost:3000/usuarios/${id}`);
    cargarUsuarios();
  };
  useEffect(() => {
  cargarUsuarios();
  cargarMinas();
}, []);

const cargarMinas = async () => {
  const res = await axios.get('http://localhost:3000/minas');
  setMinas(res.data);
};

  return (
    <div style={{ padding: '1rem' }}>
      <h2>👥 Gestión de Usuarios</h2>

      <div>
        <input placeholder="CI" value={form.ci} onChange={e => setForm({ ...form, ci: e.target.value })} />
        <input placeholder="Nombres" value={form.nombres} onChange={e => setForm({ ...form, nombres: e.target.value })} />
        <input placeholder="Apellidos" value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} />
        <input placeholder="Rol ID" value={form.rolId} onChange={e => setForm({ ...form, rolId: e.target.value })} />
        <input placeholder="Mina ID" value={form.minaId} onChange={e => setForm({ ...form, minaId: e.target.value })} />
        <input placeholder="Contraseña" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={crearUsuario}>➕ Crear</button>
      </div>

      <ul>
        {usuarios.map(u => (
          <li key={u.id}>
            {u.nombres} {u.apellidos} – {u.ci} – {u.rol?.nombre} – {u.mina?.nombre}
            <button onClick={() => eliminarUsuario(u.id)}>🗑️ Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuariosPage;