/*
    * Rutas de usuarios y auth 
    host + /api/auth

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt') 
const router  = Router();

router.get(
    '/renew',
    validarJWT,
    revalidarToken,
)

router.post( 
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password','El password debe ser de 6 o más caracteres' ).isLength({ min: 6 }),
        validarCampos
    ], 
    loginUsuario
)
router.post(
    '/new',
    [  // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password','El password debe ser de 6 o más caracteres' ).isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario 
)

module.exports = router;

