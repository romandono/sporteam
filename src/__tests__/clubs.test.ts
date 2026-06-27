import request from 'supertest';
import bcrypt from 'bcrypt';
import { app, connectDB, disconnectDB, cleanDB, prisma } from './helpers';

describe('Clubs - CRUD', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  let token: string;

  beforeEach(async () => {
    await prisma.user.create({
      data: {
        nombre: 'Admin', apellidos: 'Club',
        email: 'admin@test.com',
        password: bcrypt.hashSync('pass123', 10),
        role: 'ADMIN_ROLE'
      }
    });

    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: 'admin@test.com', password: 'pass123' });
    token = loginRes.body.token;
  });

  it('POST /api/club - debe crear un club', async () => {
    const res = await request(app)
      .post('/api/club')
      .send({
        nombre: 'FC Test',
        localidad: 'Test City',
        modalidad: 'Fútbol 11'
      });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.club.nombre).toBe('FC Test');
  });

  it('GET /api/clubs - debe listar clubs con token', async () => {
    await prisma.club.create({ data: { nombre: 'FC Test', localidad: 'City' } });

    const res = await request(app)
      .get('/api/clubs')
      .set('token', token);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.clubs.length).toBeGreaterThanOrEqual(1);
  });
});
