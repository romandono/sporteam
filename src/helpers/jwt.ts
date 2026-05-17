import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

const generarJWT = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload: JwtPayload = { id };

    jwt.sign(payload, process.env.JWT_SECRET || '', {
      expiresIn: '12h'
    }, (err: Error | null, token?: string) => {
      if (err) {
        reject('No se pudo generar el JWT');
      } else {
        resolve(token as string);
      }
    });
  });
};

export { generarJWT };
