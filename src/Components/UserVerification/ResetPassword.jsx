import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { API_URI } from '../../../config';

const ResetPassword = () => {
    const { token } = useParams();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const password = watch('newPassword');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            await axios.post(`${API_URI}/auth/reset-password`, {
                token,
                newPassword: data.newPassword
            });
            setSuccess(true);
            setTimeout(() => navigate('/login', { replace: true }), 3000);
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Password reset failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-sport-bg bg-cover bg-center">
                <motion.div
                    className="bg-black bg-opacity-90 p-6 rounded-lg shadow-2xl w-80 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="text-green-400 text-5xl mb-4">✓</div>
                    <h2 className="text-xl font-bold text-slate-50 mb-2">Password Reset Successful</h2>
                    <p className="text-gray-300 text-sm">Redirecting to login...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-sport-bg bg-cover bg-center">
            <motion.div
                className="bg-black bg-opacity-90 p-6 rounded-lg shadow-2xl w-80"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold text-center text-slate-50 mb-4">Reset Password</h2>

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
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password (min 6 characters)"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.newPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-orange-500'
                                }`}
                            style={{ paddingRight: "40px" }}
                            {...register('newPassword', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
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
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-400">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div style={{ position: "relative" }}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-orange-500'
                                }`}
                            style={{ paddingRight: "40px" }}
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
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
                                padding: "4px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#9ca3af",
                                lineHeight: 1,
                            }}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full py-2 px-4 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-500 disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;