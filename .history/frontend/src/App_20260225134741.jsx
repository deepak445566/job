import React from 'react'
import Login from './Components/Login'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Components/Dashboard'

function App() {
    const {showLogin,isSeller} = useAppContext();
  return (
    <div>
        {showLogin ? <Login/> : null}
<Routes>
<Route path='/' element={<Dashboard/>}></Route>


</Routes>
     
    </div>
  )
}

export default App