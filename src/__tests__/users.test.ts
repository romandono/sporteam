import request from 'supertest';
import bcrypt from 'bcrypt';
import { app, connectDB, disconnectDB, cleanDB, prisma } from './helpers';

describe('Users - GET /api/usuarios', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  beforeEach(async () => {
    await prisma.user.createMany({
      data: [
        { nombre: 'User1', apellidos: 'Test', email: 'user1@test.com', password: bcrypt.hashSync('pass', 10), role: 'USER_ROLE' },
        { nombre: 'User2', apellidos: 'Test', email: 'user2@test.com', password: bcrypt.hashSync('pass', 10), role: 'USER_ROLE' }
      ]
    });
  });

  it('debe listar usuarios', async () => {
    const res = await request(app).get('/api/usuarios');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.usuarios.length).toBe(2);
  });
});

describe('Users - POST /api/usuario', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  it('debe crear un usuario', async () => {
    const res = await request(app)
      .post('/api/usuario')
      .send({
        nombre: 'New', apellidos: 'User',
        email: 'new@test.com',
        password: 'password123',
        role: 'USER_ROLE'
      });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.usuario.email).toBe('new@test.com');
    expect(res.body.usuario.password).toBeUndefined();
  });

  it('debe rechazar email duplicado', async () => {
    await request(app)
      .post('/api/usuario')
      .send({
        nombre: 'First', apellidos: 'User',
        email: 'dup@test.com',
        password: 'password123',
        role: 'USER_ROLE'
      });

    const res = await request(app)
      .post('/api/usuario')
      .send({
        nombre: 'Second', apellidos: 'User',
        email: 'dup@test.com',
        password: 'password123',
        role: 'USER_ROLE'
      });

    expect(res.status).toBe(400);
  });
});

describe('Users - PUT /api/usuario/:id', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  let userId: string;

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        nombre: 'Original', apellidos: 'User',
        email: 'original@test.com',
        password: bcrypt.hashSync('pass', 10),
        role: 'USER_ROLE'
      }
    });
    userId = user.id;
  });

  it('debe actualizar un usuario', async () => {
    const res = await request(app)
      .put(`/api/usuario/${userId}`)
      .send({ nombre: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.usuario.nombre).toBe('Updated');
  });
});

describe('Users - DELETE /api/usuario/:id', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  let userId: string;

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        nombre: 'ToDelete', apellidos: 'User',
        email: 'delete@test.com',
        password: bcrypt.hashSync('pass', 10),
        role: 'USER_ROLE'
      }
    });
    userId = user.id;
  });

  it('debe eliminar un usuario', async () => {
    const res = await request(app).delete(`/api/usuario/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
