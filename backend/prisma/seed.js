// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roles = ['Administrador', 'Licenciado', 'Encargado mina', 'Encargado ingenio', 'Chofer', 'Jornalero'];
  const turnos = ['Primera', 'Segunda', 'Tercera'];
  const puestos = ['Perforista', 'Ayudante de Perforista', 'Güinchero', 'Jalactiri', 'Buzonero', 'Chasquiri', 'Carrero', 'Zorrero', 'Topista'];

  for (const nombre of roles) {
    await prisma.rol.create({ data: { nombre } });
  }

  for (const nombre of turnos) {
    await prisma.turno.create({ data: { nombre } });
  }

  for (const nombre of puestos) {
    await prisma.puestoTrabajo.create({ data: { nombre } });
  }

  console.log('Datos iniciales insertados');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());