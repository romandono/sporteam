import './config/config';
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './lib/prisma';

const port = process.env.PORT || 3000;

prisma.$connect()
  .then(() => {
    console.log('Base de datos conectada');

    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  })
  .catch(err => console.log(err));
