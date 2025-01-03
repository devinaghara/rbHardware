// ResetPassword.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URI } from '../../../config';

const ResetPassword = () => {
    const { token } = useParams();
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post(`${API_URI}/auth/reset-password`, {
                token,
                newPassword: data.newPassword
            });
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.error || 'Password reset failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-sport-bg bg-cover bg-center">
            <motion.div
                className="bg-black bg-opacity-90 p-6 rounded-lg shadow-2xl w-80"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold text-center text-slate-50 mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-3 py-2 border rounded-lg"
                        {...register('newPassword', { required: true })}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-3 py-2 border rounded-lg"
                        {...register('confirmPassword', { required: true })}
                    />
                    <motion.button
                        type="submit"
                        className="w-full py-2 px-4 bg-orange-600 text-white rounded-lg"
                        whileHover={{ scale: 1.05 }}
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