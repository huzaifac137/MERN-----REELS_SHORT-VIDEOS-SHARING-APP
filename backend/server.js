const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const videoRoutes = require("./ROUTES/videoRoutes");
const userRoutes = require("./ROUTES/userRoutes");
const DB = require("./models/index.js");

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
        const connectionSync =  await DB.sequelize.sync({});
        console.log("Connected and synced to database");
    }
    
    catch(err)
    {
        console.log( "ERROR :  " + err);
    }
};

connectDb();

const PORT =process.env.PORT;

app.listen( PORT|| 5000 , ()=>{
  console.log(`Listenin to port ${PORT}`)
})


