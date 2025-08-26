// backend/index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

//Endpoint Obtener minas
app.get('/minas', async (req, res) => {
  try {
    const minas = await prisma.mina.findMany();
    res.json(minas);
  } catch (error) {
    console.error('❌ Error al obtener minas:', error);
    res.status(500).json({ error: error.message });
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

// Endpoint para registrar asistencia
app.post('/asistencia', async (req, res) => {
  try {
    const { fecha, usuarioId, turnoId, puestoTrabajoId } = req.body;

    // Validación básica
    if (!fecha || !usuarioId || !turnoId || !puestoTrabajoId) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar que el usuario sea Jornalero
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { rol: true }
    });

    if (!usuario || usuario.rol.nombre !== 'Jornalero') {
      return res.status(403).json({ error: 'Solo se registra asistencia de jornaleros' });
    }

    // Registrar asistencia
    const asistencia = await prisma.asistencia.create({
      data: {
        fecha: new Date(fecha),
        usuarioId,
        turnoId,
        puestoTrabajoId
      }
    });

    res.status(201).json(asistencia);
  } catch (error) {
    console.error(error);
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