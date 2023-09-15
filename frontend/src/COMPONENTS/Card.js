import React, { useEffect, useState ,useRef, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../CONTEXT/AuthContext';
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import userIcon from "../assets/user.png";

function Card({title , file , creatorUsername ,id , creator , likes , likesArrayItem }) {
    console.log("CREATOR" , creator);
    
    const[playPause , setPlayPause] = useState("pause");
    const[responseMessage , setResponseMsg] = useState();
    const[isLiked , setIsLiked] = useState(false);

    const videoRef = useRef();

    const navigate = useNavigate();
    const ctx = useContext(authContext);

    
   const handleBtn=()=>
   {
    if(playPause==="pause")
    {
        videoRef.current.play();
        setPlayPause("play");
    }

    else
    {
        videoRef.current.pause();
        setPlayPause("pause");
    }
    
   }

   const handleProfile=()=>{
          navigate(`/${creatorUsername}/profile` , {state :{username : creatorUsername}});
   }


   const handleDelete=async()=>{
              
        let responseData;

        try
        {
           const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/videos/${id}/delete` , {
            method :"DELETE" ,
            headers : {
                "Content-Type" : "application/json" ,
                "token" : ctx.token ,
                "creatorid" : creator.id
            }
           }) ;

           responseData = await response.json();

           if(response.status!==201)
           {
            throw new Error(responseData.message);
           }
             
           setResponseMsg(responseData.message);

        }

        catch(err)
        {
              setResponseMsg(err.message);
        }
   }

   const likeHandler=async()=>{
          
    let responseData;
    try
    {
       const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/videos/${id}/likes` ,{

        method :"POST" ,

        headers : {
            "token" : ctx.token ,
        } 
       });

       responseData = await response.json();

       if(response.status!==201) 
       {
        throw new Error(responseData.message);
       }

       ctx.setLikes(responseData.likes);

    }

    catch(err)
    {
     
    }

   }


   let likeButton ;

   if(likesArrayItem.filter((item)=>item===ctx.userId).length>0)
   {
    likeButton = <AiFillHeart/>
   }

   else
   {
    likeButton = <AiOutlineHeart/>
   }
 
    return (
        <div className='card'>

{responseMessage ? <h2> {responseMessage} </h2>  :
             
             <>
            <div style={{ alignSelf:"flex-start" , display:"flex"  , alignItems:"center", justifyContent:"flex-start" , gap :"10px" ,  marginBottom:"5px" , cursor:"pointer" }} onClick={handleProfile}>
                <img src={userIcon}  alt='user-icon'/>
                <h3>{creatorUsername}</h3>
            </div>

         <video className='vid' height={400} width={400}  loop controls={false} disablePictureInPicture ref={videoRef} onClick={handleBtn}  > 
          <source src={`${process.env.REACT_APP_SERVER_URL}${file}`}  /> 
          </video>

          <div style={{display:"flex" , alignItems:"center"  , width:"100%" }}>
          <h3 onClick={likeHandler} style={{marginRight:"10px"}}> {likeButton} </h3>
          <h4> {likes} LIKES</h4> 
          </div>
         
          <div className='cardFooter'>
          <h3 style={{cursor:"pointer"}} onClick={handleProfile}>{creatorUsername}</h3> 
           <h6 style={{marginLeft:"10px" }}> {title}</h6> 
           
          </div> 


        { creator?.id===ctx.userId && <button type='button' className='btn-danger' onClick={handleDelete} > DELETE</button> }
  
      </> } </div>
    );
}

export default Card;