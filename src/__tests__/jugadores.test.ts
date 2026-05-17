import request from 'supertest';
import bcrypt from 'bcrypt';
import { app, connectDB, disconnectDB, cleanDB } from './helpers';
import User from '../models/user-models/user';

describe('Jugadores - CRUD', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  let token: string;

  beforeEach(async () => {
    const user = new User({
      nombre: 'Test',
      apellidos: 'Jugador',
      email: 'jugador@test.com',
      password: bcrypt.hashSync('pass123', 10),
      role: 'JUGADOR_ROLE',
      usertype: 'Jugador'
    });
    await user.save();

    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: 'jugador@test.com', password: 'pass123' });
    token = loginRes.body.token;
  });

  it('POST /api/jugador - debe crear un jugador', async () => {
    const res = await request(app)
      .post('/api/jugador')
      .send({
        nombre: 'Nuevo',
        apellidos: 'Jugador',
        email: 'nuevo-jug@test.com',
        password: 'pass123',
        role: 'JUGADOR_ROLE',
        nombreDeportivo: 'El Nuevo',
        demarcacion: ['Delantero'],
        altura: 180
      });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.jugador.email).toBe('nuevo-jug@test.com');
  });

  it('GET /api/jugadores - debe listar jugadores con token', async () => {
    const res = await request(app)
      .get('/api/jugadores')
      .set('token', token);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('GET /api/jugadores - debe rechazar sin token', async () => {
    const res = await request(app).get('/api/jugadores');

    expect(res.status).toBe(401);
  });
});
