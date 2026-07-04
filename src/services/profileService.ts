import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { ProfileType } from '../generated/prisma/enums';

interface ProfileOptions {
  desde?: number;
  limite?: number;
  onlyActive?: boolean;
}

interface CreateProfileInput {
  // User fields
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  role: string;
  estado?: boolean;
  estadoDeportivo?: string;
  clubId?: string;
  zonas?: string[];
  image?: string;
  google?: boolean;

  // Profile fields
  profileType: ProfileType;
  nombreDeportivo?: string;
  telefono?: string;
  fechaNacimiento?: string;
  lateralidad?: string;
  demarcacion?: string[];
  altura?: number;
  peso?: number;
  entrenadorPorteros?: boolean;
  titulacion?: string[];
  localidadId?: string;
  metadata?: any;
}

type UpdateProfileInput = Partial<Omit<CreateProfileInput, 'profileType' | 'password'>> & {
  password?: string;
};

const profileIncludes = {
  user: true,
  estadisticas: { include: { temporada: true } }
};

export const getProfiles = async (
  profileType: ProfileType,
  options?: ProfileOptions
): Promise<{ profiles: any[]; total: number }> => {
  const desde = options?.desde ?? 0;
  const limite = options?.limite ?? 20;
  const onlyActive = options?.onlyActive ?? false;

  const where: any = { profileType };
  if (onlyActive) {
    where.user = { estado: true };
  }

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      include: profileIncludes,
      skip: desde,
      take: limite,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.profile.count({ where })
  ]);

  return { profiles, total };
};

export const getProfileById = async (
  id: string,
  includeUser = false
): Promise<any> => {
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: includeUser ? profileIncludes : profileIncludes
  });

  if (!profile) {
    throw new AppError('Perfil no encontrado', 404);
  }
  return profile;
};

export const getProfileByUserId = async (
  userId: string,
  profileType: ProfileType
): Promise<any> => {
  const profile = await prisma.profile.findFirst({
    where: { userId, profileType },
    include: profileIncludes
  });

  if (!profile) {
    throw new AppError('Perfil no encontrado', 404);
  }
  return profile;
};

export const searchProfiles = async (
  profileType: ProfileType,
  termino: string
): Promise<any[]> => {
  return prisma.profile.findMany({
    where: {
      profileType,
      user: {
        nombre: { contains: termino, mode: 'insensitive' }
      }
    },
    include: profileIncludes
  });
};

export const getProfilesByZona = async (
  profileType: ProfileType,
  zonaId: string,
  desde = 0,
  limite = 5
): Promise<{ profiles: any[]; total: number }> => {
  const where: any = {
    profileType,
    user: {
      zonas: { some: { zonaId } }
    }
  };

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      include: profileIncludes,
      skip: desde,
      take: limite,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.profile.count({ where })
  ]);

  return { profiles, total };
};

export const createProfile = async (data: CreateProfileInput): Promise<any> => {
  const profile = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
        role: data.role as any,
        estado: data.estado ?? true,
        estadoDeportivo: data.estadoDeportivo,
        clubId: data.clubId,
        image: data.image,
        google: data.google ?? false,
        zonas: data.zonas?.length
          ? { create: data.zonas.map(zonaId => ({ zonaId })) }
          : undefined
      }
    });

    const profile = await tx.profile.create({
      data: {
        userId: user.id,
        profileType: data.profileType,
        nombreDeportivo: data.nombreDeportivo,
        telefono: data.telefono,
        fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
        lateralidad: data.lateralidad,
        demarcacion: data.demarcacion || [],
        altura: data.altura,
        peso: data.peso,
        entrenadorPorteros: data.entrenadorPorteros ?? false,
        titulacion: data.titulacion || [],
        localidadId: data.localidadId,
        metadata: data.metadata
      },
      include: {
        user: true,
        estadisticas: { include: { temporada: true } }
      }
    });

    return profile;
  });

  return profile;
};

export const updateProfile = async (id: string, data: UpdateProfileInput): Promise<any> => {
  const existing = await prisma.profile.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!existing) {
    throw new AppError('Perfil no encontrado', 404);
  }

  // Separate user fields from profile fields
  const userFields = ['nombre', 'apellidos', 'email', 'image', 'estado', 'estadoDeportivo', 'clubId', 'google'];
  const profileFields = ['nombreDeportivo', 'telefono', 'fechaNacimiento', 'lateralidad', 'demarcacion',
    'altura', 'peso', 'entrenadorPorteros', 'titulacion', 'localidadId', 'metadata'];

  const userData: any = {};
  for (const field of userFields) {
    if ((data as any)[field] !== undefined) userData[field] = (data as any)[field];
  }
  if (data.password !== undefined) {
    userData.password = bcrypt.hashSync(data.password, 10);
  }

  const profileData: any = {};
  for (const field of profileFields) {
    if ((data as any)[field] !== undefined) profileData[field] = (data as any)[field];
  }
  if (data.fechaNacimiento !== undefined) {
    profileData.fechaNacimiento = new Date(data.fechaNacimiento);
  }

  await prisma.$transaction(async (tx) => {
    if (Object.keys(userData).length > 0) {
      await tx.user.update({ where: { id: existing.userId }, data: userData });
    }
    if (Object.keys(profileData).length > 0) {
      await tx.profile.update({ where: { id }, data: profileData });
    }
    if ((data as any).zonas) {
      await tx.userZona.deleteMany({ where: { userId: existing.userId } });
      if ((data as any).zonas.length > 0) {
        await tx.userZona.createMany({
          data: (data as any).zonas.map((zonaId: string) => ({ userId: existing.userId, zonaId }))
        });
      }
    }
  });

  return prisma.profile.findUnique({
    where: { id },
    include: profileIncludes
  });
};

export const deleteProfile = async (id: string): Promise<any> => {
  const existing = await prisma.profile.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Perfil no encontrado', 404);
  }

  return prisma.profile.delete({ where: { id } });
};