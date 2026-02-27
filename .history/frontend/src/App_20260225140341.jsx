import React from "react";
import Login from "./Components/Login";
import { Route, Routes, Navigate } from "react-router-dom";
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
            user ? <Dashboard /> : <div className="flex justify-center items-center h-screen">Please login to continue</div>
          } 
        />
        {/* Optional: Agar aap chahte hain ki login page alag se khule */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;