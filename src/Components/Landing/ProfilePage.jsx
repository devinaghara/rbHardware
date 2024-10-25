import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBoxOpen, FaHeart, FaAddressCard, FaCog, FaSignOutAlt, FaCamera, FaHome } from 'react-icons/fa';
import AddressManagement from '../Address/AddressManagement';
import OrderPage from '../Orders/OrderPage';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234-567-8900',
        avatar: '/api/placeholder/150/150',
    });
    const [orders, setOrders] = useState([
        {
            id: '1',
            date: '2024-03-15',
            total: 299.99,
            status: 'Delivered',
            items: [
                { name: 'Gaming Laptop', quantity: 1, price: 299.99 }
            ]
        },
        {
            id: '2',
            date: '2024-03-10',
            total: 159.98,
            status: 'In Transit',
            items: [
                { name: 'Mechanical Keyboard', quantity: 2, price: 79.99 }
            ]
        }
    ]);
    const [wishlist, setWishlist] = useState([
        {
            id: 1,
            name: 'Wireless Mouse',
            price: 49.99,
            image: '/api/placeholder/100/100',
            inStock: true
        },
        {
            id: 2,
            name: 'Gaming Monitor',
            price: 399.99,
            image: '/api/placeholder/100/100',
            inStock: false
        }
    ]);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:8000/auth/logout', { withCredentials: true });
            navigate("/login");
            console.log('User logged out');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const renderProfile = () => (
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
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
            <form className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">Full Name</label>
                    <input 
                        type="text" 
                        value={userData.name}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">Email</label>
                    <input 
                        type="email" 
                        value={userData.email}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">Phone</label>
                    <input 
                        type="tel" 
                        value={userData.phone}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );

    const renderOrders = () => (
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-orange-500 mb-4">Order History</h3>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-white font-semibold">Order #{order.id}</span>
                                    <span className={`text-sm px-2 py-1 rounded ${
                                        order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                                <div className="mt-2 space-y-1">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="text-gray-300">
                                            {item.quantity}x {item.name} - ${item.price}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-orange-500 font-bold">${order.total}</p>
                                <button className="mt-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition duration-300">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // const renderWishlist = () => (
    //     <div className="bg-gray-800 rounded-lg p-6">
    //         <h3 className="text-xl font-bold text-orange-500 mb-4">My Wishlist</h3>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             {wishlist.map((item) => (
    //                 <div key={item.id} className="border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition duration-300">
    //                     <div className="flex space-x-4">
    //                         <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
    //                         <div className="flex-1">
    //                             <h4 className="text-white font-semibold">{item.name}</h4>
    //                             <p className="text-orange-500 font-bold">${item.price}</p>
    //                             <p className={`text-sm ${item.inStock ? 'text-green-500' : 'text-red-500'}`}>
    //                                 {item.inStock ? 'In Stock' : 'Out of Stock'}
    //                             </p>
    //                             <div className="mt-2 space-x-2">
    //                                 <button 
    //                                     className={`px-4 py-2 rounded-md ${
    //                                         item.inStock 
    //                                             ? 'bg-orange-500 hover:bg-orange-600 text-white' 
    //                                             : 'bg-gray-600 text-gray-400 cursor-not-allowed'
    //                                     } transition duration-300`}
    //                                     disabled={!item.inStock}
    //                                 >
    //                                     Add to Cart
    //                                 </button>
    //                                 <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition duration-300">
    //                                     Remove
    //                                 </button>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );

    const renderSettings = () => (
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-bold text-orange-500 mb-4">Account Settings</h3>
            <div className="space-y-4">
                <div className="p-4 border border-gray-700 rounded-lg space-y-4">
                    <div>
                        <h4 className="text-white font-semibold">Change Password</h4>
                        <p className="text-gray-400 mb-4">Update your account password</p>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Current Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div>
                        <h4 className="text-white font-semibold">Delete Account</h4>
                        <p className="text-gray-400">Permanently remove your account and data</p>
                    </div>
                    <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition duration-300">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfile();
            case 'orders':
                return <OrderPage/>;
            // case 'orders':
            //     return renderOrders();
            // case 'wishlist':
            //     return renderWishlist();
            case 'addresses':
                return <AddressManagement />;
            case 'settings':
                return renderSettings();
            default:
                return null;
        }
    };

    const navItems = [
        { id: 'home', icon: FaHome, label: 'Home', onClick: handleHomeClick },
        { id: 'profile', icon: FaUser, label: 'Profile' },
        { id: 'orders', icon: FaBoxOpen, label: 'Orders' },
        // { id: 'wishlist', icon: FaHeart, label: 'Wishlist' },
        { id: 'addresses', icon: FaAddressCard, label: 'Addresses' },
        { id: 'settings', icon: FaCog, label: 'Settings' },
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
                                        className={`w-full flex items-center space-x-2 p-3 rounded-lg transition duration-300 ${
                                            activeTab === item.id && !item.onClick
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