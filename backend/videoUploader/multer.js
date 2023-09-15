const multer = require("multer");

const FILETYPE = {
    "video/mp4" : "mp4"
};

const uploader = multer({

    limits : 500000 ,
    storage : multer.diskStorage({

        destination : (req , file ,cb)=>{
            cb(null , "uploads/videos");
        } ,

        filename :(req, file ,cb)=>{
             
            const extension = FILETYPE[file.mimetype];

            cb(null , Math.random() + "." +extension);
        } 
    }) ,

    fileFilter : (req , file ,cb)=>{
           const isValid = !!FILETYPE[file.mimetype];

           const error = isValid ? null : new Error("INVALID MIMETYPE") ;

           cb(error , isValid);
    }

});

module.exports = uploader;