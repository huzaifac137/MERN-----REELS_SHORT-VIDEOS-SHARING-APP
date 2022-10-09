const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors());

const videoRoutes = require("./ROUTES/videoRoutes");
const userRoutes = require("./ROUTES/userRoutes");

app.use("/api/videos" , videoRoutes);
app.use("/api/users" , userRoutes);

app.use(  "/uploads/videos" ,express.static(path.join("uploads" , "videos")));

app.use((req,res,next)=>{

    res.status(404);
    res.json({message : "ROUTE NOT FOUND"});
    return next();
})

app.use((err, req ,res ,next)=>{

    if(req.file)
    {
     fs.unlink(req.file.path , err=>{
        
     })
    }

    if(res.headerSent)
    {
        return next(err);
    }

    res.status(err.code || 500).json({message : err.message || "SOMETHING WENT WRONG"});
}) ;


const connectDb =async()=>{
    try
    {
        await mongoose.connect(process.env.MONGO_URL);
        app.listen(process.env.PORT ||5000);
        console.log("CONNECTION SUCCESSFUL");
    }
    
    catch(err)
    {
        console.log( "ERROR :  " + err);
    }
};

connectDb();


