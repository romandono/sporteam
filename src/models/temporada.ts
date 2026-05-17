import mongoose, { Schema, Document } from 'mongoose';

export interface ITemporada extends Document {
  anho: string;
}

const TemporadaSchema = new Schema({
  anho: String
});

export default mongoose.model('Temporada', TemporadaSchema);
