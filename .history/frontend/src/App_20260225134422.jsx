import React from 'react'
import Login from './Components/Login'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div>
<Routes>
<Route path='/' element={<DashBo}></Route>


</Routes>
      <Login/>
    </div>
  )
}

export default App