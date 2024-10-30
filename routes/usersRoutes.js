const express = require('express');
const Router = express.Router();
const User = require('./../models/user');


const passport = require('./../auth');
// import jwt file
const {jwtAuthMiddleware, generateToken } = require( './../jwt');


// we are added auth here   
const localAuthMiddleware = passport.authenticate('local' , {session : false});
// now when we authentication in any route then we place this "localAuthMiddleware" 



//****************************** */ signup **************************************************
Router.post('/signup' , async (req, res) =>{

  try{
    const data = req.body // assuming the request body contain the User data
    // create a new user document using the mongoose model
    const newUser  = new User(data);
    // save the new User to the database
    const response = await newUser.save()
    // message
    console.log('data saved');

    const payload = {
      id: response.id
    }
    // console the payload
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is : " , token);

    res.status(200).json({ response: response , token: token });
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server Error'});
  }
});



//*********************************** login ******************************************************** */

Router.post('/login' , async (req, res) =>{
  try{
      // Extract username and password from request body
      const  {email, password} = req.body;

      // find the user by username
      const user = await User.findOne({email : email});

      // if user not exist with that username  or password doesn't match
      if(!user || !(await user.comparePassword(password))){
            console.log("Invalid Email or Password");
            return res.status(401).json({error: 'Invalid Email or Password'});
      }

      // generate the token 
       const payload = {
         id : user.id,
       }
       const token = generateToken(payload);

       // retutn token as response
       res.json({token});
  }
  catch(err){
       console.log(err);
       res.status(500).json({error:'Internal Server Error'});
  }
}); 

//************************************* profile  ********************************************* */

Router.get('/profile' , jwtAuthMiddleware , async (req, res) =>{
      
  try{
    const userData =  req.user;
    console.log("User Data : " , userData);

    const userId = userData.id;
    // find the user by id
    const user = await User.findById(userId);
    res.status(200).json(user); 
  }
  catch(err){
      console.log(err);
      res.status(500).json({error:'Internal Server Error'});
  }   
});


//*************************************** change password ************************************************* */

Router.put('/profile/password' , jwtAuthMiddleware ,async (req, res) => {
  try{
      const userID = req.user.id; // extracting id from token
      console.log('User ID:', userID);
      // ask user for current password and new password
      const {currentPassword , newPassword} = req.body;
        
      console.log('Current password:', currentPassword, 'New password:', newPassword);
         
      // find the user by id
      const user = await User.findById(userID);

     // if user current password doesn't match
     if( !(await user.comparePassword(currentPassword))){
      return res.status(401).json({error: 'Invalid usernaem or password'}); 
    }

    // update password
    user.password = newPassword;
    await user.save();
      
    console.log('password updated');
    res.status(200).json( {error : 'password updated'});
  }
  catch(err){
    console.log(err);
    res.status(404).json({error: 'Internal server error'});
  }
});
//********************************************** History ************************************************ */




///////////////// For Testing Purpose ////////////////////////
// getting all user  details
Router.get('/' , async (req, res) => {
  try{
    const data  = await User.find();
    console.log('data fetched');
    res.status(200).json(data);
}
catch(err){
  console.log(err);
  res.status(500).json({error:'Internal server Error'});
} 
});

module.exports = Router;