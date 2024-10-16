const express = require('express');
const mongoose = require('mongoose');
const Router = express.Router();
const Booking = require('./../models/booking');
const Bicycle = require('./../models/bicycle');
const { isValidLocation , locationArray } = require('./../locationManager'); // Import isValidLocation function

// import jwt file
const {jwtAuthMiddleware, generateToken } = require( './../jwt');

//********************************** book  bicycle ************************************** */

Router.post('/book', jwtAuthMiddleware, async (req, res) => {
  console.log("Request received for booking");

  const { bicycleId, bookingDate, returnDate } = req.body; // User sends these in the request
  const userId = req.user.id; // From the JWT token

  console.log("User ID:", userId);
  console.log("Bicycle ID:", bicycleId);

  try {
    // Convert the bookingDate and returnDate to Date objects
    const bookingDateTime = new Date(bookingDate);
    const returnDateTime = new Date(returnDate);

    // Check if the return date is after the booking date
    if (returnDateTime <= bookingDateTime) {
      return res.status(400).json({ message: 'Return date must be after the booking date' });
    }

    // Check if the bicycle is available
    const bicycle = await Bicycle.findById(bicycleId);
    if (bicycle.status !== 'available') {
      return res.status(400).json({ message: 'Bicycle is not available' });
    }

    console.log("Bicycle is available");

    // Calculate the time difference in milliseconds
    const timeDiffInMs = returnDateTime - bookingDateTime;
    // Convert the time difference to hours
    const hoursBooked =( timeDiffInMs / (1000 * 60 * 60)) / 24 ; 
    console.log( `booked for ${ hoursBooked} days`);
    // Calculate the total cost based on the number of hours
    let totalCost = bicycle.rent;
    if(hoursBooked){
      totalCost =  bicycle.rent * hoursBooked;
    }

    // Create a new booking
    const newBooking = new Booking({
      userId,
      bicycleId,
      bookingDate: bookingDateTime,
      returnDate: returnDateTime,
      totalCost: totalCost.toFixed(2),  // Save cost with two decimal places
      status: 'ongoing',
    });

    await newBooking.save();

    // Update bicycle status to 'unavailable'
    bicycle.status = 'unavailable';
    await bicycle.save();

    console.log("Booking Confirmed");
    res.status(200).json({ message: 'Booking confirmed', booking: newBooking });
  } catch (err) {
    console.error("Error occurred during booking:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

    

/******************************************* return bicycle  to available location **************************************************/

Router.put('/return', jwtAuthMiddleware,async (req, res) => {
  const { bicycleId, returnLocation } = req.body;
  
  console.log("bicycleId : ", bicycleId);
  console.log("return location : ", returnLocation);
  const userId = req.user.id; // From the JWT token

  console.log("User ID:", userId);
 
  
  // Proceed with updating bicycle status and location
  try {
      const bicycle = await Bicycle.findById(bicycleId);
      
      if (!bicycle) {
          return res.status(404).json({ message: 'Bicycle not found' });
      }

      // see the bicycle details
      console.log("booked bicycle is : " , bicycle);

      
      // Update the bicycle's status and location
      bicycle.status = 'available'; // or whatever your logic is
      bicycle.location = returnLocation; // Update to the return location
      await bicycle.save();
      
        
      console.log( 'Bicycle returned successfully');
      res.status(200).json({ message: 'Bicycle returned successfully' });
   
      // Find the booking associated with the user and bicycle
      const booking = await Booking.findOne({ userId, bicycleId, status: 'ongoing' });
      // Update the booking status to 'returned'
      booking.status = 'returned';
      booking.returnDate = new Date(); // Update the return date to the current date
      await booking.save();

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

/******************************************  geting all booked details ************************************************/
Router.get('/' , jwtAuthMiddleware, async (req, res) =>{

  console.log("Enter for getting  specific user booking route"); 
  const userId = req.user.id; // From the JWT token
  console.log("from backed user_id : " ,userId);
  try{

      const data = await Booking.find({userId}).populate('bicycleId');
      console.log("data fetched");
     // console.log(data);

      res.status(200).json(data);
  }
  catch(err){
     console.log(err);
     res.status(500).json({error:'Internal server Error'});
  }
});


/**************************************** getting specific booking  details ***********************************************/

Router.get('/:bookingId', jwtAuthMiddleware, async (req, res) => {
  const { bookingId } = req.params;
  
  if (!bookingId) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }

  try {
    // Check if bookingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(bookingId).populate('bicycleId');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = Router;