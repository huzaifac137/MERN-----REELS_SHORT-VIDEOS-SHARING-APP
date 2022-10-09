import React, { useEffect, useState } from 'react';

function VideoUploader(props) {

    const[VIDEO , setVIDEO] = useState();
    const[isValid , setIsValid] = useState(false);
    const[previewURL , setPreviewURL]  = useState();

    const[TITLE , setTitle] = useState("");

    const[responseMessage , setResponseMessage] = useState(null);

    let video , vidisvalid;
    const videoHandler=(e)=>
    {
         vidisvalid =isValid;
        if(e.target.files || e.target.files.length>0)
        {
          video = e.target.files[0];
          setVIDEO(e.target.files[0]);
          vidisvalid =true;
           setIsValid(true)
        }

        else
        {
            vidisvalid = false;
            setIsValid(false);
        }
    }

    const titleChangeHandler=(e)=>{
        setTitle(e.target.value);
    }

    useEffect(()=>{
        
        if(!VIDEO)
        {
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload=()=>
        {
              setPreviewURL(fileReader.result);
        }

        fileReader.readAsDataURL(VIDEO);
    },[VIDEO]);

    const handleSubmit=async(e)=>
    {
        e.preventDefault();

        let response , responseData;
        const userId = JSON.parse(localStorage.getItem("userId"));
        const formData = new FormData();
        formData.append("file" , VIDEO);
        formData.append("title" , TITLE);
       formData.append("creator" , userId);
        try
        {
             response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/videos/upload` , {
                method :"POST" ,
                
                body : formData

             });

             responseData = await response.json();

             if(response.status===201)
             {
              setResponseMessage(responseData.message);
              return;
             }

             throw new Error(responseData.message);
        }

        catch(err)
        {
          setResponseMessage(err.message);
        }
    }

    return (

        <form onSubmit={handleSubmit} className="uploader">

            {responseMessage && <h2>{responseMessage} </h2>}

            <h2 style={{textAlign:"center"}}>VIDEO UPLOADER </h2> 

          <div style={{display:"flex" , alignItems:"center" , justifyContent:"center" , height:"220px" , width:"200px", backgroundColor:"black"}}>

         {isValid ?  <video src={previewURL} style={{width:"200px" , height:"150px"}} 
         autoPlay loop controls={false} controlsList='nofullscreen noplaybackrate nodownload' disablePictureInPicture  /> 
         
         : <h4 style={{color:"white"}} >PICK A VIDEO</h4> }

         </div>

            <input type="text" value={TITLE} placeholder="TITLE" onChange={titleChangeHandler} />
           <input type="file" accept='.mp4 , .ogg ' onChange={videoHandler} /> 

           <button> SUBMIT </button>
        </form>
    );
}

export default VideoUploader;