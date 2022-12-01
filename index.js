const express = require('express');
const cors    = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

// Servidor 
const app = express();

app.use(cors());
// Database
dbConnection(); 

// Directorio publico
app.use( express.static('public'));

// Lectura y parseo del body

app.use( express.json() );

// Rutas
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/events', require('./Routes/events.js'));

app.get('*', ( req, res  )=> {
    res.sendFile( __dirname + '/public/index.html')
})

// Escuchar Peticiones
app.listen( process.env.PORT, () => {

    console.log(`corriendo en el puerto: ${process.env.PORT}`);

});