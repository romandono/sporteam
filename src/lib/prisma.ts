import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const url = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;