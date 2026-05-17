import mongoose, { Schema, Document } from 'mongoose';

export interface IProvincia extends Document {
  nombre: string;
}

const ProvinciaSchema = new Schema({
  nombre: String
});

export default mongoose.model('Provincia', ProvinciaSchema);
