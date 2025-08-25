import { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/login', { ci, password });
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.usuario);
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="text" placeholder="CI" value={ci} onChange={e => setCi(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Ingresar</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default LoginForm;