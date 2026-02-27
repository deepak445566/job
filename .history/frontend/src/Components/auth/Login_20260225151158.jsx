import React from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContextProvider";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBriefcase,
  FaLinkedinIn,
  FaInstagram,
  FaGoogle,
  FaGithub,
  FaTimes,
} from "react-icons/fa";

function Login() {
  const { setShowLogin, setUser, axios, navigate } = useAppContext();
  const [state, setState] = React.useState("login");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  const onSubmitHandle = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 top-16 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FaBriefcase className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">UniNaukri</h1>
              <p className="text-white/80 text-sm">
                Where opportunities meet talent
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex -space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="user"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="user"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="user"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </div>
            <p className="text-sm text-white/90">Join 10k+ professionals</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {state === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <span className="text-sm text-gray-500">
              {state === "login"
                ? "Don't have an account?"
                : "Already registered?"}
              <button
                onClick={() =>
                  setState(state === "login" ? "register" : "login")
                }
                className="ml-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                {state === "login" ? "Sign up" : "Sign in"}
              </button>
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
              <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                Google
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
              <FaLinkedinIn className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                LinkedIn
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
              <FaGithub className="text-gray-800 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                GitHub
              </span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={onSubmitHandle} className="space-y-4">
            {state === "register" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaUser className="text-gray-400" size={14} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" size={14} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaLock className="text-gray-400" size={14} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {state === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            {state === "register" && (
              <div className="text-xs text-gray-500 mt-2">
                By signing up, you agree to our{" "}
                <button className="text-blue-600 hover:underline">Terms</button>{" "}
                and{" "}
                <button className="text-blue-600 hover:underline">
                  Privacy Policy
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {state === "login" ? "Sign In" : "Create Account"}
            </button>

            {/* Job seeker tips */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-800 flex items-center gap-2">
                <FaBriefcase className="text-blue-600" />
                {state === "login"
                  ? "Complete your profile to get noticed by top recruiters"
                  : "Join now to access 10k+ jobs and connect with professionals"}
              </p>
            </div>
          </form>

          {/* Instagram-style footer */}
          <div className="mt-6 flex justify-center gap-4 text-xs text-gray-400">
            <span>© 2024 UniNaukri</span>
            <span>•</span>
            <button className="hover:text-gray-600">About</button>
            <span>•</span>
            <button className="hover:text-gray-600">Help</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;
