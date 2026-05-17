import { Router } from 'express';
import fileUpload from 'express-fileupload';
import * as UploadController from '../controllers/upload';

const api = Router();

api.use(fileUpload());

api.put('/upload/:tipo/:id', UploadController.uploadFile);

export default api;
