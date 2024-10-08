// for password authentication
const passport =  require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');


// logic for auth
passport.use(new LocalStrategy( async (USERNAME , PASSWORD , done) =>{
    try{
         console.log('Recived Credentials');
         const user = await User.findOne({ username : USERNAME});
         if(!user){
            return done(null, false , {message:'Username Not Found.'});
         }
         const isPasswordMatch = await user.comparePassword(PASSWORD);

         if(isPasswordMatch){
            return done(null , user);
         }
         else{
            return done(null, false, {message:'Incorrect Password'});
         }
    }
    catch(err){
        return done(err);
    }
}));



module.exports = passport;