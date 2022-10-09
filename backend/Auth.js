const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth =(req , res ,next)=>
{
   
    const{token} = req.headers;

  let extractedToken;

  try
  {
     extractedToken =  jwt.verify(token , process.env.JWT_KEY);
  }

  catch(err)
  {
    const error = new Error("SOMETHING WENT WRONG");
    console.log(err);
    error.code =500;
    return next(error);
  }

   
  req.extractedUserId = extractedToken.userId;
  req.extractedUsername = extractedToken.username;

  next();


};

module.exports = auth;