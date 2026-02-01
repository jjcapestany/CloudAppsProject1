import './App.css'
import { Header } from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SplashPage } from './components/SplashPage'
import { Footer } from './components/Footer'
import { Projects } from './components/Projects'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HardwareManagement } from './components/HardwareManagement'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <AuthProvider>
        <BrowserRouter>
          <Header/>
          <Routes>
            <Route path='/' element={<SplashPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
            <Route path='/reset-password' element={<ResetPasswordPage/>}/>
            <Route path='/projects' element={
              <ProtectedRoute>
                <Projects/>
              </ProtectedRoute>
            }/>
            <Route path='/hardware' element={
              <ProtectedRoute>
                <HardwareManagement/>
              </ProtectedRoute>
            }/>
          </Routes>
          <Footer/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App
