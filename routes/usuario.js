let express = require('express');
let router = express.Router();
const dataUsuario = require('../data/usuario');

//GET de todos los usuarios
router.get('/', async (req,res)=>{
    res.json(await dataUsuario.getUsuarios());
});

// GET de un usuario en especifico, para buscar un usuario en particular.
router.get('/:email', async (req,res)=>{
    res.json(await dataUsuario.getUsuario(req.params.email));
});

// Borra un usuario en especifico
router.delete('/:id', async (req,res)=> {
    await dataUsuario.deleteUsuario(req.params.id);
    res.send('Usuario eliminado');
});

// Modificar un usuario en especifico
//Faltan los atributos que quiero modificar
router.put('/:id', async (req,res)=> {
    await dataUsuario.modificarUsuario(req.params.id);
    res.send('Usuario modificado');
});

// Crear usuario
// NOTA : Revisarlo 
router.post('/agregarUsuario',async  (req,res)=> {
    const usuario = req.body;

        if( !await dataUsuario.verificarUsuario(usuario)){
            await dataUsuario.agregarUsuario(usuario);
        }else{
            res.send(`El usuario con email ${usuario.email} ya existe `);
        }

        const usuarioPersistido = await dataUsuario.getUsuario(usuario.email);
        res.json(usuarioPersistido);
});

router.post('/login',async  (req,res)=> {
    try {
        const usuario = await dataUsuario.logueo(req.body.email, req.body.password);
        // generar un token
        const token = await dataUsuario.generarToken(usuario);
        res.send({usuario, token});
    } catch (error) {
        res.status(401).send(error.message);
    }
});



module.exports = router;