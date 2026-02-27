import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import axios from "axios";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;






export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);







  const fetchUser = async ()=>{
    try {
      const {data} = await axios.get('/api/user/isauth');
      if(data.success){
        setUser(data.user)
    

      }
    } catch (err) {
      setUser(null)
    }
  }



  useEffect(() => {
    fetchSeller()
    fetchUser()
    fetchProducts()
  }, []);
//databasecrt items//
useEffect(()=>{
const updateCart = async () => {
  try {
    const { data } = await axios.post('/api/cart/update', {
      userId: user._id,   // make sure user object has _id
      cartItems
    });
    if (!data.success) {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

if(user){
  updateCart()
}


},[cartItems])



  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showLogin,
    setShowLogin,
    products,
    addToCart,
    updateCart,
    removeFromCart, // ⬅ new function
    cartItems,
    search,
    setSearch,
    getcount,
    gettotal,
    axios,
    fetchProducts,
    setCartItems
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useAppContext = () => {
  return useContext(AppContext);
};
