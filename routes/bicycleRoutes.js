const express = require('express');
const Router = express.Router();
const Bicycle = require('./../models/bicycle');
const User = require('./../models/user');

// importing locaion manager for adding 
const { addLocation , removeLocation} = require('./../locationManager'); // Import addLocation function

const passport = require('./../auth');
// import jwt file
const {jwtAuthMiddleware, generateToken } = require( './../jwt');




// we are added auth here   
const localAuthMiddleware = passport.authenticate('local' , {session : false});
// now when we authentication in any route then we place this "localAuthMiddleware" 




//function to check first whoever trying to add bicycle that person is admin or not
const checkAdminRole = async (userID) => {
  try{
      const user = await User.findById(userID);
      return user.role != 'customer';
  }
  catch(err){
    return true;
  } 

};

// Note:  apply jwtAuthMiddlewarev to all methods

//****************************** */ adding bicycle **************************************************
Router.post('/add' ,async (req, res) =>{

  try{
    
    const data = req.body // assuming the request body contain the bicycle data
    // create a new Bicycle document using the mongoose model
    const newBicycle  = new Bicycle(data);
    // save the new User to the database
    const response = await newBicycle.save()

   // add location in the location array

   // Assume req.body contains the bicycle data including location
   const { location } = req.body;

   // call add location function  pass location 
    addLocation(location);
   


    // message
    console.log('data saved');
    res.status(200).json({ response: response });
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server Error'});
  }
});



//*********************************** Update  bicycle Info ******************************************************** */
// url: http://localhost:3000/bicycle/bicycleId


Router.put( '/:bicycleId' ,  async (req,res) => {
        console.log('Request received to update bicycle');
        try{
              

              const bicycleID = req.params.bicycleId; // extracting id from paramter
              const updatedInfo = req.body;   // new info for updataion
              
              // debuging
             // console.log(bicycleID);
             // console.log(updatedInfo);
      
              const response = await Bicycle.findByIdAndUpdate(bicycleID , updatedInfo, {
                  new : true, // return the updated info
                  runValidators: true, // run mongooes validatord
              });
      
              if(!response){
                  return res.status(404).json({error : 'Bicycle not found'});
              }
      
              console.log(' bicycle data updated');
              res.status(200).json(response);
        }
        catch(err){
          console.log(err);
          res.status(404).json({error: 'Internal server error'});
        }
})

//************************************* delete bicycle  ********************************************* */

Router.delete('/:bicycleId' , jwtAuthMiddleware,  async (req, res) => {
  try{
        // check for admin
        if(! await checkAdminRole(req.user.id)){
          return res.status(403).json({message : 'User has not Admin Role'});
        }

        const bicycleID = req.params.bicycleId;
        const response = await Bicycle.findByIdAndDelete(bicycleID);
        
        if(!response){
          return res.status(404).json({error : 'Bicycle not found'});
      }

      // remove location from locationArray....................
      removeLocation(bicycleID.location);
      
      console.log('Bicycle data deleted');
      res.status(200).json({message : 'Data deleted Sucessfully'});
  }
  catch(err){
      console.log(err);
      res.status(404).json({error: 'Internal server error'});
  }
})


//****************** */ getting all bicycle  details ********************************************
Router.get('/' , async (req, res) => {
  try{
    const data  = await Bicycle.find();
    console.log(' Bicycle data fetched');
    res.status(200).json(data);
}
catch(err){
  console.log(err);
  res.status(500).json({error:'Internal server Error'});
} 
});

///******************************************  find cycle by id **************************************************** */

Router.get('/:bicycleId' ,  async (req, res) => {
  try{
       
        const bicycleID = req.params.bicycleId;
        const response = await Bicycle.findById(bicycleID);
        
        if(!response){
          return res.status(404).json({error : 'Bicycle not found'});
      }

      console.log('Bicycle data fetched');
      res.status(200).json(response);
  }
  catch(err){
      console.log(err);
      res.status(404).json({error: 'Internal server error'});
  }
})



module.exports = Router;