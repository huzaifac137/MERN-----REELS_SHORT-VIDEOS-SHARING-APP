const mongoose = require("mongoose");

const SCHEMA = mongoose.Schema;

const videoSchema = new SCHEMA({
    title : {type : String , required : true} ,
    file : {type : String , required : true} ,
    creator : {type : mongoose.Types.ObjectId , ref : "user" , required: true } ,
    creatorUsername : {type : String , required : true} ,
    likes : [{type : mongoose.Types.ObjectId , ref :"user" , required: true }]
});

module.exports =  mongoose.model("video" , videoSchema);