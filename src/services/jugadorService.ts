import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getJugadores = async (desde = 0, limite = 5) => {
  const [jugadores, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'JUGADOR_ROLE' },
      include: {
        jugador: true,
        estadisticas: { include: { temporada: true } }
      },
      skip: desde,
      take: limite,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where: { role: 'JUGADOR_ROLE' } })
  ]);

  return { jugadores, total };
};

export const searchJugadores = async (termino: string) => {
  return await prisma.user.findMany({
    where: {
      role: 'JUGADOR_ROLE',
      nombre: { contains: termino, mode: 'insensitive' }
    },
    include: {
      jugador: true,
      estadisticas: { include: { temporada: true } }
    }
  });
};

export const getJugadorById = async (id: string) => {
  const jugador = await prisma.user.findUnique({
    where: { id },
    include: {
      jugador: true,
      estadisticas: { include: { temporada: true } }
    }
  });

  if (!jugador || jugador.role !== 'JUGADOR_ROLE') {
    throw new AppError('Jugador no encontrado', 404);
  }
  return jugador;
};

export const getJugadoresByZona = async (idZona: string, desde = 0, limite = 5) => {
  const [jugadores, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'JUGADOR_ROLE',
        zonas: { some: { zonaId: idZona } }
      },
      include: {
        jugador: true,
        estadisticas: { include: { temporada: true } }
      },
      skip: desde,
      take: limite,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({
      where: {
        role: 'JUGADOR_ROLE',
        zonas: { some: { zonaId: idZona } }
      }
    })
  ]);

  return { jugadores, total };
};

export const createJugador = async (params: {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  role: string;
  estadoDeportivo?: string;
  zonas?: string[];
  clubId?: string;
  nombreDeportivo?: string;
  fechaNacimiento?: string;
  lateralidad?: string;
  demarcacion?: string[];
  altura?: number;
  peso?: number;
}) => {
  const jugador = await prisma.user.create({
    data: {
      nombre: params.nombre,
      apellidos: params.apellidos,
      email: params.email,
      password: bcrypt.hashSync(params.password, 10),
      role: 'JUGADOR_ROLE',
      estado: true,
      estadoDeportivo: params.estadoDeportivo,
      clubId: params.clubId,
      zonas: params.zonas?.length
        ? { create: params.zonas.map(zonaId => ({ zonaId })) }
        : undefined,
      jugador: {
        create: {
          nombreDeportivo: params.nombreDeportivo,
          fechaNacimiento: params.fechaNacimiento ? new Date(params.fechaNacimiento) : undefined,
          lateralidad: params.lateralidad,
          demarcacion: params.demarcacion || [],
          altura: params.altura,
          peso: params.peso
        }
      }
    },
    include: { jugador: true, estadisticas: { include: { temporada: true } } }
  });

  return jugador;
};

export const updateJugador = async (id: string, body: any) => {
  const allowedUserFields = ['nombre', 'apellidos', 'email', 'image', 'estado', 'estadoDeportivo', 'clubId'];
  const userData: any = {};
  for (const field of allowedUserFields) {
    if (body[field] !== undefined) userData[field] = body[field];
  }

  const allowedJugadorFields = ['nombreDeportivo', 'lateralidad', 'demarcacion', 'altura', 'peso'];
  const jugadorData: any = {};
  for (const field of allowedJugadorFields) {
    if (body[field] !== undefined) jugadorData[field] = body[field];
  }
  if (body.fechaNacimiento !== undefined) {
    jugadorData.fechaNacimiento = new Date(body.fechaNacimiento);
  }

  if (Object.keys(userData).length > 0) {
    await prisma.user.update({ where: { id }, data: userData });
  }

  if (Object.keys(jugadorData).length > 0) {
    await prisma.jugador.upsert({
      where: { userId: id },
      create: { userId: id, ...jugadorData },
      update: jugadorData
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

  return await getJugadorById(id);
};
