const express = require('express');
const Router = express.Router();
const Booking = require('./../models/booking');
const Bicycle = require('./../models/bicycle');
const { isValidLocation } = require('./../locationManager'); // Import isValidLocation function

// import jwt file
const {jwtAuthMiddleware, generateToken } = require( './../jwt');

//********************************** book  bicycle ************************************** */

Router.post('/book' , jwtAuthMiddleware , async (req, res) =>{
   
  console.log("Request recive for the  booking ");

    const { bicycleId, bookingDate, returnDate } = req.body; // Assuming user sends these in the request
    const userId = req.user.id; // From the JWT token

    //debuging
    console.log("bicycle id : " , bicycleId);
    console.log(" user id : " ,userId);
     
    try {
      // Check if the bicycle is available
      const bicycle = await Bicycle.findById(bicycleId);
      if (bicycle.status !== 'available') {
        return res.status(400).json({ message: 'Bicycle is not available' });
      }
      
     console.log("Bicycle is available");
      

    
        // Fetch the bicycle by ID so that we can accedss the rent of that bicycle.
        const bookingbicycle = await Bicycle.findById(bicycleId);


      // Create a new booking
      const newBooking = new Booking({
        userId,
        bicycleId,
        bookingDate,
        returnDate,
        totalCost: bookingbicycle.rent, 
        status: 'confirmed',
      });
     
      

      await newBooking.save();
  
      // Update bicycle status to 'unavailable'
      bicycle.status = 'unavailable';
      await bicycle.save();
      console.log("Booking Confirmed");
      res.status(200).json({ message: 'Booking confirmed', booking: newBooking });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
});
    

/******************************************* return bicycle  to available location **************************************************/

Router.post('/return', async (req, res) => {
  const { bicycleId, returnLocation } = req.body;

  //  Validate return location
  if (!isValidLocation(returnLocation)) {
      return res.status(400).json({ message: 'Invalid return location' });
  }

  // Proceed with updating bicycle status and location
  try {
      const bicycle = await Bicycle.findById(bicycleId);
      if (!bicycle) {
          return res.status(404).json({ message: 'Bicycle not found' });
      }

      // Update the bicycle's status and location
      bicycle.status = 'available'; // or whatever your logic is
      bicycle.location = returnLocation; // Update to the return location
      await bicycle.save();

      console.log( 'Bicycle returned successfully');
      res.status(200).json({ message: 'Bicycle returned successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});



////////////////////////////////////////////////////
// geting all booked details
Router.get('/' , async (req, res) =>{
   
  try{
      const data = await History.find();
      console.log("data fetched");
      res.status(200).json(data);
  }
  catch(err){
     console.log(err);
     res.status(500).json({error:'Internal server Error'});
  }
});


module.exports = Router;