const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs

// define the User sechema 
const UserSchema =new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    rollno:{
        type : String
    },
    regno :{
        type : String,
        required : true
    },
    program:{
        type: String,
        required : true
    },
    mobile :{
        type : String,
        required: true,
        unique : true
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
    role: {
         type: String,
         default: "customer"
     }

}); 



// bcrypt 
UserSchema.pre('save' , async function(next){
    const user = this;
    
    // hash the password only if it has been  modified 
    if(!user.isModified('password')) return next();
    
    try{
       // hash password generation
             const salt = await  bcrypt.genSalt(10); //complexity of salt is depend upon the vlaue of genSalt.
             
             // hash password
             const hashedPassword = await  bcrypt.hash(user.password , salt);
             
             user.password = hashedPassword;
             
             next();
         }
         catch(err){
             return next(err);   
         }
     });
     
     
     
// comparing the password
UserSchema.methods.comparePassword = async function(candidatePassword){
 try{
     // use bcrypt to campare the  provided password with the hashed password
     const isMatch = await bcrypt.compare(candidatePassword, this.password);
     return isMatch;
 }
 catch(err){
     throw err;
 }
};







// create user model
const User = mongoose.model('User', UserSchema);
module.exports = User;
 

