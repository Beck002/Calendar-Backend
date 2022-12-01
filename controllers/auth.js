const express = require('express');
const bcrypt  = require('bcryptjs');

const Usuario = require('../models/Usuario');
const { generarJwt } = require('../helpers/jwt');
const { validationResult } = require('express-validator');


const crearUsuario = async ( req, res = express.response) => {

    const { email, password } = req.body; 

    try {  

        let usuario = await Usuario.findOne({ email });

        if( usuario ){
            return res.status(400).json({
                ok:false,
                errorMessage:"El email ya esta registrado"
            });
        };

        usuario  = new Usuario( req.body ); 
        
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        
        // guardar usuario en db
        await usuario.save();

        // Generar JWT

        const token = await generarJwt( usuario.id, usuario.name ); 

        return res.status(201).json({ 
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    
    } catch ( error ) {
   
        res.status(500).json({
            ok: false, 
            errorMessage: "Error interno, intentelo más tarde" 
        });
    };

};

const loginUsuario   = async ( req, res = express.response ) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if( !usuario ){
            return res.status(400).json({
                ok:false,
                errorMessage:"Usuario y contraseña invalidos ( caso email )"
            });
        };

        const validPassword = bcrypt.compareSync( password, usuario.password ); 

        if (!validPassword) {
            return res.status(500).json({
                ok: false,
                errorMessage: 'La contraseña es incorrecta'
            });
        };

        // Generar JWT ( Json Web Token )
        const token = await generarJwt( usuario.id, usuario.name ); 

        res.status(200).json({ 
            ok: true,
            name: usuario.name,
            uid: usuario.id,
            email: usuario.email,
            token
        }) 


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            errorMessage: "Error interno, intentelo más tarde" 
        })
    }


};

const revalidarToken = async ( req, res = express.response) => {

    const { uid, name }  = req; 

    // genera  un nuevo jwt y lo retorna; 

    const token = await generarJwt( uid , name );


    res.json({
        ok: 'renew',
        uid, 
        name,
        token
    });
};


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}