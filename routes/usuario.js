const express = require('express')
//const app = express()
const router = express.Router()
const { body, validationResult } = require('express-validator');

var usuarios = [
    {dni: 93688330, nombre: 'Adrian', apellido: 'Tamashiro', email: 'adriantama@email.com', fecha_nacimiento: '12-03-1991'},
    {dni: 12345678, nombre: 'Cristian', apellido: 'Ciz', email: 'crisciz@email.com', fecha_nacimiento: '16-10-1992'},
    {dni: 12121212, nombre: 'Mariam', apellido: 'Sleiman', email: 'marsleiman@email.com', fecha_nacimiento: '04-10-1995'},
    {dni: 99893289, nombre: 'Alejandro', apellido: 'Facchinelli', email: 'alefacchinelli@email.com', fecha_nacimiento: '21-08-1992'},
    {dni: 43289128, nombre: 'Rocio', apellido: 'Vargas', email: 'rociovargas@email.com', fecha_nacimiento: '21-05-1992'}
];

router.get('/list', (req, res) => {
    res.send(['Adrian', 'Cris', 'Mar', 'Rocio', 'Ale'])
})
 
router.get('/id/:id', (req, res) => {
    res.send(req.params.id)
})

router.get('/:nombre/:apellido', (req, res) => {
    //res.send(req.params.nombre)
    //res.send(req.params.apellido)
    //Lo envía en formato objeto en el de req.params
    res.send(req.params)
})

router.get('/', (req, res) => {
    res.send(usuarios)
})

router.get('/:email', (req, res) => {
    const user = usuarios.find(user => user.email === req.params.email)

    if(!user){
        res.status(404).send('No tenemos ningún usuario con ese email')
    } else{
        res.send(user)
    }
})


router.post('/', (req, res) =>{
    var user = {
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        fecha_nacimiento: req.body.fecha_nacimiento
    }
    usuarios.push(user)
    res.status(201).send(user)

})

//Con filtros o restricciones
router.post('/2/', (req, res) =>{
    //Significa diferente de vacio o nombre menor a 11 caracteres
    if(!req.body.nombre || req.body.nombre.length > 10){
        res.status(400).send('Introduce el nombre correcto')
        return
    }
    if(!req.body.apellido || req.body.apellido.length > 10){
        res.status(400).send('Introduce el apellido correcto')
        return
    }
    var user = {
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        fecha_nacimiento: req.body.fecha_nacimiento
    }
    usuarios.push(user)
    res.status(201).send(user)

})


//Usando express-validator
//En este caso valido que el email sea un email con el @ y que el nombre sea mínimo de 3 caracteres
router.post('/3/', [
    body('email').isEmail(),
    body('nombre').isLength({min: 3})
], (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    var user = {
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        fecha_nacimiento: req.body.fecha_nacimiento
    }
    usuarios.push(user)
    res.status(201).send(user)

})


router.put('/:dni', [
    body('email').isEmail(),
    body('nombre').isLength({min: 3})
], (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = usuarios.find(user => user.dni === parseInt(req.params.dni))

    if(!user){
        return res.status(404).send('El usuario con ese dni no existe')
    }

    user.nombre = req.body.nombre
    user.apellido = req.body.apellido
    user.email = req.body.email
    user.fecha_nacimiento = req.body.fecha_nacimiento    
    
    res.status(204).send()

})


router.delete('/:dni', (req, res) => {
    const user = usuarios.find(user => user.dni === parseInt(req.params.dni))

    if(!user){
        return res.status(404).send('Ese dni no existe')
    }

    const index = usuarios.indexOf(user)
    usuarios.splice(index, 1)
    res.status(200).send('Usuario eliminado')
})

module.exports = router