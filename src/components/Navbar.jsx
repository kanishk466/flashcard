import React from 'react'
import {NavLink} from "react-router-dom"
const Navbar = () => {
  return (
 <>


 <div className="container mt-5">
 <h1 className=" mb-4">Create Flashcard</h1>
 <nav  aria-label="breadcrumb">
  <ol class="breadcrumb">

    
    <li class="breadcrumb-item"><NavLink to="/">Create New</NavLink></li>
    <li class="breadcrumb-item"><NavLink to="/my-flashcard">My Flashcard</NavLink></li>

  
    
  </ol>
  <hr />
</nav>
 </div>

  
  </>
   
  )
}

export default Navbar