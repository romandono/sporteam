const provincia = require('../models/provincia');
const Provincia = require('../models/provincia');

let getProvincias = (req, res) => {

    Provincia.find({})
        .exec((err, provincias) => {

            if (err) {
                return res.status(400).send({
                    ok: false,
                    err
                });
            }

            return res.status(200).send({
                ok: true,
                provincias: provincias
            });
        });
}

module.exports = {
    getProvincias
}