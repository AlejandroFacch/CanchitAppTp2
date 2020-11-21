let express = require('express');
let router = express.Router();
const dataDia = require('../data/diasDeNoAtencion');


router.get('/', async (req, res)=>{
    res.json(await dataDia.getDias());
});

router.put('/modificarDias', async (req, res)=> {
    await dataDia.modificarDias(req.body);
    res.json(true);
});


module.exports = router;