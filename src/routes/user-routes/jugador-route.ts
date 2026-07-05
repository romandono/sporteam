import { Router } from 'express';
import * as JugadorController from '../../controllers/usuarios-controllers/jugador-controller';
import { verificarToken } from '../../middleware/authentication';

const api = Router();

/**
 * @openapi
 * /api/jugadores:
 *   get:
 *     tags: [Jugadores]
 *     summary: Listar jugadores con paginación
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 5 }
 *     responses:
 *       200:
 *         description: Lista paginada de jugadores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 total: { type: integer }
 *                 jugadores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Jugador'
 *       400:
 *         description: Error al recuperar jugadores
 */
api.get('/jugadores', [verificarToken], JugadorController.getJugadores);

/**
 * @openapi
 * /api/jugadores/{termino}:
 *   get:
 *     tags: [Jugadores]
 *     summary: Buscar jugadores por término
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: termino
 *         required: true
 *         schema: { type: string }
 *         description: Término de búsqueda (nombre, apellidos, email)
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 resultados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Jugador'
 */
api.get('/jugadores/:termino', [verificarToken], JugadorController.getJugadoresBusqueda);

/**
 * @openapi
 * /api/jugador/{id}:
 *   get:
 *     tags: [Jugadores]
 *     summary: Obtener jugador por ID de usuario
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Jugador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 jugador: { $ref: '#/components/schemas/Jugador' }
 *       404:
 *         description: Jugador no encontrado
 */
api.get('/jugador/:id', [verificarToken], JugadorController.getJugador);

/**
 * @openapi
 * /api/jugador:
 *   post:
 *     tags: [Jugadores]
 *     summary: Crear un nuevo jugador (usuario + perfil)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JugadorInput'
 *     responses:
 *       200:
 *         description: Jugador creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 jugador: { $ref: '#/components/schemas/Jugador' }
 *       400:
 *         description: Error de validación
 */
api.post('/jugador', JugadorController.saveJugador);

/**
 * @openapi
 * /api/jugador/{id}:
 *   put:
 *     tags: [Jugadores]
 *     summary: Actualizar un jugador
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreDeportivo: { type: string }
 *               fechaNacimiento: { type: string, format: date }
 *               lateralidad: { type: string }
 *               demarcacion: { type: array, items: { type: string } }
 *               altura: { type: number }
 *               peso: { type: number }
 *     responses:
 *       200:
 *         description: Jugador actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 jugador: { $ref: '#/components/schemas/Jugador' }
 *       404:
 *         description: Jugador no encontrado
 */
api.put('/jugador/:id', [verificarToken], JugadorController.updateJugador);

/**
 * @openapi
 * /api/jugadores/zona/{idZona}:
 *   get:
 *     tags: [Jugadores]
 *     summary: Listar jugadores por zona
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: idZona
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: desde
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 5 }
 *     responses:
 *       200:
 *         description: Jugadores filtrados por zona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 total: { type: integer }
 *                 jugadores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Jugador'
 */
api.get('/jugadores/zona/:idZona', [verificarToken], JugadorController.getJugadoresPorZona);

export default api;