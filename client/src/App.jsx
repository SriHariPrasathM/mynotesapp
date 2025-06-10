import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Profile from './components/Profile.jsx';
import Dashboard from './components/Dashboard.jsx';
import './App.css';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';

function App() {

  const { user, loading } = useContext(AuthContext);
  
  if(loading) {
    return <div className='loading'>Loading...</div>
  }
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={user ? <Navigate to='/dashboard' /> : <Navigate to='/login'/>} />
        <Route path='/login' element={user ? <Navigate to='/dashboard' /> : <Login />} />
        <Route path='/register' element={<Register />} />
        
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
