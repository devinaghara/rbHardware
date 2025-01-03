import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URI } from '../../../config';
import { useAuth } from '../Contexts/AuthContext';

const OTPVerification = () => {
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Get user data from location state
    const userData = location.state || {};

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            // Step 1: Verify OTP
            const verifyResponse = await axios.post(`${API_URI}/auth/verify-otp`, {
                email: userData.email,
                otp: data.otp
            });

            if (verifyResponse.data.message === "OTP verified successfully") {
                try {
                    // Step 2: Register User
                    const registerResponse = await axios.post(`${API_URI}/auth/sign-up`, {
                        name: userData.name,
                        email: userData.email,
                        password: userData.password
                    });

                    if (registerResponse.data.user) {
                        // Step 3: Login User
                        const loginResponse = await axios.post(
                            `${API_URI}/auth/login`,
                            {
                                email: userData.email,
                                password: userData.password
                            },
                            { withCredentials: true }
                        );

                        if (loginResponse.data.user) {
                            // Update auth context with user data
                            await login(loginResponse.data.user);
                            // Redirect to home page
                            navigate('/', { replace: true });
                        }
                    }
                } catch (registrationError) {
                    console.error('Registration error:', registrationError);
                    setError(registrationError.response?.data?.message || 'Failed to register user');
                }
            }
        } catch (error) {
            console.error('Verification error:', error);
            setError(error.response?.data?.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const resendOTP = async () => {
        try {
            await axios.post(`${API_URI}/auth/send-otp`, {
                email: userData.email
            });
            alert('New OTP sent to your email');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-sport-bg bg-cover bg-center">
            <motion.div
                className="bg-black bg-opacity-90 p-6 rounded-lg shadow-2xl w-80"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold text-center text-slate-50 mb-4">Verify OTP</h2>
                <p className="text-center mb-4 text-slate-50">
                    Enter the OTP sent to {userData.email}
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full px-3 py-2 border rounded-lg"
                        {...register('otp', { required: true })}
                        maxLength={6}
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <motion.button
                        type="submit"
                        className="w-full py-2 px-4 bg-orange-600 text-white rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </motion.button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={resendOTP}
                        className="text-orange-600 hover:underline"
                    >
                        Resend OTP
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OTPVerification;