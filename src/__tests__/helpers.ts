import prisma from '../lib/prisma';
import app from '../app';

const connectDB = async () => {
  await prisma.$connect();
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

const TABLES = [
  'user_zonas', 'estadisticas', 'jugadores', 'entrenadores',
  'users', 'clubs', 'temporadas', 'provincias', 'zonas', 'localidades'
];

const cleanDB = async () => {
  for (const table of TABLES) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
  }
};

export { app, connectDB, disconnectDB, cleanDB, prisma };
