const mongoose = require("mongoose");

const SCHEMA = mongoose.Schema;

const userSchema = new SCHEMA({
    username : {type : String , required : true} ,
    email : {type : String , required : true} ,
    password : {type : String , required : true} , 
    videos : [{type : mongoose.Types.ObjectId , ref : "video" }]
});

module.exports =  mongoose.model("user" , userSchema);