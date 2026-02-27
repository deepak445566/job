import React from "react";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import { useAppContext } from "./context/AppContextProvider";

function App() {
  const { showLogin } = useAppContext();
  return (
    <div>
      {showLogin ?  <Route path="/login" element={<Login />} /> : null}
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>


      </Routes>
    </div>
  );
}

export default App;
