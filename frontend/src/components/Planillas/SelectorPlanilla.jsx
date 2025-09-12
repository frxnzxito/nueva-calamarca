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
  
  // Nuevo estado para los datos de la planilla
  const [datosPlanilla, setDatosPlanilla] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener minas y turnos al montar el componente
  useEffect(() => {
    // Para simplificar, he combinado las llamadas a la API en un solo useEffect
    const fetchSelectData = async () => {
      try {
        const minasRes = await fetch('/minas', { headers: { Authorization: `Bearer ${token}` } });
        const minasData = await minasRes.json();
        setMinas(minasData);

        const turnosRes = await fetch('/turnos', { headers: { Authorization: `Bearer ${token}` } });
        const turnosData = await turnosRes.json();
        setTurnos(turnosData);
      } catch (err) {
        console.error('Error al cargar minas o turnos:', err);
      }
    };

    fetchSelectData();
  }, [token]);

  const handleBuscar = async () => {
    // Restablecer estados de datos y errores
    setDatosPlanilla(null);
    setError(null);

    // Validar que todos los campos estén seleccionados
    if (!minaId || !turnoId || !inicio || !fin) {
      setError('Por favor, seleccione todos los campos.');
      return;
    }

    setLoading(true);

    try {
      // Reemplaza esta URL con tu endpoint real
      const response = await fetch(`/api/planillas/semanal?minaId=${minaId}&turnoId=${turnoId}&inicio=${inicio}&fin=${fin}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Error al obtener la planilla. Intente de nuevo.');
      }

      const data = await response.json();
      setDatosPlanilla(data); // Almacenar los datos de la planilla
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>📌 Selección de planilla semanal</h3>

      <div className="d-flex align-items-center mb-4">
        <label className="me-2">Mina:</label>
        <select value={minaId} onChange={e => setMinaId(e.target.value)} className="form-select me-3">
          <option value="">Seleccionar</option>
          {minas.map(m => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>

        <label className="me-2">Turno:</label>
        <select value={turnoId} onChange={e => setTurnoId(e.target.value)} className="form-select me-3">
          <option value="">Seleccionar</option>
          {turnos.map(t => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <label className="me-2">Inicio semana:</label>
        <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} className="form-control me-3" />

        <label className="me-2">Fin semana:</label>
        <input type="date" value={fin} onChange={e => setFin(e.target.value)} className="form-control me-3" />

        <button onClick={handleBuscar} className="btn btn-primary" disabled={loading}>
          {loading ? 'Buscando...' : '🔍 Ver planilla'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Cargando planilla...</div>}

      {datosPlanilla && (
        <div style={{ marginTop: '2rem' }}>
          {/* Pasar los datos de la planilla al componente hijo */}
          <PlanillaSemanal datos={datosPlanilla} />
        </div>
      )}
    </div>
  );
}