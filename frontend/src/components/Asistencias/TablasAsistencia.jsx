import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { permisosPorRolId } from '../../utils/permisosPorRol';

export default function TablaAsistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [turnoSeleccionado, setTurnoSeleccionado] = useState('');
  const [minaSeleccionada, setMinaSeleccionada] = useState('');
  const [minas, setMinas] = useState([]);

  const { token, usuario } = useAuth();

  if (!usuario) return <p>⏳ Cargando usuario...</p>;

  const puedeVerAsistencia = permisosPorRolId[String(usuario.rolId)]?.includes('/asistencias');
  if (!puedeVerAsistencia) return <p>🚫 No tienes permiso para ver asistencias.</p>;

  const esSupervisor = [1, 2].includes(usuario.rolId);
  const minaIdFinal = esSupervisor ? minaSeleccionada : usuario.minaId;

  // Cargar minas si es supervisor
  useEffect(() => {
    if (esSupervisor) {
      fetch('http://localhost:3000/minas', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setMinas(data);
          if (data.length > 0 && !minaSeleccionada) {
            setMinaSeleccionada(String(data[0].id));
          }
        })
        .catch(err => console.error('❌ Error al cargar minas:', err));
    }
  }, []);

  // Cargar asistencias
  useEffect(() => {
    if (!minaIdFinal) return;

    const url = new URL('http://localhost:3000/asistencias');
    url.searchParams.append('minaId', minaIdFinal);
    if (fechaSeleccionada) url.searchParams.append('fecha', fechaSeleccionada);
    if (turnoSeleccionado) url.searchParams.append('turnoId', turnoSeleccionado);

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAsistencias(data);
        } else {
          console.error('❌ Respuesta inesperada:', data);
          setAsistencias([]);
        }
      })
      .catch(err => console.error('❌ Error al cargar asistencias:', err));
  }, [minaIdFinal, fechaSeleccionada, turnoSeleccionado]);

  return (
    <div>
      <h2>📋 Asistencias registradas</h2>

      {esSupervisor && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Seleccionar mina:</label>
          <select value={minaSeleccionada} onChange={e => setMinaSeleccionada(e.target.value)}>
            <option value="">-- Selecciona una mina --</option>
            {minas.map(mina => (
              <option key={mina.id} value={mina.id}>{mina.nombre}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Fecha:{' '}
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={e => setFechaSeleccionada(e.target.value)}
          />
        </label>{' '}
        <label>
          Turno:{' '}
          <select
            value={turnoSeleccionado}
            onChange={e => setTurnoSeleccionado(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Primera</option>
            <option value="2">Segunda</option>
            <option value="3">Tercera</option>
          </select>
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Jornalero</th>
            <th>Turno</th>
            <th>Puesto</th>
            <th>Mina</th>
            <th>Validación</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map(a => (
            <tr key={a.id}>
              <td>{new Date(a.fecha).toLocaleDateString()}</td>
              <td>{a.usuario?.nombres} {a.usuario?.apellidos}</td>
              <td>{a.turno?.nombre}</td>
              <td>{a.puestoTrabajo?.nombre}</td>
              <td>{a.mina?.nombre ?? 'Sin mina'}</td>
              <td>{a.validado ? '✅ Validado' : '⏳ Pendiente'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}