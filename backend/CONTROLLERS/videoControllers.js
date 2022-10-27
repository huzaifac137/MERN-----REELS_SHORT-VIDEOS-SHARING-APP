const VIDEO = require("../MODELS/video");
const USER = require("../MODELS/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");

const postVideos=async(req,res,next)=>
{

   

    let userExists ;

    try
    {
        userExists = await USER.findById(req.body.creator);
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
      console.log(err);
      error.code = 400;
      return next(error);
    }

    let creatorUsername = req.extractedUsername;
    let creatorUserId = req.extractedUserId;


    if(creatorUserId!==req.body.creator)
    {
      const error = new Error("NON - AUTHORIZED USER");
      error.code = 403;
      return next(error);
    }
      
    let newVideo;

       newVideo =  new VIDEO({
        title : req.body.title ,
        file :   req.file.path ,
        creator : creatorUserId ,
        creatorUsername : creatorUsername ,
        likes : []
       });


   try
   {
     await newVideo.save();
     userExists.videos.push(newVideo);
     await userExists.save();
   }

   catch(err)
   {
    const error = new Error("SOMETHING WENT WRONG");
    console.log("ERROR : " + err);
    error.code =500;
    return next(error);
   }



   res.status(201).json({message : "VIDEO POSTED SUCCESSFULLY"});
    
};

const getVideos=async(req, res ,next)=>
{
    let videos;
     try
     {
       videos = await VIDEO.find({});
     }

     catch(err)
     {
      const error = new Error("SOMETHING WENT WRONG");
      error.code =500;
      return next(error);
     }

     res.status(200).json({videos : videos.map((video)=>video.toObject({getters:true}))});

};

const getVideosByUser =async(req,res,next)=>
{
   const{username} = req.params; 

   let userVideos;
   try
   {
      userVideos = await VIDEO.find({creatorUsername : username});
   }

   catch(err)
     {
      const error = new Error("SOMETHING WENT WRONG");
      error.code =500;
      return next(error);
     }

     res.status(200).json({userVideos : userVideos.map((item)=>item.toObject({getters:true})  )});
     
}

const deleteVideo=async(req ,res ,next)=>{
          
  const{creator} = req.headers;
  const{id} = req.params;

  
  let video;
  try
  {
     video = await VIDEO.findById(id).populate("creator");
  }

  catch(err)
  {
    const error = new Error("SOMETHING WENT WRONG");
    console.log(err);
    error.code =500;
    return next(error);
  }

  const userId = req.extractedUserId;

  if(userId!==creator)
  {
    const error = new Error("NON - AUTHORIZED USER");
    error.code = 403;
    return next(error);
  }

  

  try
  {
    video.creator.videos.pull(video);
    await video.creator.save();
    fs.unlink(video.file , err=>{
      
    });
    await video.remove();

  }

  catch(err)
  {
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
      video = await VIDEO.findById(id);
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

   if( video.likes.filter((item)=>item.toString()===userId).length>0)
   {
    video.likes.pull(userId);
    await video.save();
   }
   else
   {
    video.likes.push(userId);
    await video.save();
   }
    
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