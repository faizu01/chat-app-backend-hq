import "./App.css";
import { io } from "socket.io-client";
import React from 'react'

const App = () => {
  const socket=io("http://localhost:5000")
  
  return (
    <div>App</div>
  )
}

export default App
