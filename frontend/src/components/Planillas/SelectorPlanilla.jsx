import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PlanillaSemanal from './PlanillaSemanal';

export default function SelectorPlanilla() {
  const { token } = useAuth();
  const [minas, setMinas] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const [minaId, setMinaId] = useState('');
  const [turnoId, setTurnoId] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [mostrarPlanilla, setMostrarPlanilla] = useState(false);

  useEffect(() => {
    fetch('/minas', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setMinas(data));

    fetch('/turnos', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setTurnos(data));
  }, []);

  const handleBuscar = () => {
    if (minaId && turnoId && inicio && fin) {
      setMostrarPlanilla(true);
    }
  };

  return (
    <div>
      <h3>📌 Selección de planilla semanal</h3>

      <label>Mina: </label>
      <select value={minaId} onChange={e => setMinaId(e.target.value)}>
        <option value="">Seleccionar</option>
        {minas.map(m => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>

      <label style={{ marginLeft: '1rem' }}>Turno: </label>
      <select value={turnoId} onChange={e => setTurnoId(e.target.value)}>
        <option value="">Seleccionar</option>
        {turnos.map(t => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>

      <label style={{ marginLeft: '1rem' }}>Inicio semana: </label>
      <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} />

      <label style={{ marginLeft: '1rem' }}>Fin semana: </label>
      <input type="date" value={fin} onChange={e => setFin(e.target.value)} />

      <button style={{ marginLeft: '1rem' }} onClick={handleBuscar}>
        🔍 Ver planilla
      </button>

      {mostrarPlanilla && (
        <div style={{ marginTop: '2rem' }}>
          <PlanillaSemanal
            minaId={minaId}
            turnoId={turnoId}
            inicio={inicio}
            fin={fin}
          />
        </div>
      )}
    </div>
  );
}