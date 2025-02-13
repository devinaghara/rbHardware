import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { addItem, removeItem, updateQuantity } from '../../Redux/actions/cartActions';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Landing/Navbar';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.items);
    const totalAmount = useSelector(state => state.cart.totalAmount);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleIncreaseQuantity = (item) => {
        dispatch(updateQuantity(`${item.id}-${item.color}`, item.quantity + 1));
    };
    
    const handleDecreaseQuantity = (item) => {
        if (item.quantity > 1) {
            dispatch(updateQuantity(`${item.id}-${item.color}`, item.quantity - 1));
        } else {
            dispatch(updateQuantity(`${item.id}-${item.color}`, 0));
        }
    };
    
    const handleRemoveItem = (item) => {
        dispatch(updateQuantity(`${item.id}-${item.color}`, 0));
    };

    const handleProceedToPay = () => {
        navigate('/address');
    };

    const handleContinueShopping = () => {
        navigate('/product');
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="container mx-auto px-4 py-12 mt-10">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-500">Your Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-orange-500 border-opacity-20">
                        <div className="text-center">
                            <FaShoppingCart className="mx-auto text-8xl text-orange-400 mb-6" />
                            <p className="text-2xl mb-6 text-orange-300">Your cart is feeling a bit lonely</p>
                            <button 
                                onClick={handleContinueShopping}
                                className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                            >
                                Discover Amazing Products
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-black bg-opacity-90 backdrop-filter rounded-2xl overflow-hidden shadow-xl border border-orange-500 border-opacity-20">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.color}`} className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-orange-500 border-opacity-20 last:border-b-0">
                                        <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                                            <img src={item.images[0]} alt={item.name} className="w-28 h-28 object-cover rounded-lg shadow-md" />
                                            <div>
                                                <h2 className="text-xl font-bold text-orange-400">{item.name}</h2>
                                                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                                <p className="text-2xl font-extrabold mt-2 text-orange-500">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center space-x-2 bg-gray-700 rounded-full px-2 py-1 shadow-md">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(item)}
                                                    className="text-orange-400 hover:text-orange-300 focus:outline-none"
                                                >
                                                    <FaMinus className="h-4 w-4" />
                                                </button>
                                                <span className="text-lg font-bold w-8 text-center text-orange-300">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncreaseQuantity(item)}
                                                    className="text-orange-400 hover:text-orange-300 focus:outline-none"
                                                >
                                                    <FaPlus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item)}
                                                className="text-orange-500 hover:text-orange-400 focus:outline-none transition duration-300 transform hover:scale-110"
                                            >
                                                <FaTrash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="bg-black bg-opacity-90 backdrop-filter rounded-2xl p-8 shadow-xl border border-orange-500 border-opacity-20">
                                <h2 className="text-3xl font-extrabold mb-6 text-orange-500">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-300">Subtotal</span>
                                        <span className="font-bold text-orange-400">${totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-300">Shipping</span>
                                        <span className="font-bold text-green-400">Free</span>
                                    </div>
                                    <div className="border-t border-orange-500 border-opacity-20 pt-4 mt-4">
                                        <div className="flex justify-between text-xl font-extrabold">
                                            <span className="text-orange-400">Total</span>
                                            <span className="text-orange-500">${totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleProceedToPay}
                                    className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold py-4 px-4 rounded-full transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                                >
                                    Proceed to Checkout
                                </button>
                                <button
                                    onClick={handleContinueShopping}
                                    className="w-full mt-4 border border-orange-500 hover:bg-orange-500 hover:bg-opacity-20 text-orange-400 font-bold py-3 px-4 rounded-full transition duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                                >
                                    <FaArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;