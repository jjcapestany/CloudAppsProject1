import { useState } from 'react'
import './App.css'
import { Header } from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SplashPage } from './components/SplashPage'
import { Footer } from './components/Footer'
import { Projects } from './components/Projects'

function App() {

  return (
    <div className='flex flex-col min-h-screen'>
      <BrowserRouter>
        <Header/>
        <Routes>
            <Route path='/' element={<SplashPage/>}/>
            <Route path='/projects' element={<Projects/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App
