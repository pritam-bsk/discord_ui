import { useState } from 'react'
import ServerList from './components/ServerList'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Register'
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
