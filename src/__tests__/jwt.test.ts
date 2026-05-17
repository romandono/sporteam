import { generarJWT } from '../helpers/jwt';

describe('generarJWT', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('debe generar un token válido para un ID dado', async () => {
    const id = '507f1f77bcf86cd799439011';
    const token = await generarJWT(id);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('debe generar tokens diferentes para distintos IDs', async () => {
    const token1 = await generarJWT('507f1f77bcf86cd799439011');
    const token2 = await generarJWT('507f1f77bcf86cd799439012');

    expect(token1).not.toBe(token2);
  });

  it('debe rechazar si JWT_SECRET no está definido', async () => {
    delete process.env.JWT_SECRET;

    await expect(generarJWT('any-id')).rejects.toBe('No se pudo generar el JWT');

    process.env.JWT_SECRET = 'test-secret-key';
  });
});
