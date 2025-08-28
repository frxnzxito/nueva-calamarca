import { useState, useEffect } from 'react';
import axios from 'axios';

const AsistenciaForm = () => {
  const [fecha, setFecha] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [turnoId, setTurnoId] = useState('');
  const [puestoTrabajoId, setPuestoTrabajoId] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Cargar datos desde el backend
    axios.get('http://localhost:3000/usuarios?rol=Jornalero').then(res => setUsuarios(res.data));
    axios.get('http://localhost:3000/turnos').then(res => setTurnos(res.data));
    axios.get('http://localhost:3000/puestos').then(res => setPuestos(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/asistencia', {
        fecha,
        usuarioId: parseInt(usuarioId),
        turnoId: parseInt(turnoId),
        puestoTrabajoId: parseInt(puestoTrabajoId)
      });
      setMensaje('✅ Asistencia registrada correctamente');
    } catch (err) {
      setMensaje(`❌ Error: ${err.response?.data?.error || 'No se pudo registrar'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro de Asistencia</h2>

      <label>Fecha:</label>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />

      <label>Jor</label>
      <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)} required>
        <option value="">Seleccione</option>
        {usuarios.map(u => (
          <option key={u.id} value={u.id}>{u.apellidos} {u.nombres}</option>
        ))}
      </select>

      <label>Turno:</label>
      <select value={turnoId} onChange={e => setTurnoId(e.target.value)} required>
        <option value="">Seleccione</option>
        {turnos.map(t => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>

      <label>Puesto de trabajo:</label>
      <select value={puestoTrabajoId} onChange={e => setPuestoTrabajoId(e.target.value)} required>
        <option value="">Seleccione</option>
        {puestos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <button type="submit">Registrar Asistencia</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};

export default AsistenciaForm;