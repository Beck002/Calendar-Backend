

const { Router } = require('express');
const { check } = require('express-validator');
const { getEventos, crearEvento, actualizarEvento, borrarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Middleware que valida todos los endpoints

router.use( validarJWT );

// Eventos EndPoints 
router.get( '/', getEventos);

router.post( 
    '/',
    [
        check('title', "el titulo debe contener al menos un caracter").not().isEmpty(),
        check('start', "Debe ingresar una fecha de inicio").custom( isDate ),
        check('end', "Debe ingresar una fecha de finalización"),
        validarCampos
    ], 
    crearEvento 
);

router.put( 
    '/:id',
    [

    ],
    actualizarEvento 
);

router.delete( '/:id', borrarEvento );


module.exports = router;
