import prisma from '../lib/prisma';

export const getZonas = async () => {
  return await prisma.zona.findMany({ orderBy: { nombreZona: 'asc' } });
};
