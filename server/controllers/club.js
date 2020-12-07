const { response } = require("express");
const ClubSchema = require('../models/club');
const _ = require('underscore');

let getClubs = async(req, res = response) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    let clubs = await ClubSchema.find({})
        .populate({ path: 'provincia' })
        .populate({ path: 'zona' })
        .skip(Number(desde))
        .limit(Number(limite))
        .catch(err => {
            res.status(400).send({
                ok: false,
                err
            });
        });

    let total = await ClubSchema.countDocuments();

    res.status(200).send({
        ok: true,
        clubs,
        total
    });

}

let getClubsBusqueda = async(req, res = response) => {

    let termino = req.params.termino;
    const regex = new RegExp(termino, 'i');

    let resultados = await ClubSchema.find({ nombre: regex })
        .populate({ path: 'provincia' })
        .populate({ path: 'zona' })
        .catch(err => {
            res.status(400).send({
                ok: false,
                err
            });
        });

    res.status(200).send({
        ok: true,
        resultados
    });

}

let getClub = async(req, res = response) => {

    let id = req.params.id;

    let club = await ClubSchema.findById(id)
        .catch(err => {
            res.status(500).send({
                ok: false,
                err
            })
        });

    if (!club) {
        res.status(404).send({
            ok: false,
            message: 'El club no existe en la base de datos'
        })
    }

    res.status(200).send({
        ok: true,
        club
    });
}

let saveClub = (req, res = response) => {

    let body = req.body;

    let club = new ClubSchema({
        nombre: body.nombre,
        localidad: body.localidad,
        provincia: body.provincia,
        modalidad: body.modalidad,
        image: body.image,
        zona: body.zona
    });

    club.save((err, club) => {

        if (err) {
            res.status(400).send({
                ok: false,
                err
            });
        }

        res.status(200).send({
            ok: true,
            club
        });
    });

}

let updateClub = (req, res = response) => {

    let id = req.params.id;

    let body = req.body;

    let club = new ClubSchema({
        nombre: body.nombre,
        localidad: body.localidad,
        provincia: body.provincia,
        modalidad: body.modalidad,
        zona: body.zona
    });

    ClubSchema.findOneAndUpdate(id, club, (err, clubDB) => {

        if (err) {
            res.status(400).send({
                ok: false,
                err
            });
        }

        res.status(200).send({
            ok: true,
            clubDB
        })
    });

}

let getClubsPorZona = (req, res = response) => {

    let idZona = req.params.idZona;

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    ClubSchema.find().populate({
        path: 'zona',
        match: { _id: { $eq: idZona } },
        select: 'nombreZona'
    }).skip(desde).limit(limite).exec((err, clubs) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        clubs = _.filter(clubs, (club) => {
            return club.zona !== null;
        })

        res.status(200).json({
            ok: true,
            clubs
        });

    });

}

let deleteClub = async(req, res = response) => {

    let id = req.params.id;

    let club = await ClubSchema.findByIdAndDelete(id)
        .catch(err => {
            res.status(400).json({
                ok: false,
                message: 'No ha sido posible eliminar al club'
            });
        });

    if (!club) {
        res.status(404).send({
            ok: true,
            message: 'El club no está registrado'
        });
    }

    res.status(200).send({
        ok: true,
        message: 'Club eliminado'
    });

}

module.exports = {
    getClub,
    getClubs,
    saveClub,
    updateClub,
    getClubsPorZona,
    getClubsBusqueda,
    deleteClub
}