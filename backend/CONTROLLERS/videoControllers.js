const {VIDEO , USER} = require("../models/index");
// const USER = require("../MODELS/user");
// require("dotenv").config();
// const jwt = require("jsonwebtoken");
const fs = require("fs");

const postVideos=async(req,res,next)=>
{

   

    let userExists ;

    try
    {
        userExists = await USER.findByPk(req.body.creator);
    }

    catch(err)
    {
      const error = new Error("SOMETHING WENT WRONG");
      console.log(err);
      error.code = 500;
      return next(error);
    }

    if(!userExists)
    {
      const error = new Error("USER DOESNT EXIST");
      error.code = 400;
      return next(error);
    }

    let creatorUsername = req.extractedUsername;
    let creatorUserId = req.extractedUserId;

    console.log(creatorUserId +" " + req.body.creator);

    if(creatorUserId!==parseInt(req.body.creator))
    {
      const error = new Error("NON - AUTHORIZED USER");
      error.code = 403;
      return next(error);
    }
      
    let newVideo;

       newVideo = VIDEO.create ({
        title : req.body.title ,
        file :   req.file.path ,
        creatorUsername : creatorUsername ,
        likes : [] ,
        userId : creatorUserId
       });


   res.status(201).json({message : "VIDEO POSTED SUCCESSFULLY"});
    
};

const getVideos=async(req, res ,next)=>
{
    let videos;
     try
     {
       videos = await VIDEO.findAll({include:{
        model : USER ,
        as : "creator"
      }});
     }

     catch(err)
     {
      const error = new Error("SOMETHING WENT WRONG");
      error.code =500;
      return next(error);
     }

     res.status(200).json({videos : videos});

};

const getVideosByUser =async(req,res,next)=>
{
   const{username} = req.params; 

   let userVideos;
   try
   {
      userVideos = await VIDEO.findAll({where : {creatorUsername : username} ,include:{
        model : USER ,
        as : "creator"
      }});
   }

   catch(err)
     {
      const error = new Error("SOMETHING WENT WRONG");
      error.code =500;
      return next(error);
     }
     
    
     res.status(200).json({userVideos : userVideos});
     
}

const deleteVideo=async(req ,res ,next)=>{
          
  const{creatorid} = req.headers;
  const{id} = req.params;

  const userId = req.extractedUserId;

  if(userId.toString()!==creatorid)
  {
    const error = new Error("NON - AUTHORIZED USER");
    error.code = 403;
    return next(error);
  }
  
  let video;
  try
  {
     video = await VIDEO.findOne({ where : {id : id , userId : creatorid}});
  }

  catch(err)
  {
    const error = new Error("SOMETHING WENT WRONG");
    error.code =500;
    return next(error);
  }

  try {
         await video.destroy();
         fs.unlink(video.file , ()=>{
          console.log("file removed from pc");
         })
  } catch (err) {
    const error = new Error("SOMETHING WENT WRONG");
    console.log(err);
    error.code =500;
    return next(error);
  }


  res.status(201).json({message : "VIDEO SUCCESSFULLY DELETED"});

};


const onLike=async(req ,res , next)=>{
      
  const{id} = req.params;
  const{creator} = req.headers;

  let video;
    try
    {
      video = await VIDEO.findByPk(id);
    }

    catch(err)
    {
      const error = new Error("SOMETHING WENT WRONG");
      console.log(err);
      error.code =500;
      return next(error);
    }


    
  const userId = req.extractedUserId;

  if(!userId)
  {
    const error = new Error("NON - AUTHORIZED USER");
    error.code = 403;
    return next(error);
  }

  try
  {
      
   if( video.likes.filter((item)=>item.toString()===userId.toString()).length>0)
   {
     const index = video.likes.indexOf(userId);
       video.likes.splice(index , 1);

   }
   else
   {
    video.likes.push(userId);

   }

   video.changed("likes" , true);
   await video.save();

    
  }

  catch(err)
    {
      const error = new Error("SOMETHING WENT WRONG");
      console.log(err);
      error.code =500;
      return next(error);
    }

    res.status(201).json({likes : video.likes });


};

exports.getVideos = getVideos;
exports.getVideosByUser = getVideosByUser;
exports.postVideos=postVideos;
exports.deleteVideo = deleteVideo;
exports.onLike = onLike;