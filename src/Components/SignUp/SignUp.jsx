// Signup.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { API_URI } from '../../../config';

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        setIsLoading(true);
        try {
            // Request OTP first
            await axios.post(`${API_URI}/auth/send-otp`, {
                email: data.email
            });

            // Navigate to OTP verification with user data
            navigate('/verify-otp', {
                state: {
                    name: data.name,
                    email: data.email,
                    password: data.password
                }
            });
        } catch (error) {
            alert(error.response?.data?.error || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        // Add your Google signup logic here
        console.log('Google signup');
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

                {/* Updated Image Transition */}
                <motion.img
                    src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1720874424/dx22aboggirzfutgulei.jpg"
                    alt="Top Image"
                    className="mb-4 rounded-lg w-20 h-20 mx-auto"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />

                <h2 className="text-2xl font-bold text-center text-slate-50 mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`}
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`}
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`}
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`}
                            {...register('confirmPassword', { required: 'Please confirm your password' })}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full py-2 px-4 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign Up
                    </motion.button>
                </form>

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

                <div className="mt-4 text-center">
                    <p className="text-slate-50">
                        Already have an account? <Link to="/login" className="text-orange-600 hover:underline">Login</Link>
                    </p>
                    <p className="mt-2">
                        <Link to="/" className="text-slate-50 hover:underline">Go to Home Page</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
