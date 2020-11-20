let express = require('express');
let router = express.Router();
const dataCanchas = require('../data/cancha');
const auth = require('../middleware/autenticacion');

//GET de todas las canchas
router.get('/',auth, async (req, res) => {
    res.json(await dataCanchas.getCanchas());
})


// GET de una cancha segun su tipo de cancha, cuando el usuario seleccione el tipo de cancha donde quiere reservar, le trae la lista segun el tipo seleccionado
router.get('/:descripcion', async (req, res) => {
    res.json(await dataCanchas.getCanchasSegunTipo(req.params.descripcion));
});

// GET de una cancha en especifico, para buscar una cancha en particular.
router.get('/canchaNumero/:numero', async (req, res) => {
    res.json(await dataCanchas.getCancha(req.params.numero));
});

// PUT de una cancha en especial
router.put('/:id', auth ,async (req, res) => {
    const cancha = req.body;

    try {
            const resultado = await dataCanchas.modificarCancha(cancha);
            res.json(resultado);
    } catch (error) {
        res.status(500).send(error);
    }


});

// Borra una cancha en especifico
router.delete('/:id', async (req, res) => {
    await dataCanchas.deleteCancha(req.params.id);
    res.send('Cancha eliminada');
});


// Cuando el admin selecciona los tipos de cancha y las cantidades de cada uno para dar de alta en la app.
router.post('/agregarCanchas',  async (req, res) => {
    const cancha = req.body;
    cancha.numero = Number(cancha.numero);
    cancha.precio = Number(cancha.precio);
    if (Array.isArray(cancha)) {
        let numeros = [];
        // recorre el listado de canchas ingresado por el admin
        for (let index = 0; index < cancha.length; index++) {
            const c = cancha[index];
            // verifica una cancha del array para ver si existe el numero en la base
            respuesta = await dataCanchas.verificarCancha(c);
            if (respuesta == false) {
                // agrega la cancha si no se encontro el mismo numero en la base
                await dataCanchas.agregarCancha(c);
            } else {
                // si encontro el numero en la base, agrega dicho numero a un array para luego mostrarlo en un mensaje
                numeros.push(respuesta);
            }
        }

        // si el array tiene algun numero cargado, lo mostrara por mensaje al usuario para que sepa cual cancha no se cargo en la base
        if (numeros.length == 1) {
            res.send(`La cancha numero ${numeros.toString()} ya existe`);
        } else if (numeros.length > 1) {
            res.send(`Las canchas numero ${numeros.sort().toString()} ya existen`);
        }
    } else {
        // si la cancha ingresada posee el mismo numero que alguna de la base de datos se rechaza el ingreso de la cancha
        if (await dataCanchas.verificarCancha(cancha) == false) {
            await dataCanchas.agregarCancha(cancha);
        } else {
            res.send("El numero de cancha ingresado ya existe");
        }


    }

    const canchasPersistidas = await dataCanchas.getCanchas();
    res.json(canchasPersistidas);
});



module.exports = router;
