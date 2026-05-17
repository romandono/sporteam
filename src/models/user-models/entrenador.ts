import mongoose, { Schema } from 'mongoose';
import User, { IUser } from './user';

export interface IEntrenador extends IUser {
  nombreDeportivo?: string;
  entrenadorPorteros: boolean;
  titulacion?: string[];
  telefono?: number;
}

const EntrenadorSchema = new Schema({
  nombreDeportivo: {
    type: String
  },
  entrenadorPorteros: {
    type: Boolean,
    default: false
  },
  titulacion: {
    type: [String]
  },
  telefono: {
    type: Number
  }
});

export default User.discriminator('Entrenador', EntrenadorSchema);
