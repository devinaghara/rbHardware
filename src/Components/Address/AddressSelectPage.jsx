import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../Landing/Navbar';
import { API_URI } from '../../../config'; // Assuming you have this config file

const AddressSelectPage = () => {
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        type: 'Home',
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
    });

    // Fetch addresses from API
    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URI}/api/addresses/getaddress`, { withCredentials: true });
            setAddresses(response.data.addresses);
            
            // Auto-select default address if available
            const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress._id);
            }
            
            setError(null);
        } catch (err) {
            setError('Failed to load addresses. Please try again.');
            console.error('Error fetching addresses:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddressSelect = (addressId) => {
        setSelectedAddress(addressId);
    };

    const handleContinue = () => {
        if (selectedAddress) {
            // You might want to store selected address in localStorage/context
            localStorage.setItem('selectedAddressId', selectedAddress);
            navigate('/payment');
        }
    };

    const handleAddNewAddress = () => {
        setEditingAddress(null);
        setNewAddress({
            type: 'Home',
            name: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            isDefault: false
        });
        setIsAddingAddress(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            let response;

            if (editingAddress) {
                response = await axios.put(
                    `${API_URI}/api/addresses/${editingAddress._id}`,
                    newAddress,
                    { withCredentials: true }
                );
            } else {
                response = await axios.post(
                    `${API_URI}/api/addresses/add`,
                    newAddress,
                    { withCredentials: true }
                );
            }

            // Fetch updated addresses after successful operation
            await fetchAddresses();

            setIsAddingAddress(false);
            setEditingAddress(null);
            setNewAddress({
                type: 'Home',
                name: '',
                phone: '',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                isDefault: false
            });
        } catch (err) {
            setError(`Failed to ${editingAddress ? 'update' : 'add'} address. Please try again.`);
            console.error(`Error ${editingAddress ? 'updating' : 'adding'} address:`, err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="container mx-auto px-4 py-12 mt-10">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-500">Select Delivery Address</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-3xl mx-auto mb-6">
                        <p>{error}</p>
                    </div>
                )}
                
                <div className="max-w-3xl mx-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="text-orange-500 text-xl">Loading addresses...</div>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
                            <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                            <button
                                onClick={handleAddNewAddress}
                                className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all"
                            >
                                <FaPlus className="inline mr-2" /> Add Your First Address
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {addresses.map((address) => (
                                <div 
                                    key={address._id}
                                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                                        selectedAddress === address._id 
                                        ? 'border-orange-500 bg-orange-50' 
                                        : 'border-gray-200 hover:border-orange-300'
                                    }`}
                                    onClick={() => handleAddressSelect(address._id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-xl font-bold text-gray-800">{address.name}</h3>
                                                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                    {address.type}
                                                </span>
                                                {address.isDefault && (
                                                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mt-2">{address.street}</p>
                                            <p className="text-gray-600">{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                                            <p className="text-gray-600 mt-2">{address.phone}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className={`w-6 h-6 rounded-full border-2 ${
                                                selectedAddress === address._id 
                                                ? 'border-orange-500 bg-orange-500' 
                                                : 'border-gray-300'
                                            }`}>
                                                {selectedAddress === address._id && (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button 
                                onClick={handleAddNewAddress}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-300 transition-all"
                            >
                                <div className="flex items-center justify-center space-x-2 text-gray-500">
                                    <FaPlus />
                                    <span>Add New Address</span>
                                </div>
                            </button>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center px-6 py-3 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-all"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Cart
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={!selectedAddress || addresses.length === 0}
                            className={`flex items-center px-6 py-3 rounded-full transition-all ${
                                selectedAddress && addresses.length > 0
                                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Continue to Payment <FaArrowRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Address Modal */}
            {isAddingAddress && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsAddingAddress(false);
                                    setEditingAddress(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={newAddress.type}
                                        onChange={e => setNewAddress({ ...newAddress, type: e.target.value })}
                                    >
                                        <option>Home</option>
                                        <option>Office</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={newAddress.name}
                                        onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={newAddress.phone}
                                    onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={newAddress.street}
                                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={newAddress.state}
                                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={newAddress.zipCode}
                                        onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={newAddress.isDefault}
                                    onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    Set as default address
                                </label>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingAddress(false);
                                        setEditingAddress(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                                >
                                    {isLoading ? 'Processing...' : (editingAddress ? 'Save Changes' : 'Add Address')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressSelectPage;