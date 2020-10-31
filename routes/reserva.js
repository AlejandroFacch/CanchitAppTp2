let express = require('express');
let router = express.Router();
const dataReserva = require('../data/reserva');

//GET de todas las reservas
router.get('/', async (req, res)=>{
    res.json(await dataReserva.getReservas());
});

// GET de una reserva en especifica, para buscar una reserva en particular.
router.get('/:id', async (req, res) => {
    res.json(await dataReserva.getReserva(req.params.id));
});

// Borra una reserva en especifica
router.delete('/:id', async (req, res)=> {
    await dataReserva.deleteReserva(req.params.id);
    res.send('Reserva eliminada');
});

// Modificar una reserva en especifica
// Faltan los atributos que quiero modificar
router.put('/:id', async (req, res)=> {
    await dataReserva.modificarReserva(req.params.id);
    res.send('Reserva modificada');
});

// Crear reserva
router.post('/agregarReserva',async (req, res)=> {
    const reserva = req.body;
        if( await dataReserva.chequeoReserva(reserva) == null){
            await dataReserva.agregarReserva(reserva);
        }else{
            res.send(`La cancha no se encuentra disponible en esa fecha y hora :(`);
        }
        const reservaPersistida = await dataReserva.chequeoReserva(reserva);
        res.json(reservaPersistida);
    return reserva;
});

module.exports = router;
