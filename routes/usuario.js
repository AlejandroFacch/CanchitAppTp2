let express = require('express');
const { token } = require('morgan');
let router = express.Router();
const dataUsuario = require('../data/usuario');
const auth = require('../middleware/autenticacion');


//GET de todos los usuarios
router.get('/', auth, async (req, res) => {
    res.json(await dataUsuario.getUsuarios());
});

// GET de un usuario en especifico, para buscar un usuario en particular.
router.get('/:email', auth, async (req, res) => {
    try {
        res.json(await dataUsuario.getUsuario(req.params.email));
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// Crear usuario
// NOTA : Revisarlo 
router.post('/agregarUsuario', async (req, res) => {
    const usuario = req.body;
    try {
        if (!await dataUsuario.verificarUsuario(usuario)) {
            await dataUsuario.agregarUsuario(usuario);
            const usuarioPersistido = await dataUsuario.getUsuario(usuario.email);
            const token = await dataUsuario.generarToken(usuarioPersistido);
            res.json({ usuarioPersistido, token });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }

});

router.post('/login', async (req, res) => {
    try {
        const usuario = await dataUsuario.logueo(req.body.email, req.body.password);
        // generar un token
        const token = await dataUsuario.generarToken(usuario);
        res.json({ usuario, token });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

// Modificar un usuario en especifico
router.put('/', async (req, res) => {
    try{
        let respuesta = await dataUsuario.modificarUsuario(req.body);
        res.json("Cambios realizados con éxito.");
    }catch(error){
        res.status(400).send(error.message);
    }
    
});

// Modificar contraseña
router.put('/modificarContrasena/', auth, async (req, res) => {
    try {
        const respuesta = await dataUsuario.modificarContrasena(req.body)
        res.json("Contraseña modificada.")

    } catch (error) {
        res.status(401).send(error.message);
    }
});

// Borra un usuario en especifico
router.delete('/:id', auth, async (req, res) => {
    try{
        await dataUsuario.deleteUsuario(req.params.id);
        res.json('Usuario eliminado.');
    }catch(error){
        res.status(400).send(error.message);
    }
    
});

module.exports = router;