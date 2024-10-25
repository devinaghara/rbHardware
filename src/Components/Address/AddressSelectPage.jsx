import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa';
import Navbar from '../Landing/Navbar';

const AddressSelectPage = () => {
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState(null);
    
    // Mock addresses - in a real app, these would come from your backend
    const [addresses] = useState([
        {
            id: 1,
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            phone: '(555) 123-4567'
        },
        {
            id: 2,
            name: 'John Doe',
            street: '456 Park Ave',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '10002',
            phone: '(555) 987-6543'
        }
    ]);

    const handleAddressSelect = (addressId) => {
        setSelectedAddress(addressId);
    };

    const handleContinue = () => {
        if (selectedAddress) {
            navigate('/payment');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="container mx-auto px-4 py-12 mt-10">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-500">Select Delivery Address</h1>
                
                <div className="max-w-3xl mx-auto">
                    <div className="grid gap-6">
                        {addresses.map((address) => (
                            <div 
                                key={address.id}
                                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                                    selectedAddress === address.id 
                                    ? 'border-orange-500 bg-orange-50' 
                                    : 'border-gray-200 hover:border-orange-300'
                                }`}
                                onClick={() => handleAddressSelect(address.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{address.name}</h3>
                                        <p className="text-gray-600 mt-2">{address.street}</p>
                                        <p className="text-gray-600">{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                                        <p className="text-gray-600 mt-2">{address.phone}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-6 h-6 rounded-full border-2 ${
                                            selectedAddress === address.id 
                                            ? 'border-orange-500 bg-orange-500' 
                                            : 'border-gray-300'
                                        }`}>
                                            {selectedAddress === address.id && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-300 transition-all">
                            <div className="flex items-center justify-center space-x-2 text-gray-500">
                                <FaPlus />
                                <span>Add New Address</span>
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center px-6 py-3 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-all"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Cart
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={!selectedAddress}
                            className={`flex items-center px-6 py-3 rounded-full transition-all ${
                                selectedAddress 
                                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Continue to Payment <FaArrowRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressSelectPage;