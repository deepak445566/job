import React from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContextProvider";
import {
  FaEnvelope,
  FaLock,
  FaTimes,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";

function Login() {
  const { setShowLogin, setUser, axios, navigate } = useAppContext();
  const [state, setState] = React.useState("login");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let payload = {};

      if (state === "register") {
        payload = { username, email, password };
      } else {
        payload = { email, password };
      }

      const { data } = await axios.post(`/api/auth/${state}`, payload);

      if (data.success) {
        toast.success(
          state === "login"
            ? "Welcome back! 👋"
            : "Account created successfully! 🎉",
        );
        navigate("/");
        setUser(data.user);
        setShowLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp"
      >
        {/* Simple Close Button */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <FaTimes size={20} />
        </button>

        {/* Simple Header */}
        <div className="pt-12 pb-6 px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
         <img src="/images/log.jpg" className="rounded-full"/>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {state === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {state === "login" 
              ? "Please enter your details to sign in" 
              : "Please fill in the details to get started"}
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8">
          <form onSubmit={onSubmitHandle} className="space-y-5">
            {state === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

           

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{state === "login" ? "Sign in" : "Create account"}</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">or</span>
              </div>
            </div>

            {/* Toggle between login/register */}
            <div className="text-center">
              <p className="text-gray-600">
                {state === "login" ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setState(state === "login" ? "register" : "login")}
                  className="ml-1.5 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {state === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;