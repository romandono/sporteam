import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getClubs = async (desde = 0, limite = 5) => {
  const [clubs, total] = await Promise.all([
    prisma.club.findMany({
      skip: desde,
      take: limite,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.club.count()
  ]);

  return { clubs, total };
};

export const searchClubs = async (termino: string) => {
  return await prisma.club.findMany({
    where: { nombre: { contains: termino, mode: 'insensitive' } },
    include: { provincia: true, zona: true }
  });
};

export const getClubById = async (id: string) => {
  const club = await prisma.club.findUnique({
    where: { id },
    include: { provincia: true, zona: true }
  });
  if (!club) {
    throw new AppError('El club no existe en la base de datos', 404);
  }
  return club;
};

export const createClub = async (params: {
  nombre: string;
  localidad?: string;
  provinciaId?: string;
  modalidad?: string;
  image?: string;
  zonaId?: string;
}) => {
  return await prisma.club.create({
    data: {
      nombre: params.nombre,
      localidad: params.localidad,
      provinciaId: params.provinciaId,
      modalidad: params.modalidad,
      image: params.image,
      zonaId: params.zonaId
    },
    include: { provincia: true, zona: true }
  });
};

export const updateClub = async (id: string, body: any) => {
  const allowedFields = ['nombre', 'localidad', 'provinciaId', 'modalidad', 'zonaId'];
  const data: any = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }

  const club = await prisma.club.update({
    where: { id },
    data,
    include: { provincia: true, zona: true }
  });

  return club;
};

export const deleteClub = async (id: string) => {
  const club = await prisma.club.findUnique({ where: { id } });
  if (!club) {
    throw new AppError('El club no está registrado', 404);
  }

  await prisma.club.delete({ where: { id } });
  return club;
};

export const getClubsByZona = async (idZona: string, desde = 0, limite = 5) => {
  const [clubs, total] = await Promise.all([
    prisma.club.findMany({
      where: { zonaId: idZona },
      include: { provincia: true, zona: true },
      skip: desde,
      take: limite,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.club.count({ where: { zonaId: idZona } })
  ]);

  return { clubs, total };
};
