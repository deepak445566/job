import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    console.log("Fetching user...");

    try {
      const { data } = await axios.get("/api/user/isauth");

      console.log("Response from /isauth:", data);

      if (data.success) {
        console.log("User authenticated:", data.user);
        setUser(data.user);
      } else {
        console.log("User not authenticated");
        setUser(null);
      }

    } catch (error) {
      console.log("Auth Error Full:", error);
      console.log("Auth Error Response:", error.response?.data);
      console.log("Auth Error Message:", error.message);
      setUser(null);
    }
  };

  useEffect(() => {
    console.log("AppContext mounted");
    fetchUser();
  }, []);

  console.log("Current User State:", user);

  return (
    <AppContext.Provider
      value={{
        navigate,
        user,
        setUser,
        axios,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);