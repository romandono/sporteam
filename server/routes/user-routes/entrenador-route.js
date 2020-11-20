const express = require('express');
const EntrenadorController = require('../../controllers/usuarios-controllers/entrenador-controller');

const app = express.Router();

const { verificarToken, verificarEntrenador_Rol } = require('../../middlewares/authentication');

app.get('/entrenadores', [verificarToken, verificarEntrenador_Rol], EntrenadorController.getEntrenadores);
app.get('/entrenador/:id', [verificarToken, verificarEntrenador_Rol], EntrenadorController.getEntrenador);
app.post('/entrenador', EntrenadorController.saveEntrenador);
app.put('/entrenador/:id', [verificarToken, verificarEntrenador_Rol], EntrenadorController.updateEntrenador);

module.exports = app;