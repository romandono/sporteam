const { response } = require("express");
const ZonaSchema = require('../models/zona');

let getZonas = async(req, res = response) => {

    let zonas = await ZonaSchema.find({})
        .catch(err => {
            res.status(400).send({
                ok: false,
                err
            })
        });

    if (!zonas) {
        res.status(400).send({
            ok: false,
            message: 'No fue posible recuperar las zonas'
        })
    }

    res.json({
        ok: true,
        zonas
    });

}

module.exports = {
    getZonas
}