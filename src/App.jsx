import React from 'react'
import Navbar from './components/Navbar'

import {BrowserRouter as Router , Routes , Route} from "react-router-dom"
import CreateFlashCard from "./pages/CreateFlashCard"
import MyFlashcard from "./pages/MyFlashcards"

import FlashcardDetails from './pages/FlashcardDetails'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<CreateFlashCard/>}/>
        <Route path='/my-flashcard' element={<MyFlashcard/>}/>

        <Route path='/flashcard/:id' element={<FlashcardDetails/>}/>

      </Routes>
    </Router>
   
  )
}

export default App