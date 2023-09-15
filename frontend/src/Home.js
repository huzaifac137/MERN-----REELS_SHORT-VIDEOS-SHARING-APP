import React, { useContext, useEffect, useState } from "react";
import Card from "./COMPONENTS/Card";
import authContext from "./CONTEXT/AuthContext";

function Home(props) {

    const[allVideos , setAllVideos] = useState([]);
    const[ERROR , setError] = useState(null);

    const ctx = useContext(authContext);

    const getVideos =async()=>
    {
        
        let responseData;

        try
        {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/videos`);

            responseData = await response.json();

            if(response.status!==200)
            {
                throw new Error(responseData.message);
            }

            setAllVideos(responseData.videos);
            console.log(responseData.videos);
          
            return;

        }

        catch(err)
        {
            setError(err.message);
        }
    }

    useEffect(()=>{

         getVideos();

    },[ctx.likes]);

    if(allVideos.length===0)
     {
        return <h3> NO VIDEOS FOUND </h3>
     }

  return (
    <div style={{display:"flex" , flexDirection:"column" , alignItems:"center" , margin : "50px auto" , borderTop:"1px solid grey"}}>
    {ERROR && <h2> {ERROR} </h2>}
    <h2> VIDEOS </h2>
      {allVideos.map((video)=> <Card key={video.id} title={video.title} file={video.file} 
      creatorUsername={video.creatorUsername} likes={video.likes.length} id={video.id} likesArrayItem={video.likes} />)}
     </div>
  );
}

export default Home;
