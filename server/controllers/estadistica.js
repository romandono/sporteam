const { response } = require('express');
const Estadistica = require('../models/estadistica');

let getEstadistica = (req, res = response) => {

    let id = req.params.id;

    Estadistica.findById(id, (err, estadistica) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        if (!estadistica) {
            res.status(400).json({
                ok: false,
                message: 'No existe la estadistica'
            });
        }

        res.status(200).json({
            ok: true,
            estadistica
        });
    });


}

module.exports = {
    getEstadistica
}