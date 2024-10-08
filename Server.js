// /backend/server.js
const express = require('express');
const app = express();
const cors = require('cors');

// configure the dotenv file
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// let's hanle cors ..........

const corsOption = {
    origin : "http://localhost:3000",
    methods : "GET , POST , PUT , DELETE",
    credentials : true
}
app.use(cors(corsOption));


// for connecitng to the databases
const  db = require('./db');



// body parser  // npm install body-parser
const bodyParser =  require('body-parser');
app.use(bodyParser.json()); // it store in req.body and we can use it. 




// import router files
// for user
const userRoutes  = require('./routes/usersRoutes');
app.use('/user' , userRoutes);
// for bicycle
const bicycleRoutes = require('./routes/bicycleRoutes');
app.use('/bicycle' , bicycleRoutes);
// for admin
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin' , adminRoutes);
// // for booking
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/booking' , bookingRoutes);


app.listen(PORT , () => {
    console.log('listening on port 4000');
})



