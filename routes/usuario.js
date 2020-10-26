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

    if(Array.isArray(usuario)){
        //recorre el listado de usuarios
        for (let index = 0; index < usuario.length; index++) {
            const user = usuario[index];
            respuesta = await dataUsuario.verificarUsuario(user);
            if(respuesta == false){
                await dataUsuario.agregarUsuario(user);
            }
        }
    }else {
        
        if( !await dataUsuario.verificarUsuario(user)){
            await dataUsuario.agregarUsuario(user);
        }else{
            res.send(`El usuario con email : ${usuario.email} ya existe `);
        }
        
    }

    const usuariosPersistidos = await dataUsuario.getUsuarios();
        res.json(usuariosPersistidos);
});



module.exports = router;