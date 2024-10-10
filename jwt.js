// video - 12;

const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req,res,next) =>{
      // Extract the jwt token from the request headers
      const token = req.headers.authorization.split(' ')[1];
      if(!token) return res.status(401).json({error : 'Unauthorized'});   

      try{
          // verify the token
          const decode = jwt.verify(token , process.env.JWT_SECRET);
          // attech user info to the request object
          req.user = decode; // user is just a name we can write any name
          next();
      }
      catch(err){
           console.log(err);
           res.status(401).json({error:'Invalid token'});
      }
}


// function to generate the  jwt token
const generateToken =  (userData) => {
    // Generate the new JWT token using user data 
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '24h'}); // token expire time is 60 second
    /*
       means after 60 second of singup token will expire then that token has no use
       so then again i have to generate the token.
       Q. for every time generating  the token uesr will  have to signup again again => NO!
       answer : we will use login method 

    */ 
}

module.exports = {jwtAuthMiddleware , generateToken};