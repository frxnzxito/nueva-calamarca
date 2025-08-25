import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProduccionPage = () => {
  const { usuario } = useContext(AuthContext);
  const [minas, setMinas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [jornaleros, setJornaleros] = useState([]);
  const [produccion, setProduccion] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('');
  const [filtroMina, setFiltroMina] = useState('');
  const [formulario, setFormulario] = useState({
    fecha: '',
    turnoId: '',
    perforistaId: '',
    ayudanteId: '',
    topesPerforados: '',
    carrosSacados: '',
    sacosSacados: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3000/minas').then(res => setMinas(res.data));
    axios.get('http://localhost:3000/turnos').then(res => setTurnos(res.data));

    cargarProduccion();
  }, [filtroMina, filtroFecha, filtroTurno]);

  const cargarProduccion = async () => {
    try {
      const res = await axios.get('http://localhost:3000/produccion', {
        params: {
          mina: filtroMina,
          fecha: filtroFecha,
          turnoId: filtroTurno
        }
      });
      setProduccion(res.data);
    } catch (error) {
      console.error('❌ Error al cargar producciones:', error);
    }
  };

  const eliminarProduccion = async (id) => {
    if (!confirm('¿Eliminar este registro de producción?')) return;
    try {
      await axios.delete(`http://localhost:3000/produccion/${id}`);
      cargarProduccion();
    } catch (error) {
      console.error('❌ Error al eliminar producción:', error);
    }
  };

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
        };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (formulario.perforistaId === formulario.ayudanteId) {
        alert('❌ El perforista y el ayudante deben ser distintos');
        return;
    }

    try {
        const payload = {
        fecha: formulario.fecha,
        turnoId: Number(formulario.turnoId),
        encargadoId: usuario.id, // viene del contexto
        perforistaId: Number(formulario.perforistaId),
        ayudanteId: Number(formulario.ayudanteId),
        topesPerforados: Number(formulario.topesPerforados),
        carrosSacados: Number(formulario.carrosSacados),
        sacosSacados: Number(formulario.sacosSacados)
        };

        const res = await axios.post('http://localhost:3000/produccion', payload);
        alert('✅ Producción registrada');
        console.log(res.data);
    }   catch (error) {
        alert('❌ Error al registrar producción');
        console.error(error);
    }
    };

  return (
    
    <div>
      <h2>Producciones registradas</h2>
      
      <label>Filtrar por fecha:</label>
      <input type="date" value={filtroFecha ?? ''} onChange={e => setFiltroFecha(e.target.value)} />
        <label>Filtrar por mina:</label>
        <select value={filtroMina ?? ''} onChange={e => setFiltroMina(e.target.value)}>
            <option value="">Todas</option>
            {minas.map(mina => (
                <option key={mina.id} value={mina.id}>{mina.nombre}</option>
            ))}
        </select>
        <label>Filtrar por turno:</label>
        <select value={filtroTurno ?? ''} onChange={e => setFiltroTurno(e.target.value)}>
            <option value="">Todos</option>
            {turnos.map(turno => (
                <option key={turno.id} value={turno.id}>{turno.nombre}</option>
            ))}
        </select>
        
    <button onClick={cargarProduccion}>🔍 Buscar producciones</button>


        <form onSubmit={handleSubmit}>
            <label>Fecha:</label>
            <input
                type="date"
                name="fecha"
                value={formulario.fecha ?? ''}
                onChange={handleChange}
                required
            />

            <label>Turno:</label>
            <select
                name="turnoId"
                value={formulario.turnoId ?? ''}
                onChange={handleChange}
                required
            >
                <option value="">Seleccionar turno</option>
                {turnos.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
            </select>

            <label>Perforista:</label>
            <select
                name="perforistaId"
                value={formulario.perforistaId ?? ''}
                onChange={handleChange}
                required
            >
                <option value="">Seleccionar perforista</option>
                {jornaleros.map(j => (
                <option key={j.id} value={j.id}>{j.nombres}</option>
                ))}
            </select>

            <label>Ayudante:</label>
            <select
                name="ayudanteId"
                value={formulario.ayudanteId ?? ''}
                onChange={handleChange}
                required
            >
                <option value="">Seleccionar ayudante</option>
                {jornaleros.map(j => (
                <option key={j.id} value={j.id}>{j.nombres}</option>
                ))}
            </select>

            <label>Topes perforados:</label>
            <input
                type="number"
                name="topesPerforados"
                value={formulario.topesPerforados ?? ''}
                onChange={handleChange}
                required
            />

            <label>Carros sacados:</label>
            <input
                type="number"
                name="carrosSacados"
                value={formulario.carrosSacados ?? ''}
                onChange={handleChange}
                required
            />

            <label>Sacos sacados:</label>
            <input
                type="number"
                name="sacosSacados"
                value={formulario.sacosSacados ?? ''}
                onChange={handleChange}
                required
            />

            <button type="submit">Registrar producción</button>
        </form>
    </div>
  );
};

export default ProduccionPage;