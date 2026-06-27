import request from 'supertest';
import bcrypt from 'bcrypt';
import { app, connectDB, disconnectDB, cleanDB, prisma } from './helpers';

describe('Entrenadores - CRUD', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  let token: string;

  beforeEach(async () => {
    await prisma.user.create({
      data: {
        nombre: 'Test', apellidos: 'Entrenador',
        email: 'entrenador@test.com',
        password: bcrypt.hashSync('pass123', 10),
        role: 'ENTRENADOR_ROLE',
        entrenador: { create: {} }
      }
    });

    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: 'entrenador@test.com', password: 'pass123' });
    token = loginRes.body.token;
  });

  it('POST /api/entrenador - debe crear un entrenador', async () => {
    const res = await request(app)
      .post('/api/entrenador')
      .send({
        nombre: 'Nuevo', apellidos: 'Entrenador',
        email: 'nuevo-ent@test.com',
        password: 'pass123',
        role: 'ENTRENADOR_ROLE',
        nombreDeportivo: 'Coach',
        titulacion: ['Nivel 1', 'Nivel 2'],
        telefono: 600123456
      });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.entrenador.email).toBe('nuevo-ent@test.com');
  });

  it('GET /api/entrenadores - debe listar entrenadores con token', async () => {
    const res = await request(app)
      .get('/api/entrenadores')
      .set('token', token);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
