import mongoose, { Schema, Document } from 'mongoose';

export interface ILocalidad extends Document {
  nombre: string;
}

const LocalidadSchema = new Schema({
  nombre: String
});

export default mongoose.model('Localidad', LocalidadSchema);
