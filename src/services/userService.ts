import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const userSelect = {
  id: true,
  nombre: true,
  apellidos: true,
  email: true,
  role: true,
  estado: true,
  image: true,
  google: true,
  estadoDeportivo: true,
  clubId: true,
  createdAt: true,
  updatedAt: true
};

export const getUsers = async (desde = 0, limite = 9) => {
  const [usuarios, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: { not: 'ADMIN_ROLE' } },
      select: userSelect,
      skip: desde,
      take: limite,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where: { role: { not: 'ADMIN_ROLE' } } })
  ]);

  return { usuarios, total };
};

export const getUserById = async (id: string) => {
  const usuario = await prisma.user.findUnique({
    where: { id },
    select: { ...userSelect, zona: true, club: true }
  });
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404);
  }
  return usuario;
};

export const createUser = async (params: {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  role: string;
  estadoDeportivo?: string;
  zonas?: string[];
  clubId?: string;
}) => {
  const usuario = await prisma.user.create({
    data: {
      nombre: params.nombre,
      apellidos: params.apellidos,
      email: params.email,
      password: bcrypt.hashSync(params.password, 10),
      role: params.role as any,
      estado: true,
      estadoDeportivo: params.estadoDeportivo,
      clubId: params.clubId,
      zonas: params.zonas?.length
        ? { create: params.zonas.map(zonaId => ({ zonaId })) }
        : undefined
    },
    select: userSelect
  });

  return usuario;
};

export const updateUser = async (id: string, body: any) => {
  const allowedFields = ['nombre', 'apellidos', 'email', 'image', 'role', 'estado', 'estadoDeportivo', 'clubId'];
  const data: any = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }

  if (body.zonas) {
    await prisma.userZona.deleteMany({ where: { userId: id } });
    if (body.zonas.length > 0) {
      await prisma.userZona.createMany({
        data: body.zonas.map((zonaId: string) => ({ userId: id, zonaId }))
      });
    }
  }

  const usuario = await prisma.user.update({
    where: { id },
    data,
    select: userSelect
  });

  return usuario;
};

export const deleteUser = async (id: string) => {
  const usuario = await prisma.user.findUnique({ where: { id } });
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 400);
  }

  await prisma.user.delete({ where: { id } });
  return usuario;
};
