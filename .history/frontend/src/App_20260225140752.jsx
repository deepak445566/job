import React from "react";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import { useAppContext } from "./context/AppContextProvider";

function App() {
  const { showLogin, user } = useAppContext(); // user bhi lein context se
  
  return (
    <div>
      {showLogin && <Login />}
      <Routes>
        <Route 
          path="/" 
          element={
            // Agar user hai toh dashboard dikhao, nahi toh kuch mat dikhao (login modal show hoga)
             <Dashboard /> 
          } 
        />
       
      </Routes>
    </div>
  );
}

export default App;