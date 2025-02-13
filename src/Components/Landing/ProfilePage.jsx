import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaBoxOpen, FaAddressCard, FaCog, FaSignOutAlt, FaCamera, FaHome, FaEdit } from 'react-icons/fa';
import AddressManagement from '../Address/AddressManagement';
import OrderPage from '../Orders/OrderPage';
import { API_URI } from '../../../config';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '/api/placeholder/150/150',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URI}/auth/get-profile`, {
                withCredentials: true
            });
            const user = response.data.user;
            const userInfo = {
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                avatar: '/api/placeholder/150/150'
            };
            setUserData(userInfo);
            setFormData(userInfo);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch user data');
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_URI}/auth/update-profile`, formData, {
                withCredentials: true
            });

            if (response.data.success) {
                setUserData({
                    ...userData,
                    ...formData
                });
                setUpdateSuccess(true);
                setIsEditMode(false);
                setTimeout(() => setUpdateSuccess(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleCancelEdit = () => {
        setFormData(userData);
        setIsEditMode(false);
        setError(null);
    };

    const handleLogout = async () => {
        try {
            await axios.get(`${API_URI}/auth/logout`, { withCredentials: true });
            navigate("/login");
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const renderProfile = () => (
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            {isLoading ? (
                <div className="text-center text-white">Loading...</div>
            ) : (
                <>
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                            <img
                                src={userData.avatar}
                                alt="Profile"
                                className="w-32 h-32 rounded-full mb-4 border-4 border-orange-500"
                            />
                            <button className="absolute bottom-4 right-0 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition duration-300">
                                <FaCamera className="text-white" />
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-orange-500">{userData.name}</h2>
                        <p className="text-gray-400">{userData.email}</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 text-red-500 p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {updateSuccess && (
                        <div className="bg-green-500/20 text-green-500 p-3 rounded-md mb-4">
                            Profile updated successfully!
                        </div>
                    )}

                    {!isEditMode ? (
                        <div className="space-y-4">
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                                    <button
                                        onClick={() => setIsEditMode(true)}
                                        className="flex items-center space-x-2 text-orange-500 hover:text-orange-400"
                                    >
                                        <FaEdit className='text-lg' />
                                        <span className='text-lg'>Edit Profile</span>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm text-gray-400">Full Name</label>
                                        <p className="text-white">{userData.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400">Email</label>
                                        <p className="text-white">{userData.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400">Phone</label>
                                        <p className="text-white">{userData.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-200">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-200">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-200">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </>
            )}
        </div>
    );

    // Rest of the code remains the same...
    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfile();
            case 'orders':
                return <OrderPage />;
            case 'addresses':
                return <AddressManagement />;
            // case 'settings':
            //     return renderSettings();
            default:
                return null;
        }
    };

    const navItems = [
        { id: 'home', icon: FaHome, label: 'Home', onClick: handleHomeClick },
        { id: 'profile', icon: FaUser, label: 'Profile' },
        { id: 'orders', icon: FaBoxOpen, label: 'Orders' },
        { id: 'addresses', icon: FaAddressCard, label: 'Addresses' },
        // { id: 'settings', icon: FaCog, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <nav className="space-y-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={item.onClick || (() => setActiveTab(item.id))}
                                        className={`w-full flex items-center space-x-2 p-3 rounded-lg transition duration-300 ${activeTab === item.id && !item.onClick
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-2 p-3 rounded-lg text-red-500 hover:bg-gray-700 transition duration-300"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;