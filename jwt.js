// video - 12;

const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    // Check if the authorization header is present
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
  
    const tokenParts = authHeader.split(' ');
  
    // Ensure the token is in the correct format: 'Bearer <token>'
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }
  
    const token = tokenParts[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach user info to the request object
      req.user = decoded;
      next();
    } catch (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
  

// function to generate the  jwt token
const generateToken =  (userData) => {
    // Generate the new JWT token using user data 
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '24h'}); // token expire time is 24 hour
    /*
       means after 24 of singup token will expire then that token has no use
       so then again i have to generate the token.
       Q. for every time generating  the token uesr will  have to signup again again => NO!
       answer : we will use login method 

    */ 
}

module.exports = {jwtAuthMiddleware , generateToken};