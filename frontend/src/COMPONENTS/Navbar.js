import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authContext from '../CONTEXT/AuthContext';

function Navbar(props) {

    const ctx = useContext(authContext);
    const navigate = useNavigate();

    const handleLogout=()=>{
           localStorage.removeItem("loggedInUser");
           ctx.setUsername(null);
           ctx.setEmail(null);
           ctx.setUserId(null);
           ctx.setToken(null);

           navigate("/");
    }

    return (
        <div style={{display:"flex" , alignItems:"center" , justifyContent:"space-around"  , margin:"10px auto"}} className="navbar">
               
        <div className='navlinks'>
         { ctx.token &&   <NavLink to="/" end style={{marginRight:"50px"}}> VIDEOS </NavLink> }
         {  ctx.token &&   <NavLink to="/upload">UPLOAD</NavLink> }
        </div>

        <div className='navlinks'>
         { !ctx.token &&   <NavLink to="/login" > LOGIN </NavLink> }
         {  !ctx.token &&   <NavLink to="/signup"> SIGNUP </NavLink> }
        </div>
     
        <div className='navlinks'>
         { ctx.token &&   <NavLink to={`${ctx.username}/profile`} > MY PROFILE </NavLink> }
        </div>

       { ctx.token && <button className='btn-danger' onClick={handleLogout}>LOGOUT</button> }
        </div>
    );
}

export default Navbar;