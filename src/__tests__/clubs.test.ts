import request from 'supertest';
import bcrypt from 'bcrypt';
import { app, connectDB, disconnectDB, cleanDB } from './helpers';
import User from '../models/user-models/user';
import Club from '../models/club';

describe('Clubs - CRUD', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  let token: string;

  beforeEach(async () => {
    const user = new User({
      nombre: 'Admin',
      apellidos: 'Club',
      email: 'admin@test.com',
      password: bcrypt.hashSync('pass123', 10),
      role: 'ADMIN_ROLE'
    });
    await user.save();

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
    await Club.create({ nombre: 'FC Test', localidad: 'City' });

    const res = await request(app)
      .get('/api/clubs')
      .set('token', token);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.clubs.length).toBeGreaterThanOrEqual(1);
  });
});
