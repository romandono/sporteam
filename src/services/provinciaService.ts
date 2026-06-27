import prisma from '../lib/prisma';

export const getProvincias = async () => {
  return await prisma.provincia.findMany({ orderBy: { nombre: 'asc' } });
};
