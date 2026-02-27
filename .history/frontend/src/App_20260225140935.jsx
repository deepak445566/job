import React from "react";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import { useAppContext } from "./context/AppContextProvider";
import Navbar from "./Components/Navbar";

function App() {
  const { showLogin, user } = useAppContext(); // user bhi lein context se
  
  return (
    <div>
      <N
      {showLogin && <Login />}
      <Routes>
        <Route 
          path="/" 
          element={
           <Navbar/>
          } 
        />
       
      </Routes>
    </div>
  );
}

export default App;