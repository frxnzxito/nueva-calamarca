import { useAuth } from '../context/AuthContext';
import SelectorPlanilla from '../components/Planillas/SelectorPlanilla';

export default function PlanillasPage() {
  const { usuario } = useAuth();

  const esAdministrador = usuario.rolId === 1;
  const esLicenciado = usuario.rolId === 2;
  const esEncargado = usuario.rolId === 3;
  const esJornalero = usuario.rolId === 6;

  return (
    <div>
      <h2>📄 Planillas</h2>

      {esAdministrador && <p>🔍 Puedes ver todas las planillas por mina y mes.</p>}
      {esLicenciado && <p>🧾 Puedes validar planillas y revisar pagos.</p>}
      {esEncargado && <p>📌 Solo puedes ver planillas de tu mina.</p>}
      {esJornalero && <p>👷 Aquí puedes ver tu propia planilla.</p>}
      <SelectorPlanilla/>

      {/* Aquí iría el componente que carga la tabla o resumen */}
    </div>
  );
}