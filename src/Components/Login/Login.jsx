import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import ImageMosaicLoader from "../Loader/ImageMosaicLoader";
import { API_URI } from "../../../config";
import { useAuth } from "../Contexts/AuthContext";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_URI}/auth/login`, data, {
        withCredentials: true,
      });

      // Update auth context — prevents flicker on next page
      await login(response.data.user);

      if (response.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email address");
    if (!email) return;

    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await axios.post(`${API_URI}/auth/forgot-password`, { email });
      alert(res.data.message || "If that email exists, a reset link has been sent");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${API_URI}/auth/google`, "_self");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sport-bg bg-cover bg-center">
      <motion.div
        className="relative bg-opacity-90 p-6 rounded-lg shadow-2xl w-80"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: "#000000" }}
      >
        {isLoading && <ImageMosaicLoader size={70} />}

        <motion.img
          src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1720874424/dx22aboggirzfutgulei.jpg"
          alt="Top Image"
          className="mb-4 rounded-lg w-20 h-20 mx-auto"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />

        <h2 className="text-2xl font-bold text-center text-slate-50 mb-4">
          Login
        </h2>

        {/* Error message */}
        {errorMessage && (
          <motion.p
            className="text-red-400 text-sm text-center mb-3 bg-red-900/30 rounded-lg px-3 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errorMessage}
          </motion.p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                }`}
              style={{ paddingRight: "40px" }}
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: "0",
                margin: "0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                lineHeight: "0",
                height: "18px",
                width: "18px",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right">
            <Link
              onClick={handleForgotPassword}
              className="text-sm text-orange-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            type="submit"
            className="w-full py-2 px-4 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="flex items-center my-3">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 px-4 flex items-center justify-center border text-slate-50 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <FcGoogle className="mr-2" size={20} />
          Login with Google
        </button>

        <div className="mt-4 text-center">
          <p className="text-slate-50">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-600 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/" className="text-slate-50 hover:underline">
              Go to Home Page
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
