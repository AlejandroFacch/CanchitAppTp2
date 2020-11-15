let express = require('express');
let router = express.Router();
const dataDia = require('../data/diasDeAtencion');


router.get('/', async (req, res)=>{
    res.json(await dataDia.getDias());
});

router.put('/modificarDias', async (req, res)=> {
    await dataDia.modificarDias(req.body);
    res.send('Dia modificado');
});


module.exports = router;