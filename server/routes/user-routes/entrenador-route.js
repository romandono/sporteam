const express = require('express');
const EntrenadorController = require('../../controllers/usuarios-controllers/entrenador-controller');

const app = express.Router();

const { verificarToken, verificarEntrenador_Rol } = require('../../middlewares/authentication');

app.get('/entrenadores', [verificarToken], EntrenadorController.getEntrenadores);
app.get('/entrenadores/:termino', [verificarToken], EntrenadorController.getEntrenadoresBusqueda);
app.get('/entrenador/:id', [verificarToken], EntrenadorController.getEntrenador);
app.post('/entrenador', EntrenadorController.saveEntrenador);
app.put('/entrenador/:id', [verificarToken], EntrenadorController.updateEntrenador);
app.get('/entrenadores/zona/:idZona', [verificarToken], EntrenadorController.getEntrenadoresPorZona);

module.exports = app;