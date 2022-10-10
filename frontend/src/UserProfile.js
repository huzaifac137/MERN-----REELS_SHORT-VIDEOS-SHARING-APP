import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Card from './COMPONENTS/Card';
import authContext from './CONTEXT/AuthContext';

function UserProfile({}) {
     
    const ctx = useContext(authContext);
    const location = useLocation();
    const params = useParams();
    const state = location.state;
    
    let un;


    const[VIDEOS , setVideos] = useState([]);
    const[isLoading ,setIsLoading] = useState(true);
    const[ERROR , setError] = useState();

    let username;
    if(params)
    {
        username = (params.username);
    }

   else if(state)
    {
         username = (state.username );
    }

    const getVideosByUser =async()=>
    {
        let responseData;

        try
        {   
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/videos/${username}`);

            responseData = await response.json();

            if(response.status!==200)
            {
                throw new Error(responseData.message);
            }
              
           
            setVideos(responseData.userVideos);
            console.log(responseData.userVideos);
            setIsLoading(false);
        }

        catch(err)
        {
          setError(err.message);
          setIsLoading(false);
        }
    }

    useEffect(()=>{
    
        getVideosByUser();

  } ,[ctx.likes , username]);

  if(ERROR)
  {
    return (
        <h2 style={{textAlign:"center" , margin:"100px auto"}}> {ERROR} </h2>
    )
  };


 
    return (
        <div className='profile'>

            
     {isLoading ? <h2>LOADING....</h2>    : <> <h2 style={{alignSelf:"flex-start" , marginLeft:"20px"}}> {username}</h2> 

            <div>
            <h3> {VIDEOS.length} </h3>
             <h3>POSTS</h3>
            </div>
        
        <div style={{display:"flex" , flexDirection:"column" , alignItems:"center"}}>
        {VIDEOS.map((video)=> <Card key={video.id} id={video.id} file={video.file}  
        creatorUsername={video.creatorUsername} title={video.title} creator ={video.creator} 
        likes={video.likes.length} likesArrayItem={video.likes} />  )}
        </div>
            
        </> }
           </div>
    );
}

export default UserProfile;