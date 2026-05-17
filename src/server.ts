import mongoose from 'mongoose';
import colors from 'colors/safe';
import app from './app';

const port = process.env.PORT || 3000;

(mongoose as any).Promise = global.Promise;
mongoose.connect(process.env.DB_CNN || '', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
} as any)
  .then(() => {
    console.log(colors.green('Base de datos conectada'));

    app.listen(port, () => {
      console.log(colors.green(`Servidor escuchando en el puerto ${port}`));
    });
  })
  .catch(err => console.log(err));
