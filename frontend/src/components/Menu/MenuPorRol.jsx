import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MenuPorRol = () => {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!usuario) return null;

  const botones = [];

  const agregar = (label, ruta) => botones.push(
    <button key={ruta} onClick={() => navigate(ruta)}>{label}</button>
  );

  switch (usuario.rol) {
    case 'Administrador':
    case 'Licenciado':
      agregar('Usuarios', '/usuarios');
      agregar('Producción', '/produccion');
      agregar('Asistencias', '/asistencias');
      agregar('Entrada Mineral', '/entrada-mineral');
      agregar('Salida Mineral', '/salida-mineral');
      agregar('Planillas', '/planillas');
      break;

    case 'Encargado mina':
      agregar('Usuarios', '/usuarios');
      agregar('Producción', '/produccion');
      agregar('Asistencias', '/asistencias');
      agregar('Salida Mineral', '/salida-mineral');
      break;

    case 'Encargado ingenio':
      agregar('Entrada Mineral', '/entrada-mineral');
      break;

    case 'Chofer':
      agregar('Perfil', '/perfil');
      break;

    case 'Jornalero':
      agregar('Perfil', '/perfil');
      agregar('Días trabajados', '/dias-trabajados');
      agregar('Pago', '/pago');
      break;

    default:
      agregar('Inicio', '/');
  }

  return (
    <div>
      <h3>Menú principal</h3>
      {botones}
    </div>
  );
};

export default MenuPorRol;