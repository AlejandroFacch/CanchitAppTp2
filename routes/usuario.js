const mongoose = require('mongoose')
const express = require('express')
const Usuario = require('../data/usuario')
const router = express.Router()
const { body, validationResult } = require('express-validator');

router.get('/', async(req, res) => {
    const usuarios = await Usuario.find()
    res.send(usuarios)
})

router.get('/:id', async(req, res) =>{
    const usuario = await Usuario.findById(req.params.id)
    if(!usuario) return res.status(404).send('No se ha encontrado al usuario con ese ID')
    res.send(usuario)
})


//Usando express-validator
//En este caso valido que el email sea un email con el @ y que el nombre sea mínimo de 3 caracteres
router.post('/', [
    body('email').isEmail(),
    body('nombre').isLength({min: 3})
], async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const usuario = new Usuario({
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        fecha_nacimiento: req.body.fecha_nacimiento
    })

    const result = await usuario.save()
    res.status(201).send(result)
})


router.put('/:id', [
    body('email').isEmail(),
    body('nombre').isLength({min: 3})
], async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, {
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        fecha_nacimiento: req.body.fecha_nacimiento
    },
    {
        new: true
    })

    if(!usuario){
        return res.status(404).send('El usuario con ese id no existe')
    }   
    
    res.status(204).send()

})


router.delete('/:id', async(req, res) => {
    const usuario = await Usuario.findByIdAndDelete(req.params.id)

    if(!usuario){
        return res.status(404).send('Ese id no existe')
    }

    res.status(200).send('Usuario eliminado')
})

module.exports = router