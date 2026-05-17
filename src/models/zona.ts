import mongoose, { Schema, Document } from 'mongoose';

export interface IZona extends Document {
  nombreZona: string;
}

const ZonaSchema = new Schema({
  nombreZona: String
});

export default mongoose.model('Zona', ZonaSchema);
