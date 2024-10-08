const express = require('express');
const Router = express.Router();
const Admin = require('./../models/admin');


const passport = require('./../auth');
// import jwt file
const {jwtAuthMiddleware, generateToken } = require( './../jwt');


// we are added auth here   
const localAuthMiddleware = passport.authenticate('local' , {session : false});
// now when we authentication in any route then we place this "localAuthMiddleware" 



//****************************** */ signup **************************************************
Router.post('/signup' ,  async (req, res) =>{

  try{
    const data = req.body // assuming the request body contain the User data
    // create a new user document using the mongoose model
    const newAdmin  = new Admin(data);
    // save the new Admin to the database
    const response = await newAdmin.save();
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
      const admin = await Admin.findOne({email : email});

      // if user not exist with that username  or password doesn't match
      if(!admin || !(await admin.comparePassword(password))){
            return res.status(401).json({error: 'Invalid Email or Password'});
      }

      // generate the token 
       const payload = {
         id : admin.id
       }

       const token = generateToken(payload);
  

       // retutn token as response
       res.json({token , role : "admin"});
  }
  catch(err){
       console.log(err);
       res.status(500).json({error:'Internal Server Error'});
  }
}); 

//************************************* admin profile  ********************************************* */

Router.get('/profile' , jwtAuthMiddleware , async (req, res) =>{
      
  try{
    const adminData =  req.user;
    console.log("Admin Data : " , adminData);

    const adminId = adminData.id;
    // find the admin by id
    const admin = await Admin.findById(adminId);
    res.status(200).json(admin); 
  }
  catch(err){
      console.log(err);
      res.status(500).json({error:'Internal Server Error'});
  }   
});

//*************************************** change password ************************************************* */

Router.put('/profile/password' , jwtAuthMiddleware ,async (req, res) => {
  try{
      const adminID = req.user.id; // extracting id from token
      console.log('User ID:', adminID);
      // ask user for current password and new password
      const {currentPassword , newPassword} = req.body;
        
      console.log('Current password:', currentPassword, 'New password:', newPassword);
         
      // find the user by id
      const admin = await Admin.findById(adminID);

     // if user current password doesn't match
     if( !(await admin.comparePassword(currentPassword))){
      return res.status(401).json({error: 'Invalid usernaem or password'}); 
    }

    // update password
    admin.password = newPassword;
    await admin.save();
      
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
    const data  = await Admin.find();
    console.log('data fetched');
    res.status(200).json(data);
}
catch(err){
  console.log(err);
  res.status(500).json({error:'Internal server Error'});
} 
});

module.exports = Router;