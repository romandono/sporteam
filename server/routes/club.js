const express = require('express');
const ClubController = require('../controllers/club');
const { verificarToken, verificarAdmin_Rol, verificaTokenImage } = require('../middlewares/authentication');

const api = express.Router();

api.get('/clubs', [verificarToken], ClubController.getClubs);
api.get('/clubs/:termino', [verificarToken], ClubController.getClubsBusqueda);
api.get('/club/:id', [verificarToken], ClubController.getClub);
api.delete('/club/:id', [verificarToken], ClubController.deleteClub);
api.post('/club', ClubController.saveClub);
api.put('/club/:id', [verificarToken], ClubController.updateClub);
api.get('/clubs/zona/:idZona', verificarToken, ClubController.getClubsPorZona);

module.exports = api;