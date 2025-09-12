import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

export default function PlanillaSemanal({ minaId, turnoId, inicio, fin }) {
  const { token } = useAuth();
  const [planilla, setPlanilla] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Validar que todas las props necesarias existan antes de hacer la llamada a la API.
    if (!minaId || !turnoId || !inicio || !fin) {
      // Si falta alguna prop, no hagas nada y sal del efecto.
      // Esto evita llamadas a la API innecesarias con datos incompletos.
      setPlanilla([]); // Opcional: limpiar la planilla anterior
      return;
    }

    setLoading(true); // Indicar que la carga ha comenzado
    setError(null); // Limpiar errores anteriores

    const params = new URLSearchParams({
      minaId: minaId,
      turnoId: turnoId,
      inicio: inicio,
      fin: fin,
    });

    fetch(`/planilla?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al cargar la planilla. Por favor, intente de nuevo.');
        }
        return res.json();
      })
      .then(data => {
        // 2. Manejar datos nulos o vacíos
        if (data && Array.isArray(data)) {
          setPlanilla(data);
        } else {
          setPlanilla([]);
        }
      })
      .catch(err => {
        console.error("Error fetching planilla:", err);
        setError(err.message); // Guardar el mensaje de error para mostrar al usuario
        setPlanilla([]); // Limpiar la planilla en caso de error
      })
      .finally(() => {
        setLoading(false); // Indicar que la carga ha terminado
      });
  }, [minaId, turnoId, inicio, fin, token]); // El array de dependencias es crucial

  // 3. Renderizado condicional
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (planilla.length === 0) {
    return (
      <Alert variant="info" className="mt-4">
        No se encontraron datos de planilla para el período y filtro seleccionados.
      </Alert>
    );
  }

  return (
    <div className="table-responsive">
      <h3 className="mb-3">📄 Planilla semanal</h3>
      <p>
        <strong>Mina:</strong> {minaId} | <strong>Turno:</strong> {turnoId}
      </p>
      <p>
        <strong>Semana:</strong> {inicio} a {fin}
      </p>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Jornalero</th>
            <th>CI</th>
            <th>Días trabajados</th>
            <th>Monto por jornal</th>
            <th>Pago total</th>
          </tr>
        </thead>
        <tbody>
          {planilla.map((j, index) => (
            <tr key={index}>
              <td>{j.jornalero}</td>
              <td>{j.ci}</td>
              <td>{j.diasTrabajados}</td>
              <td>{j.montoPorJornal}</td>
              <td>{j.pagoTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}