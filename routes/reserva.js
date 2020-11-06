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

//Funcion que devuelve un listado de dias y horas disponibles para reservar
router.get('/buscar/:numero', async (req, res) => {
    let numeroCancha = req.params.numero;

    //Trae las reservas existentes segun el numero de cancha enviado 
    let reservasOcupadas = await dataReserva.buscarReservasPorNroCanchaYFecha(numeroCancha);

    let listaReservas = [];

    moment().locale('es');
    moment().tz("America/Argentina").format();
    //trae el dia de hoy
    let hoy = moment();
    //Son los horarios de funcionamiento de las canchas
    let horaPrimerTurno = 9;
    let horaUltimoTurno = 21;

    //En este if se fija si en la hora que me encuentro supera el ultimo horario de las canchas
    //De superarlo le agrega un dia para mostrar horarios de dias posteriores al actual
    if (hoy.hour() >= horaUltimoTurno){
        console.log(hoy.dayOfYear());
        //Se le agrega un +2 al dia, ya que moment al poner date trae un numero anterior al dia actual
        hoy = moment([hoy.year(), hoy.month(), hoy.date()+2, horaPrimerTurno, 0]);
        
    }

    //Este for se utilizara para crear una lista de dias con el largo que se coloque en el parametro del medio
    for (let d = 0; d <= 15; d++) {
        
        //Este if se fija si en el dia actual estoy dentro del rango horario de atencion de las canchas
        //De encontrarme dentro del rango coloca como hora del primer turno la hora siguiente a la que estoy actualmente
        if (d == 0 && (moment().date() == hoy.date()) && (hoy.hour() >= horaPrimerTurno && hoy.hour() < horaUltimoTurno)){
          
            horaPrimerTurno = hoy.hour() + 1;
            //se le agrega al dia de hoy la hora del primer turno nueva, y en date se agrega un +1 ya que el date trae un numero anterior al dia de hoy
            hoy = moment([hoy.year(), hoy.month(), hoy.date()+1, horaPrimerTurno, 0]);

        }
        else
        {
            //De no estar dentro del rango coloca como primera hora el horario definido por el admin
            horaPrimerTurno = 9;    
        }

        //este for va creando una lista de fechas con horarios, los cuales se utilizaran para que la persona reserve
        for (let h = horaPrimerTurno; h <= horaUltimoTurno; h++) {
            let dia = hoy.day()+d;
            //en horario se le resta 3 ya que es por el horario de argentina.
            let date = new Date(hoy.year(), hoy.month(), dia, h-3, 0);
            listaReservas.push(

                fecha = moment(date)
                
            );
            
        }
    }

    //Este if pregunta si la lista de turnos ocupados tiene algun dato
    if (reservasOcupadas.length > 0){
                //Estos for comparan la lista de turnos ocupados, con la de turnos libres creadas anteriormente
                for (let f = 0; f < reservasOcupadas.length; f++)
                {
                    for (let i = 0; i <listaReservas.length; i++)
                    {

                        let turnoUtilizado = moment(reservasOcupadas[f].dia);
                        //De existir fechas que coincidan se borraran de la lista de turnos disponibles.
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
