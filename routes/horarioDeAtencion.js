let express = require('express');
let router = express.Router();
const dataHorario = require('../data/horarioDeAtencion');
const auth = require('../middleware/autenticacion');

router.get('/',auth, async (req, res)=>{
    res.json(await dataHorario.getHorarios());
});

router.put('/modificarHorario',auth, async (req, res)=> {
    await dataHorario.modificarHorarios(req.body);
    res.json(true);
});


module.exports = router;