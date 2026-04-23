import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { API_URI } from "../../../config";
import { useAuth } from "../Contexts/AuthContext";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step management: "form" → "otp" → "complete"
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState(null);
  const [otp, setOtp] = useState("");

  const password = watch("password");

  // Step 1: Validate form and send OTP
  const onSubmitForm = async (data) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Request OTP
      await axios.post(`${API_URI}/auth/send-otp`, {
        email: data.email,
      });

      // Save form data in memory (NOT in browser navigation state)
      setFormData({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setStep("otp");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and create account in one server call
  const handleVerifyAndRegister = async () => {
    if (otp.length !== 6) {
      setErrorMessage("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Verify OTP — get back the token
      const verifyRes = await axios.post(`${API_URI}/auth/verify-otp`, {
        email: formData.email,
        otp,
      });

      const otpToken = verifyRes.data.otpToken;

      // Register with OTP token — backend validates the token again
      const registerRes = await axios.post(
        `${API_URI}/auth/sign-up`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          otpToken,
        },
        { withCredentials: true }
      );

      if (registerRes.data.user) {
        // Update auth context and redirect
        await login(registerRes.data.user);

        // Clear sensitive data from memory
        setFormData(null);
        setOtp("");

        navigate("/", { replace: true });
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await axios.post(`${API_URI}/auth/send-otp`, {
        email: formData.email,
      });
      setErrorMessage(""); // Clear any previous error
      alert("New OTP sent to your email");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to resend OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URI}/auth/google`;
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
        {isLoading && <Loader size={40} />}

        <motion.img
          src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1720874424/dx22aboggirzfutgulei.jpg"
          alt="Top Image"
          className="mb-4 rounded-lg w-20 h-20 mx-auto"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />

        <h2 className="text-2xl font-bold text-center text-slate-50 mb-4">
          {step === "otp" ? "Verify Email" : "Sign Up"}
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

        {/* ─── Step 1: Registration Form ────────────────────────── */}
        {step === "form" && (
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <input
                id="name"
                type="text"
                placeholder="Name"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 50, message: "Name must be less than 50 characters" },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                placeholder="Password (min 6 characters)"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
                style={{ paddingRight: "40px" }}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
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

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
                style={{ paddingRight: "40px" }}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords don't match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Sign Up"}
            </motion.button>
          </form>
        )}

        {/* ─── Step 2: OTP Verification ─────────────────────────── */}
        {step === "otp" && (
          <div className="space-y-4">
            <p className="text-center text-gray-300 text-sm">
              Enter the OTP sent to{" "}
              <span className="text-orange-400 font-medium">
                {formData?.email}
              </span>
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full px-3 py-2 border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(val);
              }}
              maxLength={6}
            />

            <motion.button
              onClick={handleVerifyAndRegister}
              className="w-full py-2 px-4 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Create Account"}
            </motion.button>

            <div className="flex justify-between items-center text-sm">
              <button
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setErrorMessage("");
                }}
                className="text-gray-400 hover:text-gray-200"
              >
                ← Back
              </button>
              <button
                onClick={handleResendOTP}
                className="text-orange-400 hover:underline"
                disabled={isLoading}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* ─── Divider & Google ──────────────────────────────────── */}
        {step === "form" && (
          <>
            <div className="flex items-center my-3">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-gray-500">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <button
              onClick={handleGoogleSignup}
              className="w-full py-2 px-4 flex items-center justify-center border text-slate-50 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FcGoogle className="mr-2" size={20} />
              Sign Up with Google
            </button>
          </>
        )}

        <div className="mt-4 text-center">
          <p className="text-slate-50">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 hover:underline">
              Login
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

export default Signup;
