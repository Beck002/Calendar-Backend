const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next ) =>{

    // x-token header

    const token = req.header('x-token'); 

    if(!token){
        return res.status(401).json({
            ok: false, 
            errorMessage: 'No hay token de petición'
        });
    }

    try {

        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = uid;
        req.name = name;
        

    } catch (error) {
        return res.status(401).json({
            ok: false, 
            errorMessage: 'Token Invalido'
        })
    }


    next();


}


module.exports = {
    validarJWT
}



