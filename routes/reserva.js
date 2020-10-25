const mongoose = require('mongoose')
const express = require('express')
const Reserva = require('../models/reserva')
const {Usuario} = require('../models/usuario')
const router = express.Router()
const {check, validationResult} = require('express-validator')


router.get('/', async(req, res) => {
    const reservas = await Reserva
        .find()
        //.populate('usuario', 'dni nombre email')
    res.send(reservas)
})

router.post('/', [], async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    const usuario = await Usuario.findById(req.body.usuarioId)
    if(!usuario) return res.status(400).send('No tenemos ese usuario')

    const reserva = new Reserva({
        usuario: usuario
    })

    const result = await reserva.save()
    res.status(201).send(result)
})

module.exports = router