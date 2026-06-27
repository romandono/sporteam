import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getEstadisticaById = async (id: string) => {
  const estadistica = await prisma.estadistica.findUnique({
    where: { id },
    include: { temporada: true }
  });
  if (!estadistica) {
    throw new AppError('Estadística no encontrada', 404);
  }
  return estadistica;
};
