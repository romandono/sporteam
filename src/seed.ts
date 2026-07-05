import prisma from './lib/prisma';

const TEMPORADAS = ['2024/2025', '2025/2026', '2026/2027'];

const ZONAS = [
  'Zona Norte',
  'Zona Sur',
  'Zona Este',
  'Zona Oeste',
  'Zona Centro',
];

const PROVINCIAS = [
  'A Coruña',
  'Lugo',
  'Ourense',
  'Pontevedra',
];

const LOCALIDADES = [
  'Santiago de Compostela',
  'A Coruña',
  'Lugo',
  'Ourense',
  'Pontevedra',
  'Vigo',
  'Ferrol',
  'Vilagarcía de Arousa',
];

async function main() {
  for (const anho of TEMPORADAS) {
    await prisma.temporada.upsert({
      where: { anho },
      update: {},
      create: { anho },
    });
  }

  for (const nombreZona of ZONAS) {
    await prisma.zona.upsert({
      where: { nombreZona },
      update: {},
      create: { nombreZona },
    });
  }

  for (const nombre of PROVINCIAS) {
    await prisma.provincia.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  for (const nombre of LOCALIDADES) {
    const existente = await prisma.localidad.findFirst({ where: { nombre } });
    if (!existente) {
      await prisma.localidad.create({ data: { nombre } });
    }
  }

  console.log('Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
