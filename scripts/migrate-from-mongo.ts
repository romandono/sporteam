/**
 * Migración de datos desde MongoDB a PostgreSQL (Prisma).
 * Uso: npx tsx scripts/migrate-from-mongo.ts
 *
 * Requiere:
 *  - Variable MONGO_URL apuntando a MongoDB (o DB_CNN)
 *  - Variable DATABASE_URL apuntando a PostgreSQL (ya en .env)
 *
 * Orden de migración (respetando claves foráneas):
 *  1. temporadas, provincias, zonas, localidades
 *  2. clubs
 *  3. users + jugadores/entrenadores (en paralelo)
 *  4. user_zonas
 *  5. estadisticas
 */

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

async function main() {
  const mongoUrl = process.env.MONGO_URL || process.env.DB_CNN;
  if (!mongoUrl) {
    console.log('No MONGO_URL/DB_CNN configurada. Omitiendo migración desde MongoDB.');
    return;
  }

  console.log('Conectando a MongoDB...');
  const mongoose = await import('mongoose');
  await mongoose.default.connect(mongoUrl);

  console.log('Conectando a PostgreSQL...');
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter } as any);
  await prisma.$connect();

  const db = mongoose.default.connection.db;

  // Helper: transformar _id -> id
  const toId = (doc: any) => {
    if (!doc) return undefined;
    return doc._id?.toString() || doc.id;
  };

  try {
    // 1. Temporadas
    const temporadas = await db.collection('temporadas').find().toArray();
    for (const t of temporadas) {
      await prisma.temporada.upsert({
        where: { id: toId(t) },
        update: { anho: t.anho },
        create: { id: toId(t), anho: t.anho }
      });
    }
    console.log(`Migradas ${temporadas.length} temporadas`);

    // 2. Provincias
    const provincias = await db.collection('provincias').find().toArray();
    for (const p of provincias) {
      await prisma.provincia.upsert({
        where: { id: toId(p) },
        update: { nombre: p.nombre },
        create: { id: toId(p), nombre: p.nombre }
      });
    }
    console.log(`Migradas ${provincias.length} provincias`);

    // 3. Zonas
    const zonas = await db.collection('zonas').find().toArray();
    for (const z of zonas) {
      await prisma.zona.upsert({
        where: { id: toId(z) },
        update: { nombreZona: z.nombreZona },
        create: { id: toId(z), nombreZona: z.nombreZona }
      });
    }
    console.log(`Migradas ${zonas.length} zonas`);

    // 4. Clubs
    const clubs = await db.collection('clubs').find().toArray();
    for (const c of clubs) {
      await prisma.club.upsert({
        where: { id: toId(c) },
        update: {
          nombre: c.nombre,
          localidad: c.localidad,
          provinciaId: toId(c.provincia),
          modalidad: c.modalidad,
          image: c.image,
          zonaId: toId(c.zona)
        },
        create: {
          id: toId(c), nombre: c.nombre, localidad: c.localidad,
          provinciaId: toId(c.provincia), modalidad: c.modalidad,
          image: c.image, zonaId: toId(c.zona)
        }
      });
    }
    console.log(`Migrados ${clubs.length} clubs`);

    // 5. Users (con jugador/entrenador embebido)
    const users = await db.collection('users').find().toArray();
    let jugCount = 0, entCount = 0;
    for (const u of users) {
      const userData: any = {
        id: toId(u),
        role: u.role, nombre: u.nombre, apellidos: u.apellidos,
        email: u.email, password: u.password,
        estado: u.estado ?? true, image: u.image, google: u.google ?? false,
        estadoDeportivo: u.estadoDeportivo,
        clubId: toId(u.club)
      };
      // Intentar crear; si existe (por migración previa), saltar
      try {
        await prisma.user.create({ data: userData });
      } catch {
        // ya existe
      }

      // Jugador
      if (u.jugador || u.usertype === 'Jugador') {
        const j = u.jugador || {};
        try {
          await prisma.jugador.create({
            data: {
              userId: toId(u),
              nombreDeportivo: j.nombreDeportivo || u.nombreDeportivo,
              fechaNacimiento: j.fechaNacimiento ? new Date(j.fechaNacimiento) : undefined,
              lateralidad: j.lateralidad,
              demarcacion: j.demarcacion || [],
              altura: j.altura ? Number(j.altura) : undefined,
              peso: j.peso ? Number(j.peso) : undefined
            }
          });
          jugCount++;
        } catch { /* ya existe */ }
      }

      // Entrenador
      if (u.entrenador || u.usertype === 'Entrenador') {
        const e = u.entrenador || {};
        try {
          await prisma.entrenador.create({
            data: {
              userId: toId(u),
              nombreDeportivo: e.nombreDeportivo || u.nombreDeportivo,
              entrenadorPorteros: e.entrenadorPorteros ?? false,
              titulacion: e.titulacion || [],
              telefono: e.telefono ? String(e.telefono) : undefined
            }
          });
          entCount++;
        } catch { /* ya existe */ }
      }
    }
    console.log(`Migrados ${users.length} usuarios (${jugCount} jugadores, ${entCount} entrenadores)`);

    // 6. UserZonas
    for (const u of users) {
      if (u.zona && Array.isArray(u.zona)) {
        for (const zId of u.zona) {
          try {
            await prisma.userZona.create({
              data: { userId: toId(u), zonaId: toId(zId) || zId }
            });
          } catch { /* duplicado */ }
        }
      }
    }
    console.log('Migradas relaciones usuario-zona');

    // 7. Estadisticas
    const stats = await db.collection('estadisticas').find().toArray();
    for (const s of stats) {
      try {
        await prisma.estadistica.create({
          data: {
            id: toId(s),
            jugadorId: toId(s.jugador) || s.jugadorId,
            temporadaId: toId(s.temporada) || s.temporadaId,
            partidosJugados: s.partidosJugados ?? 0,
            goles: s.goles ?? 0,
            asistencias: s.asistencias ?? 0,
            tarjetasAmarillas: s.tarjetasAmarillas ?? 0,
            tarjetasRojas: s.tarjetasRojas ?? 0
          }
        });
      } catch { /* duplicado */ }
    }
    console.log(`Migradas ${stats.length} estadisticas`);

    console.log('Migración completada.');
  } finally {
    await prisma.$disconnect();
    await mongoose.default.disconnect();
  }
}

main().catch(console.error);
