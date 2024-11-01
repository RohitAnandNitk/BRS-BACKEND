const mongoose  = require('mongoose');

// define the contactus sechema 
const contactusSchema =new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email:{
        required : true,
        type: String,
    },
    phone:{
        type: String,
    },
    subject:{
       type : String,
       required : true
    },
    message :{
        type: String,
        required : true
    }
}); 

// create Admin model
const ContactUs = mongoose.model('contactus', contactusSchema);
module.exports = ContactUs;