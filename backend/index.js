// backend/index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Nueva Calamarca funcionando correctamente');
});

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});