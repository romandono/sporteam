import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser extends Document {
  usertype: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  role: string;
  estado: boolean;
  image?: string;
  google: boolean;
  estadoDeportivo?: string;
  zona: any[];
  club?: any;
}

const rolesValidos: { values: string[]; message: string } = {
  values: ['ADMIN_ROLE', 'USER_ROLE', 'JUGADOR_ROLE', 'ENTRENADOR_ROLE', 'CLUB_ROLE'],
  message: '{VALUE} no es un rol válido'
};

const userOptions = {
  discriminatorKey: 'usertype',
  collection: 'users'
};

const UserSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  apellidos: {
    type: String,
    required: [true, 'Los apellidos son necesarios']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El email es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es necesaria']
  },
  role: {
    type: String,
    required: [true, 'El rol de usuario es necesario'],
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    required: false
  },
  google: {
    type: Boolean,
    default: false
  },
  estadoDeportivo: {
    type: String,
    required: false
  },
  zona: [{
    type: Schema.Types.ObjectId,
    ref: 'Zona'
  }],
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club'
  }
}, userOptions);

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.plugin(uniqueValidator, { message: 'El {PATH} ya está registrado' });

export default mongoose.model('User', UserSchema);
