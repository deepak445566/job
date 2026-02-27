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
      {/* Navbar hamesha dikhega */}
      <Navbar />
      
      {/* Login modal - tabhi dikhega jab showLogin true ho */}
      {showLogin && <Login />}
      
      <Routes>
        <Route 
          path="/" 
          element={
            // Sirf authenticated users ko dashboard dikhao
            user ? <Dashboard />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;