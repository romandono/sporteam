import mongoose, { Schema, Document } from 'mongoose';
import { IProvincia } from './provincia';
import { IZona } from './zona';

export interface IClub extends Document {
  nombre: string;
  localidad: string;
  provincia: IProvincia;
  modalidad: string;
  image: string;
  zona: IZona;
  users: any[];
  userLogued: any;
}

const ClubSchema = new Schema({
  nombre: String,
  localidad: String,
  provincia: {
    type: Schema.Types.ObjectId,
    ref: 'Provincia'
  },
  modalidad: String,
  image: String,
  zona: {
    type: Schema.Types.ObjectId,
    ref: 'Zona'
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  userLogued: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Club', ClubSchema);
