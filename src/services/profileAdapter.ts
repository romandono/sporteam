import * as profileService from './profileService';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { ProfileType } from '../generated/prisma/enums';

// ─── Response mappers ────────────────────────────────────────────────────────

interface JugadorNested {
  id: string;
  userId: string;
  nombreDeportivo: string | null;
  fechaNacimiento: Date | null;
  lateralidad: string | null;
  demarcacion: string[];
  altura: number | null;
  peso: number | null;
}

interface EntrenadorNested {
  id: string;
  userId: string;
  nombreDeportivo: string | null;
  telefono: string | null;
  fechaNacimiento: Date | null;
  entrenadorPorteros: boolean;
  titulacion: string[];
}

function jugadorResponse(profile: any): any {
  const u = profile.user;
  return {
    id: u?.id ?? profile.userId,
    nombre: u?.nombre,
    apellidos: u?.apellidos,
    email: u?.email,
    role: u?.role,
    estado: u?.estado,
    image: u?.image,
    google: u?.google,
    estadoDeportivo: u?.estadoDeportivo,
    clubId: u?.clubId,
    createdAt: u?.createdAt,
    updatedAt: u?.updatedAt,
    jugador: {
      id: profile.id,
      userId: profile.userId,
      nombreDeportivo: profile.nombreDeportivo,
      fechaNacimiento: profile.fechaNacimiento,
      lateralidad: profile.lateralidad,
      demarcacion: profile.demarcacion,
      altura: profile.altura ? Number(profile.altura) : null,
      peso: profile.peso ? Number(profile.peso) : null
    } as JugadorNested,
    estadisticas: profile.estadisticas ?? []
  };
}

function entrenadorResponse(profile: any): any {
  const u = profile.user;
  return {
    id: u?.id ?? profile.userId,
    nombre: u?.nombre,
    apellidos: u?.apellidos,
    email: u?.email,
    role: u?.role,
    estado: u?.estado,
    image: u?.image,
    google: u?.google,
    estadoDeportivo: u?.estadoDeportivo,
    clubId: u?.clubId,
    createdAt: u?.createdAt,
    updatedAt: u?.updatedAt,
    entrenador: {
      id: profile.id,
      userId: profile.userId,
      nombreDeportivo: profile.nombreDeportivo,
      telefono: profile.telefono,
      fechaNacimiento: profile.fechaNacimiento,
      entrenadorPorteros: profile.entrenadorPorteros,
      titulacion: profile.titulacion
    } as EntrenadorNested,
    club: u?.club ?? undefined
  };
}

// ─── Zone resolver (accepts name|id) ────────────────────────────────────────

async function resolveZonas(zonas: any[] | undefined): Promise<string[] | undefined> {
  if (!zonas?.length) return undefined;

  const ids: string[] = [];
  for (const z of zonas) {
    if (typeof z === 'string') {
      ids.push(z);
    } else if (z?.nombreZona) {
      const zone = await prisma.zona.findUnique({ where: { nombreZona: z.nombreZona } });
      if (zone) ids.push(zone.id);
    }
  }
  return ids.length ? ids : undefined;
}

// ─── Jugador adapter functions (backward compat) ────────────────────────────

export const getJugadores = async (desde = 0, limite = 5) => {
  const { profiles, total } = await profileService.getProfiles(ProfileType.JUGADOR, { desde, limite });
  return { jugadores: profiles.map(jugadorResponse), total };
};

export const getJugadorById = async (id: string) => {
  const profile = await profileService.getProfileByUserId(id, ProfileType.JUGADOR);
  return jugadorResponse(profile);
};

export const createJugador = async (data: any) => {
  const profile = await profileService.createProfile({
    profileType: ProfileType.JUGADOR,
    nombre: data.nombre,
    apellidos: data.apellidos,
    email: data.email,
    password: data.password,
    role: data.role,
    estadoDeportivo: data.estadoDeportivo,
    clubId: data.clubId,
    zonas: await resolveZonas(data.zonas),
    nombreDeportivo: data.nombreDeportivo,
    fechaNacimiento: data.fechaNacimiento,
    lateralidad: data.lateralidad,
    demarcacion: data.demarcacion,
    altura: data.altura,
    peso: data.peso
  });
  return jugadorResponse(profile);
};

export const updateJugador = async (id: string, body: any) => {
  const profile = await profileService.getProfileByUserId(id, ProfileType.JUGADOR);
  const updateData = { ...body };
  if (body.zonas) updateData.zonas = await resolveZonas(body.zonas);
  const updated = await profileService.updateProfile(profile.id, updateData);
  return jugadorResponse(updated);
};

export const searchJugadores = async (termino: string) => {
  const profiles = await profileService.searchProfiles(ProfileType.JUGADOR, termino);
  return profiles.map(jugadorResponse);
};

export const getJugadoresByZona = async (idZona: string, desde = 0, limite = 5) => {
  const { profiles, total } = await profileService.getProfilesByZona(ProfileType.JUGADOR, idZona, desde, limite);
  return { jugadores: profiles.map(jugadorResponse), total };
};

// ─── Entrenador adapter functions (backward compat) ─────────────────────────

export const getEntrenadores = async (desde = 0, limite = 20) => {
  const { profiles, total } = await profileService.getProfiles(ProfileType.ENTRENADOR, { desde, limite, onlyActive: true });
  return { entrenadores: profiles.map(entrenadorResponse), total };
};

export const getEntrenadorById = async (id: string) => {
  // Use direct Prisma call to include club (matches old service behavior)
  const profile = await prisma.profile.findFirst({
    where: { userId: id, profileType: ProfileType.ENTRENADOR },
    include: {
      user: { include: { club: true } },
      estadisticas: { include: { temporada: true } }
    }
  });
  if (!profile) {
    throw new AppError('Entrenador no encontrado', 404);
  }
  return entrenadorResponse(profile);
};

export const createEntrenador = async (data: any) => {
  const profile = await profileService.createProfile({
    profileType: ProfileType.ENTRENADOR,
    nombre: data.nombre,
    apellidos: data.apellidos,
    email: data.email,
    password: data.password,
    role: data.role,
    estadoDeportivo: data.estadoDeportivo,
    clubId: data.clubId,
    zonas: await resolveZonas(data.zonas),
    nombreDeportivo: data.nombreDeportivo,
    entrenadorPorteros: data.entrenadorPorteros,
    titulacion: data.titulacion,
    telefono: data.telefono
  });
  return entrenadorResponse(profile);
};

export const updateEntrenador = async (id: string, body: any) => {
  const profile = await profileService.getProfileByUserId(id, ProfileType.ENTRENADOR);
  const updateData = { ...body };
  if (body.zonas) updateData.zonas = await resolveZonas(body.zonas);
  const updated = await profileService.updateProfile(profile.id, updateData);
  return entrenadorResponse(updated);
};

export const searchEntrenadores = async (termino: string) => {
  const profiles = await profileService.searchProfiles(ProfileType.ENTRENADOR, termino);
  return profiles.map(entrenadorResponse);
};

export const getEntrenadoresByZona = async (idZona: string, desde = 0, limite = 5) => {
  const { profiles, total } = await profileService.getProfilesByZona(ProfileType.ENTRENADOR, idZona, desde, limite);
  return { entrenadores: profiles.map(entrenadorResponse), total };
};