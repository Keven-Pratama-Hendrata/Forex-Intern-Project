import React from 'react'
import { Route, Routes } from 'react-router'
import Login from "./Pages/Login/Login"

const App = () => {
  return (
    <div data-theme="light">
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App