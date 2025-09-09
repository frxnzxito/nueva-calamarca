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
      onLogin({ usuario: res.data.usuario, token: res.data.token });
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow w-100"
        style={{ maxWidth: '400px' }}
      >
        <h2 className="text-center mb-4">Ingreso al sistema</h2>

        <div className="mb-3">
          <label htmlFor="ci" className="form-label">CI</label>
          <input
            type="text"
            id="ci"
            className="form-control"
            placeholder="Carnet de identidad"
            value={ci}
            onChange={e => setCi(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Ingresar</button>

        {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default LoginForm;