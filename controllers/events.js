const { response } = require('express');
const { generarJwt } = require('../helpers/jwt');
const { findByIdAndUpdate, findById } = require('../models/Evento');
const Evento = require('../models/Evento');


const getEventos = async ( req, res = response)=>{
    
    try {

        const listaEventos = await Evento.find().populate( 'user', 'name' );

        res.json({
            ok: true,
            listaEventos
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            errorMessage: 'Error500'
        })       
    }
}   

const crearEvento = async ( req, res = response )=>{

    const evento = Evento(req.body)

    try {

        evento.user = req.uid; 
        const eventoGuardado  = await evento.save(); 

        res.status(201).json({
            ok: true,
            eventoGuardado
        })


    } catch (error) {

        res.status(500).json({
            ok: false,
            errorMessage: "error al crear evento"
        })

    }
}

const actualizarEvento = async ( req, res = response )=>{

    const eventoId = req.params.id;
    const uid = req.uid; 
    try {
        const evento = await Evento.findById( eventoId );
        if( !evento ){
            res.status(404).json({
                ok:false, 
                evento: "No existe un evento con esa id"
            })
        }

        if( evento.user.toString() !== uid){
            res.status(401).json({
                ok: false,
                errorMessage: "No cuenta con los privilegios para editar los eventos de otros usuarios"
            })
        }   

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento
        })

        
    } catch (error) {


        res.status(500).json({
            ok: false,
            errorMessage: "error al actualizar evento"
        })

    }



}


const borrarEvento = async ( req, res = response ) => {

    const eventId =  req.params.id;
    const uid = req.uid; 

    try {
        
        const evento = await Evento.findById( eventId );

        if( !evento ){
            res.status(404).json({
                ok: false,
                errorMessage: 'No se puede borrar un evento sin una id'
            })
        }

        
        if( evento.user.toString() !== uid){
            res.status(401).json({
                ok: false,
                errorMessage: "No cuenta con los privilegios para borrar los eventos de otros usuarios"
            })
        }   
        await Evento.findByIdAndDelete( eventId )

        res.json({
            ok: true,
            msg: 'Evento eliminado correctamente'
        })

    } catch (error) {

        
        res.status(500).json({
            ok: false, 
            errorMessage: 'error al intentar borrar evento'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    borrarEvento
}