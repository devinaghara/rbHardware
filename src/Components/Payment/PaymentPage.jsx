import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../Redux/actions/cartActions';
import {
    FaArrowLeft,
    FaCreditCard,
    FaLock,
    FaShieldAlt,
    FaCheckCircle,
} from 'react-icons/fa';
import Navbar from '../Landing/Navbar';
import axios from 'axios';
import { API_URI } from '../../../config';

const PAYMENT_STEPS = {
    SELECT_METHOD: 'SELECT_METHOD',
    CARD_DETAILS: 'CARD_DETAILS',
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
};

const PaymentPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(PAYMENT_STEPS.SELECT_METHOD);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [error, setError] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isLoadingAddress, setIsLoadingAddress] = useState(true);
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const [orderAmount, setOrderAmount] = useState(0);
    const [createdOrder, setCreatedOrder] = useState(null);

    // Card form state (fake — pre-filled for demo)
    const [cardForm, setCardForm] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
    });

    const paymentMethods = [
        { id: 'card', name: 'Credit / Debit Card', icon: FaCreditCard, description: 'Pay securely with your card' },
        { id: 'upi', name: 'UPI Payment', icon: FaShieldAlt, description: 'GPay, PhonePe, Paytm UPI' },
        { id: 'cod', name: 'Cash on Delivery', icon: FaLock, description: 'Pay when you receive the order' },
    ];

    // Fetch the selected address on component mount
    useEffect(() => {
        const fetchSelectedAddress = async () => {
            try {
                setIsLoadingAddress(true);
                const selectedAddressId = localStorage.getItem('selectedAddressId');

                if (!selectedAddressId) {
                    navigate('/address');
                    return;
                }

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

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').substring(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    // Format expiry as MM/YY
    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').substring(0, 4);
        if (digits.length > 2) {
            return digits.substring(0, 2) + '/' + digits.substring(2);
        }
        return digits;
    };

    const handleCardInput = (field, value) => {
        let formatted = value;
        if (field === 'number') formatted = formatCardNumber(value);
        if (field === 'expiry') formatted = formatExpiry(value);
        if (field === 'cvv') formatted = value.replace(/\D/g, '').substring(0, 4);
        if (field === 'name') formatted = value.toUpperCase();
        setCardForm(prev => ({ ...prev, [field]: formatted }));
    };

    const isCardFormValid = () => {
        return (
            cardForm.number.replace(/\s/g, '').length >= 13 &&
            cardForm.name.trim().length >= 2 &&
            cardForm.expiry.length === 5 &&
            cardForm.cvv.length >= 3
        );
    };

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        setError(null);
    };

    const handleProceedToCard = () => {
        if (selectedMethod === 'card') {
            setStep(PAYMENT_STEPS.CARD_DETAILS);
        } else {
            // For UPI / COD — skip card form, go directly to processing
            handlePayment();
        }
    };

    const handlePayment = async () => {
        setStep(PAYMENT_STEPS.PROCESSING);
        setError(null);

        try {
            if (!selectedAddress) {
                throw new Error('Please select a delivery address first');
            }

            // Step 1: Create payment intent (server calculates amount)
            const intentResponse = await axios.post(
                `${API_URI}/api/payment/create-intent`,
                {},
                { withCredentials: true }
            );

            if (!intentResponse.data.success) {
                throw new Error(intentResponse.data.message || 'Failed to initialize payment');
            }

            const { paymentIntentId: piId, amount } = intentResponse.data;
            setPaymentIntentId(piId);
            setOrderAmount(amount);

            // Step 2: Confirm payment  (fake — always succeeds)
            const confirmResponse = await axios.post(
                `${API_URI}/api/payment/confirm`,
                { paymentIntentId: piId },
                { withCredentials: true }
            );

            if (!confirmResponse.data.success) {
                throw new Error(confirmResponse.data.message || 'Payment confirmation failed');
            }

            // Step 3: Create the order
            const paymentMethodName = selectedMethod === 'card'
                ? `Card (****${cardForm.number.replace(/\s/g, '').slice(-4) || '0000'})`
                : selectedMethod === 'upi'
                    ? 'UPI Payment'
                    : 'Cash on Delivery';

            const orderData = {
                shippingAddress: {
                    type: selectedAddress.type,
                    name: selectedAddress.name,
                    phone: selectedAddress.phone,
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    zipCode: selectedAddress.zipCode,
                    isDefault: selectedAddress.isDefault,
                },
                paymentMethod: paymentMethodName,
                paymentIntentId: piId,
                paymentDetails: {
                    id: piId,
                    status: 'Paid',
                    method: paymentMethodName,
                },
                notes: 'Order placed via website',
            };

            const orderResponse = await axios.post(`${API_URI}/order/create`, orderData, {
                withCredentials: true,
            });

            if (orderResponse.data.success) {
                setCreatedOrder(orderResponse.data.order);
                dispatch(clearCart());
                setStep(PAYMENT_STEPS.SUCCESS);
            } else {
                throw new Error(orderResponse.data.message || 'Failed to create order');
            }
        } catch (err) {
            console.error('Payment flow error:', err);
            setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
            setStep(PAYMENT_STEPS.SELECT_METHOD);
        }
    };

    // Loading state
    if (isLoadingAddress) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7]">
                <Navbar />
                <div className="container mx-auto px-4 py-20 mt-10">
                    <div className="flex justify-center items-center h-40">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-gray-600 font-medium">Loading delivery address...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (step === PAYMENT_STEPS.SUCCESS && createdOrder) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7]">
                <Navbar />
                <div className="container mx-auto px-4 py-20 mt-10 max-w-2xl">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
                        {/* Animated checkmark */}
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <FaCheckCircle className="text-green-500 text-5xl" />
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
                        <p className="text-gray-500 mb-6">Your order has been successfully placed and is being processed.</p>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Order ID</span>
                                <span className="font-bold text-gray-900">{createdOrder.orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Amount</span>
                                <span className="font-bold text-orange-500">₹{createdOrder.total?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment</span>
                                <span className="font-medium text-green-600">✓ {createdOrder.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Items</span>
                                <span className="font-medium">{createdOrder.items?.length} item(s)</span>
                            </div>
                            {createdOrder.estimatedDelivery && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Expected Delivery</span>
                                    <span className="font-medium">
                                        {new Date(createdOrder.estimatedDelivery).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/order')}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold rounded-full shadow-lg hover:scale-105 transition"
                            >
                                View My Orders
                            </button>
                            <button
                                onClick={() => navigate('/product')}
                                className="flex-1 px-6 py-3 border-2 border-orange-500 text-orange-500 font-bold rounded-full hover:bg-orange-50 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Processing state
    if (step === PAYMENT_STEPS.PROCESSING) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7]">
                <Navbar />
                <div className="container mx-auto px-4 py-20 mt-10 max-w-lg">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                        <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
                        <p className="text-gray-500">Please wait while we securely process your payment...</p>
                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
                            <FaLock />
                            <span>256-bit SSL Encrypted</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7]">
            <Navbar />
            <div className="container mx-auto px-4 py-16 mt-10 max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-orange-500">
                    Secure Checkout
                </h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 max-w-3xl mx-auto flex items-start gap-3">
                        <span className="text-red-500 mt-0.5">⚠</span>
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Payment Method / Card Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address Summary */}
                        {selectedAddress && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="font-bold text-lg text-gray-900">Delivery Address</h2>
                                    <button
                                        onClick={() => navigate('/address')}
                                        className="text-orange-500 text-sm font-medium hover:underline"
                                    >
                                        Change
                                    </button>
                                </div>
                                <div className="text-gray-600 text-sm space-y-1">
                                    <p className="font-medium text-gray-800">{selectedAddress.name} ({selectedAddress.type})</p>
                                    <p>{selectedAddress.street}</p>
                                    <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                                    <p>Phone: {selectedAddress.phone}</p>
                                </div>
                            </div>
                        )}

                        {/* Method Selection */}
                        {step === PAYMENT_STEPS.SELECT_METHOD && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <h2 className="font-bold text-lg text-gray-900 mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                                                selectedMethod === method.id
                                                    ? 'border-orange-500 bg-orange-50 shadow-md'
                                                    : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                                            }`}
                                            onClick={() => handleMethodSelect(method.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                        selectedMethod === method.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        <method.icon className="text-xl" />
                                                    </div>
                                                    <div>
                                                        <span className="text-base font-semibold text-gray-800">{method.name}</span>
                                                        <p className="text-sm text-gray-400">{method.description}</p>
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                    selectedMethod === method.id
                                                        ? 'border-orange-500 bg-orange-500'
                                                        : 'border-gray-300'
                                                }`}>
                                                    {selectedMethod === method.id && (
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Card Details Form */}
                        {step === PAYMENT_STEPS.CARD_DETAILS && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-bold text-lg text-gray-900">Card Details</h2>
                                    <button
                                        onClick={() => setStep(PAYMENT_STEPS.SELECT_METHOD)}
                                        className="text-orange-500 text-sm font-medium hover:underline"
                                    >
                                        Change Method
                                    </button>
                                </div>

                                {/* Fake card visual */}
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 text-white">
                                    <div className="flex justify-between items-start mb-8">
                                        <FaCreditCard className="text-2xl opacity-80" />
                                        <span className="text-xs opacity-60 tracking-wider">VISA</span>
                                    </div>
                                    <p className="text-lg tracking-[0.25em] mb-4 font-mono">
                                        {cardForm.number || '•••• •••• •••• ••••'}
                                    </p>
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <p className="text-xs opacity-60">CARD HOLDER</p>
                                            <p className="font-medium">{cardForm.name || 'YOUR NAME'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs opacity-60">EXPIRES</p>
                                            <p className="font-medium">{cardForm.expiry || 'MM/YY'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                                        <input
                                            type="text"
                                            value={cardForm.number}
                                            onChange={(e) => handleCardInput('number', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-lg tracking-wider"
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Holder Name</label>
                                        <input
                                            type="text"
                                            value={cardForm.name}
                                            onChange={(e) => handleCardInput('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                            placeholder="JOHN DOE"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                                            <input
                                                type="text"
                                                value={cardForm.expiry}
                                                onChange={(e) => handleCardInput('expiry', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                                placeholder="MM/YY"
                                                maxLength={5}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                                            <input
                                                type="password"
                                                value={cardForm.cvv}
                                                onChange={(e) => handleCardInput('cvv', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                                placeholder="•••"
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-4 text-xs text-gray-400 flex items-center gap-1">
                                    <FaShieldAlt className="text-green-500" />
                                    This is a simulated payment. No real charges will be made.
                                </p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => {
                                    if (step === PAYMENT_STEPS.CARD_DETAILS) {
                                        setStep(PAYMENT_STEPS.SELECT_METHOD);
                                    } else {
                                        navigate('/address');
                                    }
                                }}
                                className="flex items-center px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition font-medium"
                            >
                                <FaArrowLeft className="mr-2" /> Back
                            </button>

                            {step === PAYMENT_STEPS.SELECT_METHOD && (
                                <button
                                    onClick={handleProceedToCard}
                                    disabled={!selectedMethod || !selectedAddress}
                                    className={`flex items-center px-8 py-3 rounded-full font-bold transition shadow-lg ${
                                        selectedMethod && selectedAddress
                                            ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:scale-105'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {selectedMethod === 'card' ? 'Enter Card Details' : 'Pay Now'}
                                </button>
                            )}

                            {step === PAYMENT_STEPS.CARD_DETAILS && (
                                <button
                                    onClick={handlePayment}
                                    disabled={!isCardFormValid()}
                                    className={`flex items-center px-8 py-3 rounded-full font-bold transition shadow-lg ${
                                        isCardFormValid()
                                            ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:scale-105'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <FaLock className="mr-2" /> Pay Now
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                            <h2 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h2>
                            <div className="text-center py-4 text-gray-400 text-sm">
                                Amount is calculated securely on the server from your cart items.
                            </div>
                            <div className="border-t pt-4 mt-2">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                    <FaLock className="text-green-500" />
                                    <span>Secured by 256-bit SSL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;