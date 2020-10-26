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
//TERMINARLO
router.post('/agregarUsuario',async  (req,res)=> {
    const usuario = req.body;
    if(Array.isArray(usuario)){
    
        for (let index = 0; index < usuario.length; index++) {
            const user = usuario[index];
           
            respuesta = await dataUsuario.verificarUsuario(user);
            if(respuesta == false){
              
                await dataUsuario.agregarUsuario(user);
            }
        }
        
        // si el array tiene algun numero cargado, lo mostrara por mensaje al usuario para que sepa cual cancha no se cargo en la base
        if(numeros.length == 1 ){
            res.send(`La cancha numero ${numeros.toString()} ya existe`);
        }else if(numeros.length > 1){
            res.send(`Las canchas numero ${numeros.sort().toString()} ya existen`);
        }
    }else{
        // si la cancha ingresada posee el mismo numero que alguna de la base de datos se rechaza el ingreso de la cancha
        if( await dataCanchas.verificarCancha(cancha) == false){
            await dataCanchas.agregarCancha(cancha);
        }else{
            res.send("El numero de cancha ingresado ya existe");
        }
        

    }

    const canchasPersistidas = await dataCanchas.getCanchas();
        res.json(canchasPersistidas);
});



module.exports = router;