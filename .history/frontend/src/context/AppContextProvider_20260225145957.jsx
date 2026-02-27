import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "./AppContext";
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
console.log("Base URL:", import.meta.env.VITE_BACKEND_URL);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('chill'); // Default 'chill' ya 'study'
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/isauth");
      if (data.success) {
        setUser(data.user);
        // User login hai toh uski mode fetch karo
        fetchUserMode();
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // User ka mode fetch karne ka function
  const fetchUserMode = async () => {
    try {
      const { data } = await axios.get("/api/user/mode");
      if (data.success) {
        setMode(data.mode);
      }
    } catch (error) {
      console.log("Error fetching mode:", error);
    }
  };

  // Mode toggle karne ka function
  const toggleMode = async () => {
    if (!user) {
      toast.error("Please login first");
      setShowLogin(true);
      return;
    }

    try {
      const { data } = await axios.post("/api/user/switch-mode");
      if (data.success) {
        setMode(data.mode);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error switching mode");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider 
      value={{ 
        navigate, 
        user, 
        setUser, 
        axios, 
        setShowLogin, 
        showLogin,
        mode,
        setMode,
        toggleMode,
        loading 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);