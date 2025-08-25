import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import LoginForm from './components/Login/LoginForm';
import MenuPorRol from './components/Menu/MenuPorRol';

// Ventanas por rol
import UsuariosPage from './pages/UsuariosPage';
import ProduccionPage from './pages/ProduccionPage';
import AsistenciasPage from './pages/AsistenciasPage';
import EntradaMineralPage from './pages/EntradaMineralPage';
import SalidaMineralPage from './pages/SalidaMineralPage';
import PlanillasPage from './pages/PlanillasPage';
import PerfilPage from './pages/PerfilPage';
import DiasTrabajadosPage from './pages/DiasTrabajadosPage';
import PagoPage from './pages/PagoPage';

const AppRouter = () => {
  const { usuario, login } = useContext(AuthContext);

  if (!usuario) return <LoginForm onLogin={login} />;

  return (
    <BrowserRouter>
      <MenuPorRol />
      <Routes>
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/produccion" element={<ProduccionPage />} />
        <Route path="/asistencias" element={<AsistenciasPage />} />
        <Route path="/entrada-mineral" element={<EntradaMineralPage />} />
        <Route path="/salida-mineral" element={<SalidaMineralPage />} />
        <Route path="/planillas" element={<PlanillasPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/dias-trabajados" element={<DiasTrabajadosPage />} />
        <Route path="/pago" element={<PagoPage />} />
        <Route path="*" element={<Navigate to="/perfil" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;