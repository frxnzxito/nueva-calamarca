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

  useEffect(() => {
    if (esSupervisor) {
      fetch('/minas', {
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

    fetch('/turnos')
      .then(res => res.json())
      .then(setTurnos);

    fetch('/puestos')
      .then(res => res.json())
      .then(setPuestos);
  }, []);

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
    <form onSubmit={handleSubmit} className="row g-3">
      {esSupervisor && (
        <div className="col-md-4">
          <label className="form-label">Mina</label>
          <select className="form-select" value={minaSeleccionada} onChange={e => setMinaSeleccionada(e.target.value)}>
            <option value="">Seleccionar mina</option>
            {minas.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>
      )}

      <div className="col-md-4">
        <label className="form-label">Jornalero</label>
        <select className="form-select" value={form.usuarioId} onChange={e => setForm({ ...form, usuarioId: e.target.value })}>
          <option value="">Seleccionar</option>
          {jornaleros.map(j => (
            <option key={j.id} value={j.id}>
              {j.nombres} {j.apellidos}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-2">
        <label className="form-label">Turno</label>
        <select className="form-select" value={form.turnoId} onChange={e => setForm({ ...form, turnoId: e.target.value })}>
          <option value="">Seleccionar</option>
          {turnos.map(t => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>
      </div>

      <div className="col-md-2">
        <label className="form-label">Puesto de trabajo</label>
        <select className="form-select" value={form.puestoTrabajoId} onChange={e => setForm({ ...form, puestoTrabajoId: e.target.value })}>
          <option value="">Seleccionar</option>
          {puestos.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      <div className="col-12 text-end">
        <button type="submit" className="btn btn-primary">Registrar asistencia</button>
      </div>
    </form>
  );
}