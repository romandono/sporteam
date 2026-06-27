import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getEntrenadores = async (desde = 0, limite = 20) => {
  const [entrenadores, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'ENTRENADOR_ROLE', estado: true },
      include: { entrenador: true },
      skip: desde,
      take: limite,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where: { role: 'ENTRENADOR_ROLE', estado: true } })
  ]);

  return { entrenadores, total };
};

export const searchEntrenadores = async (termino: string) => {
  return await prisma.user.findMany({
    where: {
      role: 'ENTRENADOR_ROLE',
      nombre: { contains: termino, mode: 'insensitive' }
    },
    include: { entrenador: true }
  });
};

export const getEntrenadorById = async (id: string) => {
  const entrenador = await prisma.user.findUnique({
    where: { id },
    include: {
      entrenador: true,
      club: true
    }
  });

  if (!entrenador || entrenador.role !== 'ENTRENADOR_ROLE') {
    throw new AppError('Entrenador no encontrado', 404);
  }
  return entrenador;
};

export const getEntrenadoresByZona = async (idZona: string, desde = 0, limite = 5) => {
  const [entrenadores, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'ENTRENADOR_ROLE',
        estado: true,
        zonas: { some: { zonaId: idZona } }
      },
      include: { entrenador: true },
      skip: desde,
      take: limite,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({
      where: {
        role: 'ENTRENADOR_ROLE',
        estado: true,
        zonas: { some: { zonaId: idZona } }
      }
    })
  ]);

  return { entrenadores, total };
};

export const createEntrenador = async (params: {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  role: string;
  estadoDeportivo?: string;
  zonas?: string[];
  clubId?: string;
  nombreDeportivo?: string;
  entrenadorPorteros?: boolean;
  titulacion?: string[];
  telefono?: string;
}) => {
  const entrenador = await prisma.user.create({
    data: {
      nombre: params.nombre,
      apellidos: params.apellidos,
      email: params.email,
      password: bcrypt.hashSync(params.password, 10),
      role: 'ENTRENADOR_ROLE',
      estado: true,
      estadoDeportivo: params.estadoDeportivo,
      clubId: params.clubId,
      zonas: params.zonas?.length
        ? { create: params.zonas.map(zonaId => ({ zonaId })) }
        : undefined,
      entrenador: {
        create: {
          nombreDeportivo: params.nombreDeportivo,
          entrenadorPorteros: params.entrenadorPorteros || false,
          titulacion: params.titulacion || [],
          telefono: params.telefono
        }
      }
    },
    include: { entrenador: true }
  });

  return entrenador;
};

export const updateEntrenador = async (id: string, body: any) => {
  const allowedUserFields = ['nombre', 'apellidos', 'email', 'image', 'estado', 'estadoDeportivo', 'clubId'];
  const userData: any = {};
  for (const field of allowedUserFields) {
    if (body[field] !== undefined) userData[field] = body[field];
  }

  const allowedEntrenadorFields = ['nombreDeportivo', 'entrenadorPorteros', 'titulacion', 'telefono'];
  const entrenadorData: any = {};
  for (const field of allowedEntrenadorFields) {
    if (body[field] !== undefined) entrenadorData[field] = body[field];
  }

  if (Object.keys(userData).length > 0) {
    await prisma.user.update({ where: { id }, data: userData });
  }

  if (Object.keys(entrenadorData).length > 0) {
    await prisma.entrenador.upsert({
      where: { userId: id },
      create: { userId: id, ...entrenadorData },
      update: entrenadorData
    });
  }

  if (body.zonas) {
    await prisma.userZona.deleteMany({ where: { userId: id } });
    if (body.zonas.length > 0) {
      await prisma.userZona.createMany({
        data: body.zonas.map((zonaId: string) => ({ userId: id, zonaId }))
      });
    }
  }

  return await getEntrenadorById(id);
};
