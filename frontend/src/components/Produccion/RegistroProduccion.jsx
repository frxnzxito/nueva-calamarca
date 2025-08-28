import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RegistroProduccion() {
  const { token, usuario } = useAuth();
  const [usuariosMina, setUsuariosMina] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [form, setForm] = useState({
    fecha: '',
    turnoId: '',
    encargadoId: usuario.id,
    perforistaId: '',
    ayudanteId: '',
    topesPerforados: '',
    carrosSacados: '',
    sacosSacados: '',
    minaId: usuario.minaId
  });

  // Cargar usuarios de la misma mina
  useEffect(() => {
    fetch('http://localhost:3000/usuarios?minaId=' + usuario.minaId, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsuariosMina(data))
      .catch(err => console.error('❌ Error al cargar usuarios:', err));
  }, []);

  // Cargar turnos
  useEffect(() => {
    fetch('http://localhost:3000/turnos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTurnos(data))
      .catch(err => console.error('❌ Error al cargar turnos:', err));
  }, []);

  const handleSubmit = async () => {
    const {
      fecha, turnoId, encargadoId, perforistaId, ayudanteId,
      topesPerforados, carrosSacados, sacosSacados, minaId
    } = form;

    if (!fecha || !turnoId || !encargadoId || !perforistaId || !ayudanteId ||
        !topesPerforados || !carrosSacados || !sacosSacados) {
      alert('Completa todos los campos');
      return;
    }

    const res = await fetch('http://localhost:3000/produccion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (data.error) {
      alert(`❌ Error: ${data.error}`);
    } else {
      alert('✅ Producción registrada');
      setForm({
        fecha: '',
        turnoId: '',
        encargadoId: usuario.id,
        perforistaId: '',
        ayudanteId: '',
        topesPerforados: '',
        carrosSacados: '',
        sacosSacados: '',
        minaId: usuario.minaId
      });
    }
  };

  return (
    <div>
      <h3>
        📦 Registro de Producción — Mina: <strong>
                {typeof usuario.mina?.nombre === 'string'
                ? usuario.mina.nombre
                : `ID ${usuario.minaId}`}
          </strong>
        </h3>

      <input
        type="date"
        value={form.fecha}
        onChange={e => setForm({ ...form, fecha: e.target.value })}
      />

      <select
        value={form.turnoId}
        onChange={e => setForm({ ...form, turnoId: parseInt(e.target.value) })}
      >
        <option value="">Selecciona turno</option>
        {turnos.map(t => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>

      <select
        value={form.perforistaId}
        onChange={e => setForm({ ...form, perforistaId: parseInt(e.target.value) })}
      >
        <option value="">Selecciona perforista</option>
        {usuariosMina.map(u => (
          <option key={u.id} value={u.id}>{u.nombres} {u.apellidos}</option>
        ))}
      </select>

      <select
        value={form.ayudanteId}
        onChange={e => setForm({ ...form, ayudanteId: parseInt(e.target.value) })}
      >
        <option value="">Selecciona ayudante</option>
        {usuariosMina.map(u => (
          <option key={u.id} value={u.id}>{u.nombres} {u.apellidos}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Topes perforados"
        value={form.topesPerforados}
        onChange={e => setForm({ ...form, topesPerforados: parseInt(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Carros sacados"
        value={form.carrosSacados}
        onChange={e => setForm({ ...form, carrosSacados: parseInt(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Sacos sacados"
        value={form.sacosSacados}
        onChange={e => setForm({ ...form, sacosSacados: parseInt(e.target.value) })}
      />

      <button onClick={handleSubmit}>📤 Registrar producción</button>
    </div>
  );
}