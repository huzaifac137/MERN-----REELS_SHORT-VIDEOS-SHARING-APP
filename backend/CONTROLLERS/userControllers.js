
const USER = require("../MODELS/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
require("dotenv").config();

const signup = async(req, res ,next)=>{
 
    const{username ,email , password} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        const error = new Error("PLZ ENTER REQUIRED FEILD PARAMETERS CORRECTLY");
        error.code = 400;
        return next(error);
    }


    let alreadyExists;
    try
    {
         alreadyExists = await USER.findOne({email: email });
    }

    catch(err)
    {
        const error = new Error("ERROR CONNECTING TO SERVER");
        error.code = 500;
        return next(error);
    }
    
    if(username.trim()=="" ||email.trim()=="" || password.trim()=="")
    {
        const error = new Error("FEILDS ARE EMPTY , PLEASE ENTER DATA");
        error.code= 401;
        return next(error);
    }

    if(alreadyExists)
    {
        const error = new Error("USER WITH THIS MAIL ALREDAY EXISTS");
        error.code = 409;
        return next(error);
    }

    let usernameAlreadyExists;
    try
    {
        usernameAlreadyExists = await USER.findOne({username : username});
    }

    catch
    {
        const error = new Error("ERROR CONNECTING TO SERVER");
        error.code = 500;
        return next(error);
    }

    if(usernameAlreadyExists)
    {
        const error = new Error("THIS USERNAME ALREDAY EXISTS");
        error.code = 409;
        return next(error);
    }

   const hashedPassword = await bcrypt.hash(password , 5);

   let newUser;
   try {

       newUser = new USER({
        email : email ,
        username : username,
        password : hashedPassword ,
        videos : []
    });

   }

   catch(err)
   {
     const error = new Error("USER CREATION FAILED , SERVER NOT RESPONDING");
     error.code = 500;
     return next(error);
   }

   let userCreated;
     try
     {
       userCreated = await newUser.save();
     }

     catch(err)
     {
        const error = new Error("SOMETHING WENT WRONG WITH SERVER WHILE MAKING CHANGES");
        error.code = 500;
        return next(error);
     }

     res.status(201).json({message : "USER CREATED SUCCESSFULLY , GO BACK AND LOG IN"});

};


const login = async(req , res , next)=>{

    const{email , password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty())
    { 
        const error = new Error("PLZ ENTER REQUIRED FEILD PARAMETERS CORRECTLY");
        error.code = 400;
        return next(error);
    }

    let emailExists;
    try
    {
         emailExists = await USER.findOne({email: email});
    }

    catch(err)
    {
        const error = new Error("ERROR CONNECTING TO SERVER , EMAIL");
        error.code = 500;
        return next(error);
    }



    if(!emailExists)
    {
        const error = new Error("NO SUCH USER EXISTS ON THIS APP");
        error.code = 401;
        return next(error);
    }

    let comparePassword;
    try
    {
         comparePassword = await bcrypt.compare(password , emailExists.password);
        
    }

    catch(err)
    {
        const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD");
        error.code = 500;
        return next(error);
       
    }

    if(comparePassword!==true)
    {
        const error = new Error("PASSWORD IS WRONG");
        error.code = 401;
        return next(error);
    } 
      let token;

      try
      {
        token =  jwt.sign({userId : emailExists.id , email : emailExists.email , username : emailExists.username} , process.env.JWT_KEY, {});
      }

      catch(err)
      {
        const error = new Error("SOMETHING WENT WRONG");
        error.code = 500;
        return next(error);
      }
    
 
    res.status(200);
    res.json({ token :token, username : emailExists.username ,  userId : emailExists.id , email : email , message :"LOGIN SUCCESS , WELCOME !"}); 

};

exports.signup = signup;
exports.login = login;