import prisma from '../lib/prisma';
import { cleanDB } from './helpers';

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await cleanDB();
});

afterAll(async () => {
  await prisma.$disconnect();
});
