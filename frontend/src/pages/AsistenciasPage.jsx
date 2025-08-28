import { useState, useEffect } from 'react';
import { permisosPorRolId } from '../utils/permisosPorRol';
import RegistroAsistencia from '../components/Asistencias/RegistroAsistencia';
import { useAuth } from '../context/AuthContext';
import TablaAsistencias from '../components/Asistencias/TablasAsistencia';

export default function AsistenciasPage() {
  const { usuario, token } = useAuth();
  const [minas, setMinas] = useState([]);
  const [minaSeleccionada, setMinaSeleccionada] = useState('');
  const esSupervisor = [1, 2].includes(usuario.rolId);
  const minaIdFinal = esSupervisor ? parseInt(minaSeleccionada) : usuario.minaId;

  const puedeVer = permisosPorRolId[String(usuario.rolId)]?.includes('/asistencias');
  const puedeRegistrar = [1, 2].includes(usuario.rolId) || (usuario.rolId === 3 && usuario.minaId);

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
  }, []);

  if (!usuario) {
    return <p>⏳ Cargando usuario...</p>;
  }

  if (!puedeVer) {
    return <p>🚫 No tienes permisos para acceder a esta sección.</p>;
  }

  return (
    <div>
      <h2>🧑‍🏭 Asistencia</h2>

      {puedeRegistrar ? (
        <RegistroAsistencia minaId={minaIdFinal} />
      ) : (
        <p>Solo los usuarios con rol Administrador, Licenciado o Encargado de mina pueden registrar asistencia.</p>
      )}

      {esSupervisor && (
        <div>
          <label>Seleccionar mina:</label>
          <select value={minaSeleccionada} onChange={e => setMinaSeleccionada(e.target.value)}>
            <option value="">-- Selecciona una mina --</option>
            {minas.map(mina => (
              <option key={mina.id} value={mina.id}>{mina.nombre}</option>
            ))}
          </select>
        </div>
      )}

      <h1>Gestión de Asistencias</h1>
      <TablaAsistencias
            minaId={minaIdFinal}
            esSupervisor={esSupervisor}
            token={token}
            usuario={usuario}
        />
    </div>
  );
}