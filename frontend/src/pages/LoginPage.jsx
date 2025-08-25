import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // ✅ usamos login, no setUsuario
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/login', { ci, password });
      login(res.data.usuario); // ✅ actualiza el contexto
      navigate('/dashboard');
    } catch (error) {
      alert('❌ CI o contraseña incorrectos');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔐 Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <label>CI:</label>
        <input type="text" value={ci} onChange={e => setCi(e.target.value)} required />

        <label>Contraseña:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;