import mongoose, { Schema } from 'mongoose';
import User, { IUser } from './user';

export interface IJugador extends IUser {
  nombreDeportivo?: string;
  fechaNacimiento?: string;
  lateralidad?: string;
  demarcacion?: string[];
  altura?: number;
  peso?: number;
  estadisticas: any[];
}

const JugadorSchema = new Schema({
  nombreDeportivo: {
    type: String,
    required: false
  },
  fechaNacimiento: {
    type: String,
    required: false
  },
  lateralidad: {
    type: String,
    required: false
  },
  demarcacion: {
    type: [String],
    required: false
  },
  altura: {
    type: Number,
    required: false
  },
  peso: {
    type: Number,
    required: false
  },
  estadisticas: [{ type: Schema.Types.ObjectId, ref: 'Estadistica' }]
});

export default User.discriminator('Jugador', JugadorSchema);
