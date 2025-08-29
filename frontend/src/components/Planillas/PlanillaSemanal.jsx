import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function PlanillaSemanal({ minaId, turnoId, inicio, fin }) {
  const { token } = useAuth();
  const [planilla, setPlanilla] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('minaId', minaId);
    params.append('turnoId', turnoId);
    params.append('inicio', inicio);
    params.append('fin', fin);

    fetch(`/planilla?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPlanilla(data));
  }, [minaId, turnoId, inicio, fin]);

  return (
    <div>
      <h3>📄 Planilla semanal</h3>
      <p><strong>Mina:</strong> {minaId} | <strong>Turno:</strong> {turnoId}</p>
      <p><strong>Semana:</strong> {inicio} a {fin}</p>

      <table>
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