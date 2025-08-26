import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/LoginPage';
import ProduccionPage from './pages/ProduccionPage';
import AsistenciasPage from './pages/AsistenciasPage';
import UsuariosPage from './pages/UsuariosPage';
import EntradaMineralPage from './pages/EntradaMineralPage';
import SalidaMineralPage from './pages/SalidaMineralPage';
import PlanillasPage from './pages/PlanillasPage';
import PerfilPage from './pages/PerfilPage';
import DiasTrabajadosPage from './pages/DiasTrabajadosPage';
import PagoPage from './pages/PagoPage';
import Layout from './components/Layout';
import RutaPrivada from './components/RutaPrivada';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Página de login */}
          <Route path="/" element={<Login />} />


          <Route element={
            <RutaPrivada>
              <Layout />
            </RutaPrivada>
          }>
          {/* Página principal después del login */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Otras páginas */}
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/produccion" element={<ProduccionPage />} />
            <Route path="/asistencias" element={<AsistenciasPage />} />
            <Route path="/salida-mineral" element={<SalidaMineralPage />} />
            <Route path="/entrada-mineral" element={<EntradaMineralPage />} />            
            <Route path="/planillas" element={<PlanillasPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/dias-trabajados" element={<DiasTrabajadosPage />} />
            <Route path="/pago" element={<PagoPage />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;