import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../Redux/actions/cartActions';
import { FaArrowLeft, FaCreditCard, FaPaypal, FaGooglePay, FaApplePay, FaLock } from 'react-icons/fa';
import Navbar from '../Landing/Navbar';
import axios from 'axios';
import { API_URI } from '../../../config';

const PaymentPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const totalAmount = useSelector(state => state.cart.totalAmount);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isLoadingAddress, setIsLoadingAddress] = useState(true);

    const paymentMethods = [
        { id: 'credit-card', name: 'Credit Card', icon: FaCreditCard },
        { id: 'paypal', name: 'PayPal', icon: FaPaypal },
        { id: 'google-pay', name: 'Google Pay', icon: FaGooglePay },
        { id: 'apple-pay', name: 'Apple Pay', icon: FaApplePay },
    ];

    // Fetch the selected address on component mount
    useEffect(() => {
        const fetchSelectedAddress = async () => {
            try {
                setIsLoadingAddress(true);
                const selectedAddressId = localStorage.getItem('selectedAddressId');
                
                if (!selectedAddressId) {
                    // If no address is selected, redirect back to address page
                    navigate('/address');
                    return;
                }
                
                // Fetch all addresses and find the selected one
                const response = await axios.get(`${API_URI}/api/addresses/getaddress`, { 
                    withCredentials: true 
                });
                
                if (response.data && response.data.addresses) {
                    const address = response.data.addresses.find(addr => addr._id === selectedAddressId);
                    
                    if (address) {
                        setSelectedAddress(address);
                    } else {
                        throw new Error('Selected address not found');
                    }
                } else {
                    throw new Error('Failed to load addresses');
                }
            } catch (err) {
                console.error('Error fetching selected address:', err);
                setError('Failed to load delivery address. Please go back and select an address again.');
            } finally {
                setIsLoadingAddress(false);
            }
        };

        fetchSelectedAddress();
    }, [navigate]);

    // Prepare order data for API request
    const prepareOrderData = () => {
        const paymentMethodName = selectedMethod === 'credit-card'
            ? "Credit Card (**** 1234)"
            : paymentMethods.find(method => method.id === selectedMethod)?.name;

        // Make sure we have a selected address
        if (!selectedAddress) {
            throw new Error('No delivery address selected');
        }

        return {
            items: cartItems.map(item => ({
                productId: item._id || item.id, // Try both possible field names
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.images && item.images.length > 0 ? item.images[0] : null,
                color: item.color || null,
                size: item.size || null
            })),
            shippingAddress: {
                type: selectedAddress.type,
                name: selectedAddress.name,
                phone: selectedAddress.phone,
                street: selectedAddress.street,
                city: selectedAddress.city,
                state: selectedAddress.state,
                zipCode: selectedAddress.zipCode,
                isDefault: selectedAddress.isDefault
            },
            paymentMethod: paymentMethodName,
            paymentDetails: {
                id: null,
                status: "Pending",
                method: paymentMethodName
            },
            total: totalAmount,
            notes: "Order placed via website"
        };
    };

    const handlePaymentSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsProcessing(true);
        setError(null);
        
        try {
            // Check if we have an address
            if (!selectedAddress) {
                throw new Error('Please select a delivery address first');
            }
            
            // Debug your cart items first
            console.log("Cart items before order:", cartItems);
            
            // Make API request to create order
            const orderData = prepareOrderData();
            console.log("Sending order data:", orderData);
            
            const response = await axios.post(`${API_URI}/order/create`, orderData, {
                withCredentials: true
            });
            
            if (response.data.success) {
                dispatch(clearCart());
                navigate('/order');
            } else {
                throw new Error(response.data.message || 'Failed to create order');
            }
        } catch (err) {
            console.error('Order creation failed:', err);
            setError(err.response?.data?.message || err.message || 'An error occurred during payment processing');
        } finally {
            setIsProcessing(false);
        }
    };

    // Show loading state when fetching the address
    if (isLoadingAddress) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="container mx-auto px-4 py-12 mt-10">
                    <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-500">Payment Method</h1>
                    <div className="flex justify-center items-center h-40">
                        <div className="text-orange-500 text-xl">Loading delivery address...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="container mx-auto px-4 py-12 mt-10">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-500">Payment Method</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {selectedAddress && (
                    <div className="max-w-3xl mx-auto mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h2 className="font-bold text-lg mb-2">Delivery Address:</h2>
                        <div className="text-gray-700">
                            <p className="font-medium">{selectedAddress.name} ({selectedAddress.type})</p>
                            <p>{selectedAddress.street}</p>
                            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                            <p className="mt-1">Phone: {selectedAddress.phone}</p>
                        </div>
                    </div>
                )}

                <div className="max-w-3xl mx-auto">
                    <div className="grid gap-6">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedMethod === method.id
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-orange-300'
                                    }`}
                                onClick={() => setSelectedMethod(method.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <method.icon className="text-2xl text-gray-600" />
                                        <span className="text-lg font-semibold text-gray-800">{method.name}</span>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 ${selectedMethod === method.id
                                        ? 'border-orange-500 bg-orange-500'
                                        : 'border-gray-300'
                                        }`}>
                                        {selectedMethod === method.id && (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedMethod === 'credit-card' && (
                        <form onSubmit={handlePaymentSubmit} className="mt-8 space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2">Card Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="1234 5678 9012 3456"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">Expiry Date</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="MM/YY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">CVV</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="123"
                                    />
                                </div>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => navigate('/address')}
                            className="flex items-center px-6 py-3 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-all"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Address
                        </button>
                        <button
                            onClick={handlePaymentSubmit}
                            disabled={!selectedMethod || isProcessing || !selectedAddress}
                            className={`flex items-center px-6 py-3 rounded-full transition-all ${selectedMethod && !isProcessing && selectedAddress
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {isProcessing ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <FaLock className="mr-2" /> Pay Now
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 text-center text-gray-500 flex items-center justify-center">
                        <FaLock className="mr-2" />
                        <span>Your payment information is secure and encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;