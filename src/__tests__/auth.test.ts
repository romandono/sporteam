import request from 'supertest';
import bcrypt from 'bcrypt';
import { app, connectDB, disconnectDB, cleanDB } from './helpers';
import User from '../models/user-models/user';

describe('Auth - POST /api/login', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  beforeEach(async () => {
    const user = new User({
      nombre: 'Test',
      apellidos: 'User',
      email: 'test@test.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'USER_ROLE'
    });
    await user.save();
  });

  it('debe loguear con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('debe rechazar email incorrecto', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'noexiste@test.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('debe rechazar contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
});

describe('Auth - GET /api/login/renew', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  let token: string;

  beforeEach(async () => {
    const user = new User({
      nombre: 'Test',
      apellidos: 'User',
      email: 'test@test.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'USER_ROLE'
    });
    await user.save();

    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: 'test@test.com', password: 'password123' });

    token = loginRes.body.token;
  });

  it('debe renovar token válido', async () => {
    const res = await request(app)
      .get('/api/login/renew')
      .set('token', token);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario).toBeDefined();
  });

  it('debe rechazar petición sin token', async () => {
    const res = await request(app)
      .get('/api/login/renew');

    expect(res.status).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});

describe('Auth - POST /api/google', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });

  it('debe rechazar token de Google inválido', async () => {
    const res = await request(app)
      .post('/api/google')
      .send({ token: 'invalid-google-token' });

    expect(res.status).toBe(403);
    expect(res.body.ok).toBe(false);
  });
});
