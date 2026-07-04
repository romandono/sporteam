import prisma from '../lib/prisma';
import app from '../app';

const connectDB = async () => {
  await prisma.$connect();
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

const TABLES = [
  'user_zonas', 'estadisticas', 'perfiles',
  'users', 'clubs', 'temporadas', 'provincias', 'zonas', 'localidades'
].map(t => `"${t}"`).join(', ');

const cleanDB = async () => {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${TABLES} CASCADE`);
};

export { app, connectDB, disconnectDB, cleanDB, prisma };
