import React from "react";
import Login from "./Components/auth/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import { useAppContext } from "./context/AppContextProvider";
import Layout from "./Components/common/Layout";

function App() {
  const { showLogin } = useAppContext();

  return (
    <>
      {showLogin && <Login />}

      <Routes>
        {/* Layout wrap karega sab routes ko */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;