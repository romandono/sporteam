import './config/config';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './docs/swagger';
import userRoutes from './routes/user-routes/usuario-route';
import jugadorRoutes from './routes/user-routes/jugador-route';
import entrenadorRoutes from './routes/user-routes/entrenador-route';
import loginRoutes from './routes/login';
import uploadRoutes from './routes/upload';
import provinciaRoutes from './routes/provincia';
import clubRoutes from './routes/club';
import zonaRoutes from './routes/zona';
import estadisticaRoutes from './routes/estadistica';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const publicPath = path.resolve(__dirname, '../server/public');
app.use(express.static(publicPath));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api', userRoutes);
app.use('/api', loginRoutes);
app.use('/api', uploadRoutes);
app.use('/api', jugadorRoutes);
app.use('/api', entrenadorRoutes);
app.use('/api', provinciaRoutes);
app.use('/api', clubRoutes);
app.use('/api', zonaRoutes);
app.use('/api', estadisticaRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(publicPath, 'index.html'));
});

export default app;
