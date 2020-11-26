let express = require('express');
let router = express.Router();
const dataReserva = require('../data/reserva');
const dataHorarios = require('../data/horarioDeAtencion');
const dataUsuarios = require('../data/usuario');
const dataCanchas = require('../data/cancha');
const dataDiasNoAtencion = require('../data/diasDeNoAtencion');
const moment = require('moment-timezone');
const auth = require('../middleware/autenticacion');

// GET de todas las reservas
router.get('/', auth, async (req, res) => {
    res.json(await dataReserva.getReservas());
});

// GET de todas las reservas desde la fecha
router.get('/hoy/:hoy', auth, async (req, res) => {
    res.json(await dataReserva.getReservasPorFecha(req.params.hoy));
});

// GET de una reserva especifica, para buscar una reserva en particular.
router.get('/:id', auth, async (req, res) => {
  try{
    res.json(await dataReserva.getReserva(req.params.id));
  }catch(error){
    res.status(400).send(error.message);
  }
});

router.get('/miReserva/:email', auth, async (req, res) => {
  res.json(await dataReserva.getMiReserva(req.params.email));
});

router.get('/reservas/:cancha', auth, async (req, res) => {
  let numeroCancha = req.params.cancha;    
  let reservas = await dataReserva.buscarReservasPorNroCanchaYFecha(numeroCancha);
  res.json(reservas);
})

// Funcion que devuelve un listado de dias y horas disponibles para reservar
router.get('/buscar/:numero', auth, async (req, res) => {
    let numeroCancha = parseInt(req.params.numero);

    try {
    // Trae las reservas existentes segun el numero de cancha enviado
    let reservasOcupadas = await dataReserva.buscarReservasPorNroCanchaYFecha(numeroCancha);
    let listaReservas = [];

    moment().locale('es');
    // trae el dia de hoy
    let hoy = moment();
    hoy.hour(moment().hour()-3);
    // Son los horarios de funcionamiento de las canchas
    let horarios = await dataHorarios.getHorarios()
    let horaPrimerTurno =  parseInt(horarios.horarioDeInicio);
    let horaUltimoTurno = parseInt(horarios.horarioDeCierre);
    let diasNoAtencion = await dataDiasNoAtencion.getDias();

    listaReservas = dataReserva.generacionListadoDisponibles(hoy, horaPrimerTurno, horaUltimoTurno, listaReservas, horarios, diasNoAtencion, reservasOcupadas);
    res.json(listaReservas);
  } catch (error) {
      res.status(500).send(error);  
  }
});

// Crear reserva
router.post('/agregarReserva', auth, async (req, res)=> {
    const reserva = req.body;

    try {
        if (await dataReserva.chequeoReserva(reserva) == null) {
            await dataReserva.agregarReserva(reserva);
        } else {
            res.json(`La cancha no se encuentra disponible en esa fecha y hora :(`);
        }
        const reservaPersistida = await dataReserva.chequeoReserva(reserva);
        res.json(reservaPersistida);
        return reserva;
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/cancelacionReserva/', auth, async (req, res)=> {
    try {
        let borrado = await dataReserva.deleteReserva(req.body.reserva._id);
        if (borrado.result.ok == 1) {
          let cancha = await dataCanchas.getCancha(parseInt(req.body.reserva.nroCancha));
          req.body.usuario.montoADevolver += cancha.precio;
          await dataUsuarios.modificarUsuario(req.body.usuario);
          res.json('Reserva cancelada')
        } else {
            res.json("No se pudo realizar la cancelación");
        }
      
    } catch (error) {
        res.status(500).send(error);
    }
})

// Modificar una reserva especifica
// Faltan los atributos que quiero modificar
router.put('/:id',auth, async (req, res)=> {
  try {
      await dataReserva.modificarReserva(req.params.id);
      res.send('Reserva modificada');  
  } catch (error) {
      res.status(500).send(error);
  }
});

// Suspender reserva
router.put('/suspender/:id', auth, async (req, res) => {
  const reserva = req.params;
  try {
    const resultado = await dataReserva.suspenderReserva(reserva);
    res.json(resultado)
  } catch (error) {
    res.status(500).send(error);
  }
});

// Borra una reserva especifica
router.delete('/:id',auth, async (req, res)=> {
  try {
      await dataReserva.deleteReserva(req.params.id);
      res.send('Reserva eliminada');
  } catch (error) {
      res.status(400).send(error);
  }
});

module.exports = router;
