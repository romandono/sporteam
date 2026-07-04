import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

// ── Shared helpers ──────────────────────────────────────────

const userSelect = {
  id: true, nombre: true, apellidos: true, email: true,
  role: true, estado: true, image: true, google: true,
  estadoDeportivo: true, clubId: true, createdAt: true, updatedAt: true,
};

function jugadorResponse(profile: any) {
  const { user, nombreDeportivo, fechaNacimiento, lateralidad, demarcacion, altura, peso, ...rest } = profile;
  return {
    ...(user || rest),
    jugador: { nombreDeportivo, fechaNacimiento, lateralidad, demarcacion, altura, peso },
  };
}

function entrenadorResponse(profile: any) {
  const { user, nombreDeportivo, telefono, entrenadorPorteros, titulacion, ...rest } = profile;
  return {
    ...(user || rest),
    entrenador: { nombreDeportivo, telefono, entrenadorPorteros, titulacion },
  };
}

// ── Jugador adapter functions ───────────────────────────────

export const getJugadores = async (desde = 0, limite = 5) => {
  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where: { profileType: 'JUGADOR' },
      include: { user: { select: userSelect }, estadisticas: { include: { temporada: true } } },
      skip: desde, take: limite, orderBy: { createdAt: 'desc' },
    }),
    prisma.profile.count({ where: { profileType: 'JUGADOR' } }),
  ]);
  return { jugadores: profiles.map(jugadorResponse), total };
};

export const searchJugadores = async (termino: string) => {
  const profiles = await prisma.profile.findMany({
    where: { profileType: 'JUGADOR', user: { nombre: { contains: termino, mode: 'insensitive' } } },
    include: { user: { select: userSelect }, estadisticas: { include: { temporada: true } } },
  });
  return profiles.map(jugadorResponse);
};

export const getJugadorById = async (id: string) => {
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: { user: { select: userSelect }, estadisticas: { include: { temporada: true } } },
  });
  if (!profile || profile.profileType !== 'JUGADOR') throw new AppError('Jugador no encontrado', 404);
  return jugadorResponse(profile);
};

export const getJugadoresByZona = async (idZona: string, desde = 0, limite = 5) => {
  const jugadores = await prisma.profile.findMany({
    where: { profileType: 'JUGADOR', user: { zonas: { some: { zonaId: idZona } } } },
    include: { user: { select: userSelect }, estadisticas: { include: { temporada: true } } },
    skip: desde, take: limite, orderBy: { createdAt: 'desc' },
  });
  const total = await prisma.profile.count({
    where: { profileType: 'JUGADOR', user: { zonas: { some: { zonaId: idZona } } } },
  });
  return { jugadores: jugadores.map(jugadorResponse), total };
};

export const createJugador = async (params: any) => {
  const profile = await prisma.profile.create({
    data: {
      profileType: 'JUGADOR',
      nombreDeportivo: params.nombreDeportivo,
      fechaNacimiento: params.fechaNacimiento ? new Date(params.fechaNacimiento) : undefined,
      lateralidad: params.lateralidad,
      demarcacion: params.demarcacion || [],
      altura: params.altura,
      peso: params.peso,
      user: {
        create: {
          nombre: params.nombre, apellidos: params.apellidos,
          email: params.email, password: bcrypt.hashSync(params.password, 10),
          role: 'JUGADOR_ROLE', estado: true,
          estadoDeportivo: params.estadoDeportivo, clubId: params.clubId,
          zonas: params.zonas?.length
            ? { create: params.zonas.map((zonaId: string) => ({ zonaId })) }
            : undefined,
        },
      },
    },
    include: { user: { select: userSelect }, estadisticas: { include: { temporada: true } } },
  });
  return jugadorResponse(profile);
};

export const updateJugador = async (id: string, body: any) => {
  const profile = await prisma.profile.findUnique({ where: { id }, select: { userId: true } });
  if (!profile) throw new AppError('Jugador no encontrado', 404);

  const allowedUserFields = ['nombre', 'apellidos', 'email', 'image', 'estado', 'estadoDeportivo', 'clubId'];
  const userData: any = {};
  for (const f of allowedUserFields) if (body[f] !== undefined) userData[f] = body[f];
  if (Object.keys(userData).length > 0) {
    await prisma.user.update({ where: { id: profile.userId }, data: userData });
  }

  const allowedProfileFields = ['nombreDeportivo', 'lateralidad', 'demarcacion', 'altura', 'peso'];
  const profileData: any = {};
  for (const f of allowedProfileFields) if (body[f] !== undefined) profileData[f] = body[f];
  if (body.fechaNacimiento !== undefined) profileData.fechaNacimiento = new Date(body.fechaNacimiento);
  if (Object.keys(profileData).length > 0) {
    await prisma.profile.update({ where: { id }, data: profileData });
  }

  if (body.zonas) {
    await prisma.userZona.deleteMany({ where: { userId: profile.userId } });
    if (body.zonas.length > 0) {
      await prisma.userZona.createMany({ data: body.zonas.map((zonaId: string) => ({ userId: profile.userId, zonaId })) });
    }
  }

  return await getJugadorById(id);
};

