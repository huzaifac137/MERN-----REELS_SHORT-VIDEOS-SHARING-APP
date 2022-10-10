import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Home";
import VideoUploader from "./COMPONENTS/VideoUploader";
import Navbar from "./COMPONENTS/Navbar";
import Login from "./AUTH/Login";
import Signup from "./AUTH/Signup";
import authContext from "./CONTEXT/AuthContext";
import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";


function App() {

  const[EMAIL , setEmail] = useState();
  const[USERNAME , setUsername] = useState();
  const[TOKEN, setToken] = useState();
  const[USERID , setUserId] = useState();
  const[LIKES , setLikes] = useState();

  useEffect(()=>{
         
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if(loggedInUser)
    {
         setEmail(loggedInUser.email);
         setToken(loggedInUser.token);
         setUserId(loggedInUser.userId);
         setUsername(loggedInUser.username);
    }

  },[]);


 
  return (
    
    <authContext.Provider value={{username : USERNAME , email : EMAIL , token : TOKEN , userId : USERID , setUsername : setUsername ,
    setEmail :setEmail , setToken : setToken , setUserId : setUserId  , setLikes: setLikes , likes : LIKES}} >

    <BrowserRouter>
    <Navbar/>
    <Routes>

  { TOKEN ? <Route path="/" element={<Home/>}/>  : <Route path="/" element={<Login/>}/> }
   {TOKEN && <Route path="/upload" element={<VideoUploader/>}/> }
   { !TOKEN && <Route path="/login" element={<Login/> } />  }
 {! TOKEN &&   <Route path="signup" element={<Signup/>} />  }
 {TOKEN && <Route path=":username/profile" element={<UserProfile/>} />  }
    </Routes>
    </BrowserRouter>
    </authContext.Provider>
  );
}

export default App;
