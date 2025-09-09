import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function TablaProduccion() {
  const { usuario, token } = useAuth();
  const [producciones, setProducciones] = useState([]);
  const [minas, setMinas] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTurnoId, setFiltroTurnoId] = useState('');
  const [filtroMinaId, setFiltroMinaId] = useState('');

  const puedeFiltrarPorMina = [1, 2].includes(usuario.rolId);
  const minaIdFinal = puedeFiltrarPorMina ? parseInt(filtroMinaId) || null : usuario.minaId;

  useEffect(() => {
    if (puedeFiltrarPorMina) {
      fetch('/minas', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setMinas(data));
    }

    fetch('/turnos', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setTurnos(data));
  }, [usuario]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (minaIdFinal) params.append('minaId', minaIdFinal);
    if (filtroFecha) params.append('fecha', filtroFecha);
    if (filtroTurnoId) params.append('turnoId', filtroTurnoId);

    fetch(`/produccion?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProducciones(data));
  }, [minaIdFinal, filtroFecha, filtroTurnoId]);

  return (
    <div className="container">
      <h3 className="mb-4 text-primary">📊 Producción registrada</h3>

      {/* Filtros */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Turno</label>
          <select
            className="form-select"
            value={filtroTurnoId}
            onChange={e => setFiltroTurnoId(e.target.value)}
          >
            <option value="">Todos</option>
            {turnos.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        {puedeFiltrarPorMina && (
          <div className="col-md-4">
            <label className="form-label">Mina</label>
            <select
              className="form-select"
              value={filtroMinaId}
              onChange={e => setFiltroMinaId(e.target.value)}
            >
              <option value="">Todas</option>
              {minas.map(mina => (
                <option key={mina.id} value={mina.id}>{mina.nombre}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Mina</th>
              <th>Perforista</th>
              <th>Ayudante</th>
              <th>Topes</th>
              <th>Carros</th>
              <th>Sacos</th>
            </tr>
          </thead>
          <tbody>
            {producciones.length > 0 ? (
              producciones.map(p => (
                <tr key={p.id}>
                  <td>{p.fecha?.slice(0, 10)}</td>
                  <td>{p.turno?.nombre}</td>
                  <td>{p.mina?.nombre}</td>
                  <td>{p.perforista?.nombres} {p.perforista?.apellidos}</td>
                  <td>{p.ayudante?.nombres} {p.ayudante?.apellidos}</td>
                  <td>{p.topesPerforados}</td>
                  <td>{p.carrosSacados}</td>
                  <td>{p.sacosSacados}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">No hay registros disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}