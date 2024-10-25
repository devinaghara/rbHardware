import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaShippingFast, FaCheckCircle, FaSpinner, FaTimes, FaCreditCard, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const OrderPage = () => {
    const [orders, setOrders] = useState([
        {
            id: "ORD123456",
            date: "2024-03-20",
            total: 599.98,
            status: "Delivered",
            items: [
                {
                    id: 1,
                    name: "Gaming Laptop",
                    price: 499.99,
                    quantity: 1,
                    image: "/api/placeholder/80/80"
                },
                {
                    id: 2,
                    name: "Gaming Mouse",
                    price: 99.99,
                    quantity: 1,
                    image: "/api/placeholder/80/80"
                }
            ],
            shippingAddress: {
                street: "123 Main St",
                city: "New York",
                state: "NY",
                zipCode: "10001"
            },
            paymentMethod: "Credit Card (**** 1234)"
        },
        {
            id: "ORD123457",
            date: "2024-03-15",
            total: 299.99,
            status: "In Transit",
            items: [
                {
                    id: 3,
                    name: "Mechanical Keyboard",
                    price: 299.99,
                    quantity: 1,
                    image: "/api/placeholder/80/80"
                }
            ],
            shippingAddress: {
                street: "123 Main St",
                city: "New York",
                state: "NY",
                zipCode: "10001"
            },
            paymentMethod: "PayPal"
        }
    ]);

    const [expandedOrder, setExpandedOrder] = useState(null);
    const navigate = useNavigate();

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return <FaCheckCircle size={24} />;
            case 'in transit':
                return <FaShippingFast size={24} />;
            case 'processing':
                return <FaSpinner size={24} className="animate-spin" />;
            case 'cancelled':
                return <FaTimes size={24} />;
            default:
                return <FaBox size={24} />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'from-green-500 to-emerald-500';
            case 'in transit':
                return 'from-orange-500 to-amber-500';
            case 'processing':
                return 'from-blue-500 to-cyan-500';
            case 'cancelled':
                return 'from-red-500 to-rose-500';
            default:
                return 'from-gray-500 to-slate-500';
        }
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black pt-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            Your Orders
                        </h1>
                        <p className="text-gray-400 mt-2">Track and manage your purchases</p>
                    </div>
                    <button 
                        onClick={() => navigate('/product')}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Continue Shopping
                    </button>
                </div>

                <div className="space-y-8">
                    {orders.map((order) => (
                        <div 
                            key={order.id} 
                            className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl"
                        >
                            {/* Status Bar */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getStatusStyle(order.status)} opacity-10 transform rotate-45 translate-x-16 -translate-y-16`} />
                            
                            {/* Header Section */}
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl font-bold text-white">{order.id}</span>
                                            <div className={`px-4 py-1 rounded-full bg-gradient-to-r ${getStatusStyle(order.status)} flex items-center space-x-2`}>
                                                {getStatusIcon(order.status)}
                                                <span className="font-medium text-white">{order.status}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-400">
                                            Ordered on {new Date(order.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                            ${order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Preview Section */}
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {order.items.slice(0, 2).map((item, index) => (
                                            <div key={item.id} className="relative">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-lg object-cover ring-2 ring-gray-700"
                                                />
                                                {index === 1 && order.items.length > 2 && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-medium">+{order.items.length - 2}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => toggleOrder(order.id)}
                                        className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors duration-300"
                                    >
                                        <span>{expandedOrder === order.id ? 'Show Less' : 'Show Details'}</span>
                                        {expandedOrder === order.id ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-gray-700 bg-gray-800/50 p-6 space-y-6">
                                    {/* Items */}
                                    <div className="grid gap-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4 bg-gray-700/30 p-4 rounded-xl">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-white">{item.name}</h3>
                                                    <p className="text-gray-400">Quantity: {item.quantity}</p>
                                                </div>
                                                <span className="text-lg font-bold text-orange-500">${item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping & Payment */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-700/30 p-4 rounded-xl">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <FaMapMarkerAlt className="text-orange-500" />
                                                <h4 className="text-lg font-medium text-white">Shipping Address</h4>
                                            </div>
                                            <p className="text-gray-400 leading-relaxed">
                                                {order.shippingAddress.street}<br />
                                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                            </p>
                                        </div>
                                        <div className="bg-gray-700/30 p-4 rounded-xl">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <FaCreditCard className="text-orange-500" />
                                                <h4 className="text-lg font-medium text-white">Payment Method</h4>
                                            </div>
                                            <p className="text-gray-400">{order.paymentMethod}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end space-x-4">
                                        <button className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300">
                                            Track Order
                                        </button>
                                        <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;