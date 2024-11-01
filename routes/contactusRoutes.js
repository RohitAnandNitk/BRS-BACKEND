const express = require('express');
const Router = express.Router();
const ContactUs = require('./../models/contactus'); 


//****************************** */ submit info **************************************************
Router.post('/submit' ,  async (req, res) =>{
    console.log("enter in submit route");
    try{
      const data = req.body // assuming the request body contain the given data
      // create a new user document using the mongoose model
      const contactUs  = new ContactUs(data);
      // save the new data to the database
      const response = await contactUs.save();
      // message
      console.log('data saved');
  
  
      res.status(200).json({ response: response });
    }
    catch(err){
      console.log(err);
      res.status(500).json({error:'Internal server Error'});
    }
  });


  /************************************** Getting all contactus history ******************************************/
Router.get('/history',  async (req, res) => {
    console.log("Entered the all contact history route");
    
    try {
      // Fetch all booking details (this fetches all bookings for admins) 
       const data = await ContactUs.find();
    //.populate({
    //     path: 'userId',
    //     select: 'name , email' // Only select the 'name' field from User
    //   });
  
      console.log('All contact us details fetched');
      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  module.exports = Router;