import mongoose, { Schema, Document } from 'mongoose';

export interface IEstadistica extends Document {
  partidosJugados: number;
  goles: number;
  asistencias: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
  temporada: any;
}

const EstadisticaSchema = new Schema({
  partidosJugados: Number,
  goles: Number,
  asistencias: Number,
  tarjetasAmarillas: Number,
  tarjetasRojas: Number,
  temporada: {
    type: Schema.Types.ObjectId,
    ref: 'Temporada'
  }
});

export default mongoose.model('Estadistica', EstadisticaSchema);
