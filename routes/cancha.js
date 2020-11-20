let express = require('express');
let router = express.Router();
const dataCanchas = require('../data/cancha');
const auth = require('../middleware/autenticacion');

//GET de todas las canchas
router.get('/', auth, async (req, res) => {
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
router.put('/:id', auth, async (req, res) => {
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
router.post('/agregarCanchas', async (req, res) => {
    const cancha = req.body;
    cancha.numero = Number(cancha.numero);
    cancha.precio = Number(cancha.precio);

    let respuesta = await dataCanchas.verificarCancha(c);
    if (respuesta == false) {
        // agrega la cancha si no se encontro el mismo numero en la base
        await dataCanchas.agregarCancha(c);
        res.json(true);
    } else {
        // si encontro el numero en la base, agrega dicho numero a un array para luego mostrarlo en un mensaje
        res.json(false)
    }
});

module.exports = router;
