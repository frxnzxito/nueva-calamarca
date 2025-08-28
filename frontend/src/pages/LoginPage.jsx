import LoginForm from '../components/Login/LoginForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
  const { login } = useAuth(); // ✅ usa login, no setUsuario
  const navigate = useNavigate();

  const handleLogin = ({ usuario, token }) => {
      console.log('login exitoso', usuario);
    login({ usuario, token }); // guarda en contexto
    navigate('/'); // redirige al layout principal
  };

  return <LoginForm onLogin={handleLogin} />;
}