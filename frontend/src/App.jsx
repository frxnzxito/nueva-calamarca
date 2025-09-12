import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import RutaPorRol from './components/RutaPorRol';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Página de login */}
          <Route path="/login" element={<Login />} />


          <Route path="/" element={
            <RutaPrivada>
              <Layout />
            </RutaPrivada>
          }>
          {/* Página principal después del login */}
            <Route index element={
              <RutaPorRol><Dashboard /></RutaPorRol>
            } />

            {/* Otras páginas */}
            <Route path="/usuarios" element={
              <RutaPorRol><UsuariosPage /></RutaPorRol> 
            } />
            <Route path="/produccion" element={
              <RutaPorRol><ProduccionPage /></RutaPorRol>
            } />
            <Route path="/asistencias" element={
              <RutaPorRol><AsistenciasPage /></RutaPorRol>
            } />
            <Route path="/salida-mineral" element={
              <RutaPorRol><SalidaMineralPage /></RutaPorRol>
              } />
            <Route path="/entrada-mineral" element={
              <RutaPorRol><EntradaMineralPage /></RutaPorRol>
              } />            
            <Route path="/planillas" element={
              <RutaPorRol><PlanillasPage /></RutaPorRol>
              } />
            <Route path="/perfil" element={
              <RutaPorRol><PerfilPage /></RutaPorRol>
              } />
            <Route path="/dias-trabajados" element={
              <RutaPorRol><DiasTrabajadosPage /></RutaPorRol>
              } />
            <Route path="/pago" element={
              <RutaPorRol><PagoPage /></RutaPorRol>
              } />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;