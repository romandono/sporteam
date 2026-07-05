import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import userRoutes from './routes/user-routes/usuario-route';
import jugadorRoutes from './routes/user-routes/jugador-route';
import entrenadorRoutes from './routes/user-routes/entrenador-route';
import loginRoutes from './routes/login';
import uploadRoutes from './routes/upload';
import provinciaRoutes from './routes/provincia';
import clubRoutes from './routes/club';
import zonaRoutes from './routes/zona';
import estadisticaRoutes from './routes/estadistica';
import { errorHandler } from './middleware/errorHandler';
import logger from './helpers/logger';

const app = express();

app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, err: { message: 'Demasiadas peticiones, intente de nuevo más tarde' } }
});
app.use(limiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, err: { message: 'Demasiados intentos de inicio de sesión' } }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.originalUrl, ip: req.ip });
  next();
});

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

const openApiSpec = JSON.parse(fs.readFileSync(path.join(publicPath, 'openapi.json'), 'utf-8'));

function getOpenApiSpec(req: express.Request) {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol || 'http';
  const spec = { ...openApiSpec, servers: [{ url: `${protocol}://${host}`, description: 'Auto' }] };
  return spec;
}

app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const spec = getOpenApiSpec(req);
  swaggerUi.setup(spec)(req, res, next);
});
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(getOpenApiSpec(req));
});

app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Apply login rate limiter
app.use('/api/login', loginLimiter);
app.use('/api/google', loginLimiter);

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

app.use(errorHandler);

export default app;
