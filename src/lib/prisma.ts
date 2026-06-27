import { PrismaClient } from '../generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const url = process.env.DATABASE_URL || '';
let adapter: ReturnType<typeof createPgAdapter> | ReturnType<typeof createNeonAdapter>;

function createPgAdapter() {
  return new PrismaPg(new Pool({ connectionString: url }));
}

function createNeonAdapter() {
  return new PrismaNeon({ connectionString: url });
}

adapter = url.includes('neon.tech') ? createNeonAdapter() : createPgAdapter();

const prisma = new PrismaClient({ adapter });

export default prisma;
