const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs

/*
    name: "Admin Name",
    email: "admin@example.com",
    password: "securepassword",
    role: "admin"
*/


// define the User sechema 
const AdminSchema =new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email:{
        required : true,
        type: String,
        unique : true
    },
    password:{
        required : true,
        type: String
    },
    role:{
       type : String,
       defalut: 'admin'
    }
}); 



// bcrypt 
AdminSchema.pre('save' , async function(next){
    const admin = this;
    
    // hash the password only if it has been  modified 
    if(!admin.isModified('password')) return next();
    
    try{
       // hash password generation
             const salt = await  bcrypt.genSalt(10); //complexity of salt is depend upon the vlaue of genSalt.
             
             // hash password
             const hashedPassword = await  bcrypt.hash(admin.password , salt);
             
             admin.password = hashedPassword;
             
             next();
         }
         catch(err){
             return next(err);   
         }
     });
     
     
     
// comparing the password
AdminSchema.methods.comparePassword = async function(candidatePassword){
 try{
     // use bcrypt to campare the  provided password with the hashed password
     const isMatch = await bcrypt.compare(candidatePassword, this.password);
     return isMatch;
 }
 catch(err){
     throw err;
 }
};







// create Admin model
const Admin = mongoose.model('admin', AdminSchema);
module.exports = Admin;
 

