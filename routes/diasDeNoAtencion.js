let express = require('express');
let router = express.Router();
const dataDia = require('../data/diasDeNoAtencion');
const auth = require('../middleware/autenticacion');

router.get('/',auth, async (req, res)=>{
    res.json(await dataDia.getDias());
});

router.put('/modificarDias',auth, async (req, res)=> {
    try {
        await dataDia.modificarDias(req.body);
        res.json(true);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;