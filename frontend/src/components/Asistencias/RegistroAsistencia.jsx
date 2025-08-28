import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RegistroAsistencia() {
  const { usuario, token } = useAuth();
  const [minas, setMinas] = useState([]);
  const [minaSeleccionada, setMinaSeleccionada] = useState('');
  const [jornaleros, setJornaleros] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [form, setForm] = useState({
    usuarioId: '',
    turnoId: '',
    puestoTrabajoId: ''
  });

  const esSupervisor = [1, 2].includes(usuario.rolId);
  const minaIdFinal = esSupervisor
    ? (minaSeleccionada ? parseInt(minaSeleccionada) : null)
    : usuario.minaId;

  // Cargar minas, turnos y puestos
  useEffect(() => {
    if (esSupervisor) {
      fetch('/minas', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setMinas(data);
          if (data.length > 0 && !minaSeleccionada) {
            setMinaSeleccionada(String(data[0].id)); // ← valor inicial
          }
        })
        .catch(err => console.error('❌ Error al cargar minas:', err));
    }

    fetch('/turnos')
      .then(res => res.json())
      .then(setTurnos);

    fetch('/puestos')
      .then(res => res.json())
      .then(setPuestos);
  }, []);

  // Cargar jornaleros según mina
  useEffect(() => {
    if (!minaIdFinal) return;

    const url = new URL('/usuarios', window.location.origin);
    url.searchParams.append('rol', 'Jornalero');
    url.searchParams.append('minaId', minaIdFinal);

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setJornaleros)
      .catch(err => console.error('❌ Error al cargar jornaleros:', err));
  }, [minaIdFinal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/asistencia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        fecha: new Date().toISOString(),
        minaId: minaIdFinal
      })
    });
    const data = await res.json();
    console.log('✅ Asistencia registrada:', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {esSupervisor && (
        <label>
          Mina:
          <select value={minaSeleccionada} onChange={e => setMinaSeleccionada(e.target.value)}>
            <option value="">Seleccionar mina</option>
            {minas.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </label>
      )}

      <label>Jornalero:</label>
      <select value={form.usuarioId} onChange={e => setForm({ ...form, usuarioId: e.target.value })}>
        <option value="">Seleccionar</option>
        {jornaleros.map(j => (
          <option key={j.id} value={j.id}>
            {j.nombres} {j.apellidos}
          </option>
        ))}
      </select>

      <label>Turno:</label>
      <select value={form.turnoId} onChange={e => setForm({ ...form, turnoId: e.target.value })}>
        <option value="">Seleccionar</option>
        {turnos.map(t => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>

      <label>Puesto de trabajo:</label>
      <select value={form.puestoTrabajoId} onChange={e => setForm({ ...form, puestoTrabajoId: e.target.value })}>
        <option value="">Seleccionar</option>
        {puestos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <button type="submit">Registrar asistencia</button>
    </form>
  );
}