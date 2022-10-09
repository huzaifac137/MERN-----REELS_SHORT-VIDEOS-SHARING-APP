import React, { useEffect, useState ,useRef, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../CONTEXT/AuthContext';

function Card({title , file , creatorUsername ,id , creator }) {
    
    const[playPause , setPlayPause] = useState("pause");
    const[responseMessage , setResponseMsg] = useState();
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
                "creator" : creator
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


    return (
        <div className='card'>

{responseMessage ? <h2> {responseMessage} </h2>  :
             
             <>
            <h2 style={{alignSelf:"flex-start" , marginBottom:"5px" , cursor:"pointer" }} onClick={handleProfile}>{creatorUsername}</h2>

         <video className='vid' height={400} width={400}  loop controls={false} disablePictureInPicture ref={videoRef} onClick={handleBtn}  > 
          <source src={`${process.env.REACT_APP_SERVER_URL}${file}`}  /> 
          </video>

          <div className='cardFooter'>

          <h3 style={{cursor:"pointer"}} onClick={handleProfile}>{creatorUsername}</h3> 
           <h6 style={{marginLeft:"10px" }}> {title}</h6> 

          </div> 

        { creator===ctx.userId && <button type='button' className='btn-danger' onClick={handleDelete} > DELETE</button> }
  
      </> } </div>
    );
}

export default Card;