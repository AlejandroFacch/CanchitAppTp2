const jwt = require('jsonwebtoken');
const dataUsuario = require('../data/usuario');
const dotenv = require('dotenv').config();

async function autenticacion (req, res, next) {
    try {
        const token = await req.header('Authorization').replace('Bearer ', '')
        const decodificado =await jwt.verify(token, process.env.SECRET);
        const usuario =await dataUsuario.getUsuario(decodificado._id);
        next();
    } catch (error) {
        res.status(401).send(error.message);
    }
}

module.exports = autenticacion;