import { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true); // ← para evitar render prematuro

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedUsuario = localStorage.getItem('usuario');
      const storedToken = localStorage.getItem('token');

      if (storedUsuario && storedToken) {
        setUsuario(JSON.parse(storedUsuario));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('❌ Error al cargar sesión:', error);
      logout(); // ← limpieza segura si hay error
    } finally {
      setCargando(false);
    }
  }, []);

  // Guardar datos al iniciar sesión
  const login = ({ usuario, token }) => {
    if (!usuario || !token) {
      console.warn('⚠️ Datos incompletos en login');
      return;
    }

    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
    setUsuario(usuario);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);