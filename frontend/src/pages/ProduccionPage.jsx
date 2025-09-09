import RegistroProduccion from '../components/Produccion/RegistroProduccion';
import TablaProduccion from '../components/Produccion/TablaProduccion';
import { useAuth } from '../context/AuthContext';

export default function ProduccionPage() {
  const { usuario } = useAuth();

  const puedeRegistrar =
    [1, 2].includes(usuario.rolId) || (usuario.rolId === 3 && usuario.minaId);

  const puedeVerTabla =
    [1, 2, 3, 6].includes(usuario.rolId);

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h2 className="text-primary">🏗️ Producción</h2>
        <p className="text-muted">Registro y visualización de producción minera</p>
      </div>

      {puedeRegistrar ? (
        <div className="mb-5">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              Registrar producción
            </div>
            <div className="card-body">
              <RegistroProduccion minaId={usuario.minaId} />
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning text-center">
          🚫 No tienes permisos para registrar producción.
        </div>
      )}

      {puedeVerTabla && (
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            Historial de producción
          </div>
          <div className="card-body">
            <TablaProduccion />
          </div>
        </div>
      )}
    </div>
  );
}