let express = require('express');
let router = express.Router();
const dataTipoCancha = require('../data/TipoCancha');
const auth = require('../middleware/autenticacion');

// GET todas los tipos de canchas
router.get('/', async (req, res) => {
    res.json(await dataTipoCancha.getAllTiposCanchas());
});

// GET de un tipo de cancha
router.get('/:id', async (req,res)=>{
    res.json(await dataTipoCancha.getTipoCancha(req.params.id));
});

module.exports = router;