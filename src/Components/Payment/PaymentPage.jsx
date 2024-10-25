import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaPaypal, FaGooglePay, FaApplePay, FaLock } from 'react-icons/fa';
import Navbar from '../Landing/Navbar';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
        { id: 'credit-card', name: 'Credit Card', icon: FaCreditCard },
        { id: 'paypal', name: 'PayPal', icon: FaPaypal },
        { id: 'google-pay', name: 'Google Pay', icon: FaGooglePay },
        { id: 'apple-pay', name: 'Apple Pay', icon: FaApplePay },
    ];

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            navigate('/order-confirmation'); // You'll need to create this page
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="container mx-auto px-4 py-12 mt-10">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-500">Payment Method</h1>

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
                            disabled={!selectedMethod || isProcessing}
                            className={`flex items-center px-6 py-3 rounded-full transition-all ${selectedMethod && !isProcessing
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