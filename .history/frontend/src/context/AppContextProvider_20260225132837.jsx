import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "./AppContext";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
console.log("Base URL:", import.meta.env.VITE_BACKEND_URL);
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/isauth");
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider value={{ navigate, user, setUser, axios }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);