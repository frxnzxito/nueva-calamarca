// backend/index.js
const { PrismaClient } = require('@prisma/client');
const { verificarToken } = require('./middleware/auth');
const prisma = new PrismaClient();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { parse } = require('dotenv');
const SECRET = '1234'; //


const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
// Endpoint para login
app.post('/login', async (req, res) => {
  const { ci, password } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { ci },
      select: {
        id: true,
        ci: true,
        nombres: true,
        apellidos: true,
        rolId: true, // ✅ este campo es clave
        minaId: true,
        passwordHash: true,
        rol: { select: { nombre: true } },
        mina: { select: { nombre: true } }
      }
    });

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(password, usuario.passwordHash);
    if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol.nombre },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        ci: usuario.ci,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        rolId: usuario.rolId, // ✅ este campo debe llegar al frontend
        rol: usuario.rol.nombre,
        minaId: usuario.minaId, // Nuevo campo minaId
        mina: usuario.mina?.nombre ?? null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el login' });
  }
});



// Endpoint para obtener usuarios, con filtro opcional por rol
app.get('/usuarios', async (req, res) => {
  const rol = req.query.rol;
  try {
    const usuarios = await prisma.usuario.findMany({
      where: rol ? { rol: { nombre: rol } } : {},
      include: { rol: true, mina: true }
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Endpoint para crear usuario
app.post('/usuarios', async (req, res) => {
  const { ci, nombres, apellidos, rolId, minaId, password } = req.body;
  const existente = await prisma.usuario.findUnique({ where: { ci } });
  if (existente) {
    return res.status(409).json({ error: 'Ya existe un usuario con ese CI' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const nuevo = await prisma.usuario.create({
      data: {
        ci,
        nombres,
        apellidos,
        rolId: parseInt(rolId),
        minaId: minaId ? parseInt(minaId) : null,
        passwordHash
      }
    });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para actualizar usuario
app.put('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { ci, nombres, apellidos, rolId, minaId } = req.body;
  const existente = await prisma.usuario.findFirst({
    where: {
      ci,
      NOT: { id: id } // excluye al usuario que estamos editando
    }
  });
  if (existente) {
    return res.status(409).json({ error: 'Otro usuario ya tiene ese CI' });
  }

  try {
    const actualizado = await prisma.usuario.update({
      where: { id },
      data: { ci, nombres, apellidos, rolId, minaId }
    });
    res.json(actualizado);
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para eliminar usuario
app.delete('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.usuario.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

//Endpoint para obtener roles
app.get('/roles', async (req, res) => {
  try {
    const roles = await prisma.rol.findMany();
    res.json(roles);
  } catch (error) {
    console.error('❌ Error al obtener roles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener turnos
app.get('/turnos', async (req, res) => {
  try {
    const turnos = await prisma.turno.findMany();
    res.json(turnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
});

// Endpoint para obtener minas (solo para roles autorizados)
app.get('/minas', verificarToken, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      include: { rol: true }
    });

    const rolPermitido = ['Administrador', 'Licenciado'];
    if (!usuario || !rolPermitido.includes(usuario.rol.nombre)) {
      return res.status(403).json({ error: 'No tienes permiso para ver minas' });
    }

    const minas = await prisma.mina.findMany({
      select: {
        id: true,
        nombre: true
      }
    });

    res.json(minas);
  } catch (error) {
    console.error('❌ Error al obtener minas:', error);
    res.status(500).json({ error: 'Error interno al obtener minas' });
  }
});

// Endpoint para obtener puestos de trabajo
app.get('/puestos', async (req, res) => {
  try {
    const puestos = await prisma.puestoTrabajo.findMany();
    res.json(puestos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener puestos de trabajo' });
  }
});

//Endpoint para obtener asistencias con datos relacionados
app.get('/asistencias', verificarToken, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      include: { rol: true }
    });

    if (!usuario || !usuario.rol) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const rango = usuario.rolId; // ← asegúrate de tener este campo en tu modelo
    const { fecha, turnoId, minaId } = req.query;

    let where = {};

    if (rango === 1 || rango === 2) {
        if (!minaId) {
          return res.status(400).json({ error: 'Debes seleccionar una mina para ver asistencias' });
        }
      // Ver todas las asistencias (sin minaId)
      if (minaId) where.usuario = { minaId: parseInt(minaId) };
      if (fecha) where.fecha = { equals: new Date(fecha) };
      if (turnoId) where.turnoId = parseInt(turnoId);
    } else if (rango === 3) {
      // Encargado de mina: filtra por su mina
      where.usuario = { minaId: usuario.minaId };
      if (fecha) where.fecha = { equals: new Date(fecha) };
      if (turnoId) where.turnoId = parseInt(turnoId);
    } else if (rango === 6) {
      // Jornalero: solo su propia asistencia
      where.usuarioId = usuario.id;
    } else {
      return res.status(403).json({ error: 'No tienes permiso para ver asistencias' });
    }


    const asistencias = await prisma.asistencia.findMany({
      where,
      include: {
        usuario: true,
        turno: true,
        puestoTrabajo: true,
        mina: true
      },
      orderBy: { fecha: 'desc' }
    });

    res.json(asistencias);
  } catch (error) {
    console.error('❌ Error al obtener asistencias:', error);
    res.status(500).json({ error: 'Error interno al obtener asistencias' });
  }
});

// Endpoint para registrar asistencia
app.post('/asistencia', verificarToken, async (req, res) => {
  try {
    const { usuarioId, turnoId, puestoTrabajoId, fecha } = req.body;

    // Validación básica
    const usuarioIdInt = parseInt(usuarioId);
    const turnoIdInt = parseInt(turnoId);
    const puestoTrabajoIdInt = parseInt(puestoTrabajoId);
    const fechaObj = new Date(fecha);

    if (!fechaObj || isNaN(usuarioIdInt) || isNaN(turnoIdInt) || isNaN(puestoTrabajoIdInt)) {
      return res.status(400).json({ error: 'Faltan datos obligatorios o están mal formateados' });
    }

    // Datos del usuario que registra
    const autorizado = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      include: { rol: true }
    });

    const rol = autorizado?.rol?.nombre;
    const rango = autorizado?.rol?.rango;
    const rolPermitido = ['Administrador', 'Licenciado', 'Encargado mina'];

    if (!autorizado || !rolPermitido.includes(rol)) {
      return res.status(403).json({ error: 'No tienes permiso para registrar asistencia' });
    }

    // Datos del jornalero
    const jornalero = await prisma.usuario.findUnique({
      where: { id: usuarioIdInt },
      include: { rol: true }
    });

    if (!jornalero || jornalero.rol.nombre !== 'Jornalero') {
      return res.status(403).json({ error: 'Solo se registra asistencia de jornaleros' });
    }

    // Validación cruzada por mina
    if (rol === 'Encargado mina' && autorizado.minaId !== jornalero.minaId) {
      return res.status(403).json({ error: 'No puedes registrar asistencia de un jornalero de otra mina' });
    }

// Validación cruzada para roles 1 y 2
    const minaSeleccionada = parseInt(req.body.minaId); // ← si decides enviar minaId desde el frontend
    if (['Administrador', 'Licenciado'].includes(rol)) {
      if (minaSeleccionada !== jornalero.minaId) {
        return res.status(403).json({
          error: 'El jornalero no pertenece a la mina seleccionada'
        });
      }
    }


    // Validación de asistencia duplicada (opcional)
    const asistenciaExistente = await prisma.asistencia.findFirst({
      where: {
        usuarioId: usuarioIdInt,
        fecha: fechaObj
      }
    });

    if (asistenciaExistente) {
      return res.status(409).json({ error: 'Ya existe una asistencia registrada para este jornalero en esta fecha' });
    }

    // Registrar asistencia con trazabilidad
    const asistencia = await prisma.asistencia.create({
      data: {
        fecha: fechaObj,
        usuarioId: usuarioIdInt,
        turnoId: turnoIdInt,
        puestoTrabajoId: puestoTrabajoIdInt,
        minaId: jornalero.minaId
      }
    });

    console.log('✅ Asistencia registrada:', asistencia);
    res.status(201).json(asistencia);
  } catch (error) {
    console.error('❌ Error al registrar asistencia:', error);
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
});

//Endpoint para registrar producción
app.post('/produccion', async (req, res) => {
  const {
    fecha, turnoId, encargadoId,
    perforistaId, ayudanteId,
    topesPerforados, carrosSacados, sacosSacados
  } = req.body;

  try {
    // Validación: perforista ≠ ayudante
    if (perforistaId === ayudanteId) {
      return res.status(400).json({ error: 'El perforista y el ayudante deben ser distintos' });
    }

    // Validación: encargado debe tener mina asignada
    const encargado = await prisma.usuario.findUnique({
      where: { id: encargadoId },
      include: { mina: true }
    });

    if (!encargado || !encargado.mina) {
      return res.status(400).json({ error: 'Encargado sin mina asignada' });
    }

    const minaId = encargado.mina.id;

    // Validación: perforista y ayudante deben ser jornaleros
    const [perforista, ayudante] = await Promise.all([
      prisma.usuario.findUnique({ where: { id: perforistaId }, include: { rol: true } }),
      prisma.usuario.findUnique({ where: { id: ayudanteId }, include: { rol: true } })
    ]);

    if (!perforista || perforista.rol.nombre !== 'Jornalero') {
      return res.status(403).json({ error: 'El perforista debe tener rol Jornalero' });
    }

    if (!ayudante || ayudante.rol.nombre !== 'Jornalero') {
      return res.status(403).json({ error: 'El ayudante debe tener rol Jornalero' });
    }

    // Validación: no duplicar producción por fecha + turno + mina
    const existe = await prisma.produccion.findFirst({
      where: {
        fecha: new Date(fecha),
        turnoId: parseInt(turnoId),
        minaId
      }
    });

    if (existe) {
      return res.status(409).json({ error: 'Ya existe una producción registrada para esa fecha, turno y mina' });
    }

    // Registro
    const produccion = await prisma.produccion.create({
      data: {
        fecha: new Date(fecha),
        turnoId: parseInt(turnoId),
        encargadoId: parseInt(encargadoId),
        perforistaId: parseInt(perforistaId),
        ayudanteId: parseInt(ayudanteId),
        topesPerforados: parseInt(topesPerforados),
        carrosSacados: parseInt(carrosSacados),
        sacosSacados: parseInt(sacosSacados),
        minaId
      }
    });

    res.status(201).json(produccion);
  } catch (error) {
    console.error('❌ Error al registrar producción:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener producciones con filtros opcionales
app.get('/produccion', async (req, res) => {
  const { minaId, fecha, turnoId } = req.query;

  try {
      const where = {};
      
      if (minaId) where.minaId = parseInt(minaId);
      if (fecha) where.fecha = new Date(fecha);
      if (turnoId) where.turnoId = parseInt(turnoId);

    const produccion = await prisma.produccion.findMany({
      where,
      include: {
        turno: true,
        perforista: true,
        ayudante: true
      }
    });

    res.json(produccion);
  } catch (error) {
    console.error('❌ Error al obtener producciones:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para eliminar producción por id
app.delete('/produccion/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.produccion.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    console.error('❌ Error al eliminar producción:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});