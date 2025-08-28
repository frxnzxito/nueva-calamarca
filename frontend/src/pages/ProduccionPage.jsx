import RegistroProduccion from '../components/Produccion/RegistroProduccion';
import TablaProduccion from '../components/Produccion/TablaProduccion';
import { useAuth } from '../context/AuthContext';

export default function ProduccionPage() {
  const { usuario } = useAuth();

  const puedeRegistrar =
    [1, 2].includes(usuario.rolId) || (usuario.rolId === 3 && usuario.minaId);

  const puedeVerTabla =
    [1, 2, 3, 6].includes(usuario.rolId); // ← 6 puede ver, 3 también

  return (
    <div>
      <h2>🏗️ Producción</h2>

      {puedeRegistrar ? (
        <RegistroProduccion minaId={usuario.minaId} />
      ) : (
        <p>🚫 No tienes permisos para registrar producción.</p>
      )}

      {puedeVerTabla && (
        <div style={{ marginTop: '2rem' }}>
          <TablaProduccion />
        </div>
      )}
    </div>
  );
}
