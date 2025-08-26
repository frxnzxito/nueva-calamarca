import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) return <p>Cargando perfil...</p>;

  return
};

export default Dashboard;