// ── Entrenador adapter functions ────────────────────────────

export const getEntrenadores = async (desde = 0, limite = 20) => {
  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where: { profileType: 'ENTRENADOR', user: { estado: true } },
      include: { user: { select: userSelect } },
      skip: desde, take: limite, orderBy: { createdAt: 'desc' },
    }),
    prisma.profile.count({ where: { profileType: 'ENTRENADOR', user: { estado: true } } }),
  ]);
  return { entrenadores: profiles.map(entrenadorResponse), total };
};

export const searchEntrenadores = async (termino: string) => {
  const profiles = await prisma.profile.findMany({
    where: { profileType: 'ENTRENADOR', user: { nombre: { contains: termino, mode: 'insensitive' } } },
    include: { user: { select: userSelect } },
  });
  return profiles.map(entrenadorResponse);
};

export const getEntrenadorById = async (id: string) => {
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: { user: { select: { ...userSelect, club: true } } },
  });
  if (!profile || profile.profileType !== 'ENTRENADOR') throw new AppError('Entrenador no encontrado', 404);
  return entrenadorResponse(profile);
};

export const getEntrenadoresByZona = async (idZona: string, desde = 0, limite = 5) => {
  const entrenadores = await prisma.profile.findMany({
    where: { profileType: 'ENTRENADOR', user: { estado: true, zonas: { some: { zonaId: idZona } } } },
    include: { user: { select: userSelect } },
    skip: desde, take: limite, orderBy: { createdAt: 'desc' },
  });
  const total = await prisma.profile.count({
    where: { profileType: 'ENTRENADOR', user: { estado: true, zonas: { some: { zonaId: idZona } } } },
  });
  return { entrenadores: entrenadores.map(entrenadorResponse), total };
};

export const createEntrenador = async (params: any) => {
  const profile = await prisma.profile.create({
    data: {
      profileType: 'ENTRENADOR',
      nombreDeportivo: params.nombreDeportivo,
      entrenadorPorteros: params.entrenadorPorteros || false,
      titulacion: params.titulacion || [],
      telefono: params.telefono,
      user: {
        create: {
          nombre: params.nombre, apellidos: params.apellidos,
          email: params.email, password: bcrypt.hashSync(params.password, 10),
          role: 'ENTRENADOR_ROLE', estado: true,
          estadoDeportivo: params.estadoDeportivo, clubId: params.clubId,
          zonas: params.zonas?.length
            ? { create: params.zonas.map((zonaId: string) => ({ zonaId })) }
            : undefined,
        },
      },
    },
    include: { user: { select: userSelect } },
  });
  return entrenadorResponse(profile);
};

export const updateEntrenador = async (id: string, body: any) => {
  const profile = await prisma.profile.findUnique({ where: { id }, select: { userId: true } });
  if (!profile) throw new AppError('Entrenador no encontrado', 404);

  const allowedUserFields = ['nombre', 'apellidos', 'email', 'image', 'estado', 'estadoDeportivo', 'clubId'];
  const userData: any = {};
  for (const f of allowedUserFields) if (body[f] !== undefined) userData[f] = body[f];
  if (Object.keys(userData).length > 0) {
    await prisma.user.update({ where: { id: profile.userId }, data: userData });
  }

  const allowedProfileFields = ['nombreDeportivo', 'entrenadorPorteros', 'titulacion', 'telefono'];
  const profileData: any = {};
  for (const f of allowedProfileFields) if (body[f] !== undefined) profileData[f] = body[f];
  if (Object.keys(profileData).length > 0) {
    await prisma.profile.update({ where: { id }, data: profileData });
  }

  if (body.zonas) {
    await prisma.userZona.deleteMany({ where: { userId: profile.userId } });
    if (body.zonas.length > 0) {
      await prisma.userZona.createMany({ data: body.zonas.map((zonaId: string) => ({ userId: profile.userId, zonaId })) });
    }
  }

  return await getEntrenadorById(id);
};