let express = require('express');
let router = express.Router();
const dataHorario = require('../data/horarioDeAtencion');


router.get('/', async (req, res)=>{
    res.json(await dataHorario.getHorarios());
});

router.put('/modificarHorario', async (req, res)=> {
    await dataReserva.modificarHorarios(req.body);
    res.send('Horario modificado');
});


module.exports = router;