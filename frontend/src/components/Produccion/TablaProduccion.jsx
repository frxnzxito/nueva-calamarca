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
    if ([1, 2].includes(usuario.rolId)) {
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
    <div>
      <h3>📊 Producción registrada</h3>

      <div style={{ marginBottom: '1rem' }}>
        <label>Fecha: </label>
        <input
          type="date"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
        />

        <label style={{ marginLeft: '1rem' }}>Turno: </label>
        <select value={filtroTurnoId} onChange={e => setFiltroTurnoId(e.target.value)}>
          <option value="">Todos</option>
          {turnos.map(t => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        {puedeFiltrarPorMina && (
          <div>
            <label style={{ marginLeft: '1rem' }}>Mina: </label>
            <select value={filtroMinaId} onChange={e => setFiltroMinaId(e.target.value)}>
              <option value="">Todas</option>
              {minas.map(mina => (
                <option key={mina.id} value={mina.id}>{mina.nombre}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <table>
        <thead>
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
          {producciones.map(p => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}