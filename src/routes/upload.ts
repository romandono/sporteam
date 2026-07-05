import { Router } from 'express';
import fileUpload from 'express-fileupload';
import * as UploadController from '../controllers/upload';

const api = Router();

api.use(fileUpload());

/**
 * @openapi
 * /api/upload/{tipo}/{id}:
 *   put:
 *     tags: [Upload]
 *     summary: Subir imagen de usuario o club
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [usuarios, clubs]
 *         description: Tipo de entidad (usuarios o clubs)
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la entidad
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (png, jpg, gif, jpeg)
 *     responses:
 *       200:
 *         description: Imagen subida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 image: { type: string }
 *                 usuario: { $ref: '#/components/schemas/User' }
 *                 club: { $ref: '#/components/schemas/Club' }
 *       400:
 *         description: Error de validación (extensión no válida, entidad no existe)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
api.put('/upload/:tipo/:id', UploadController.uploadFile);

export default api;