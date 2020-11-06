let express = require('express');
let router = express.Router();
const dataReserva = require('../data/reserva');
const moment = require('moment-timezone');

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


router.get('/buscar/:numero', async (req, res) => {
    let numeroCancha = req.params.numero;
    let reservasOcupadas = await dataReserva.buscarReservasPorNroCanchaYFecha(numeroCancha);

    let listaReservas = [];

    moment().locale('es');
    moment().tz("America/Argentina").format();
    let hoy = moment();
    let horaPrimerTurno = 9;
    let horaUltimoTurno = 21;

    if (hoy.hour() >= horaUltimoTurno){
        console.log(hoy.dayOfYear());
        hoy = moment([hoy.year(), hoy.month(), hoy.date()+2, horaPrimerTurno, 0]);
        
    }

    for (let d = 0; d <= 15; d++) {
        

        if (d == 0 && (moment().date() == hoy.date()) && (hoy.hour() >= horaPrimerTurno && hoy.hour() < horaUltimoTurno)){
          
          
            horaPrimerTurno = hoy.hour() + 1;
        }
        else
        {
            horaPrimerTurno = 9;    
        }

        for (let h = horaPrimerTurno; h <= horaUltimoTurno; h++) {
            let dia = hoy.day()+d;
            let date = new Date(hoy.year(), hoy.month(), dia, h-3, 0);
            listaReservas.push(

                fecha = moment(date)
                
            );
            
        }
    }

    if (reservasOcupadas.length > 0){
            
                for (let f = 0; f < reservasOcupadas.length; f++)
                {
                    for (let i = 0; i <listaReservas.length; i++)
                    {

                        let turnoUtilizado = moment(reservasOcupadas[f].dia);

                        if (turnoUtilizado.year() == listaReservas[i].year() && turnoUtilizado.month() == listaReservas[i].month() && turnoUtilizado.date() == listaReservas[i].date() && reservasOcupadas[f].hora == (listaReservas[i].hour()+3))
                        {
                            listaReservas.splice(i, 1);
                        }
                    }
                }
     }

     res.json(listaReservas);
});



module.exports = router;
