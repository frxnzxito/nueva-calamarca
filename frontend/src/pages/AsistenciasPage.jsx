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
    return <div className="container py-4"><p className="text-muted">⏳ Cargando usuario...</p></div>;
  }

  if (!puedeVer) {
    return <div className="container py-4"><p className="alert alert-danger">🚫 No tienes permisos para acceder a esta sección.</p></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="text-primary mb-4">🧑‍🏭 Registro de Asistencia</h2>

      {puedeRegistrar ? (
        <div className="mb-4">
          <RegistroAsistencia minaId={minaIdFinal} />
        </div>
      ) : (
        <p className="alert alert-warning">
          Solo los usuarios con rol Administrador, Licenciado o Encargado de mina pueden registrar asistencia.
        </p>
      )}

      {esSupervisor && (
        <div className="mb-4">
          <label className="form-label">Seleccionar mina:</label>
          <select className="form-select" value={minaSeleccionada} onChange={e => setMinaSeleccionada(e.target.value)}>
            <option value="">-- Selecciona una mina --</option>
            {minas.map(mina => (
              <option key={mina.id} value={mina.id}>{mina.nombre}</option>
            ))}
          </select>
        </div>
      )}

      <TablaAsistencias
        minaId={minaIdFinal}
        esSupervisor={esSupervisor}
        token={token}
        usuario={usuario}
      />
    </div>
  );
}