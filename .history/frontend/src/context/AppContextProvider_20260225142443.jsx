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
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      console.log("Fetching user auth status...");
      const { data } = await axios.get("/api/user/isauth");
      console.log("Auth response:", data);
      
      if (data.success) {
        console.log("User authenticated:", data.user);
        setUser(data.user);
      } else {
        console.log("User not authenticated");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      console.error("Error response:", error.response?.data);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Debug: Log whenever user changes
  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  return (
    <AppContext.Provider value={{ 
      navigate, 
      user, 
      setUser, 
      axios, 
      setShowLogin, 
      showLogin,
      loading 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);