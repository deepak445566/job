import React from "react";
import Login from "./Components/auth/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import { useAppContext } from "./context/AppContextProvider";
import Navbar from "./Components/common/Navbar";

function App() {
  const { showLogin } = useAppContext(); // user bhi lein context se

  return (
    <div>
      {/* Navbar hamesha dikhega */}
      <Navbar />

      {/* Login modal - tabhi dikhega jab showLogin true ho */}
      {showLogin && <Login />}

      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <Flo
    </div>
  );
}

export default App;
