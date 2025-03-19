import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaPencilAlt, FaTrash, FaStar, FaRegStar, FaTimes, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';
import { API_URI } from '../../../config';

const AddressManagement = () => {
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
            setError(null);
        } catch (err) {
            setError('Failed to load addresses. Please try again.');
            console.error('Error fetching addresses:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            setIsLoading(true);
            await axios.patch(`${API_URI}/api/addresses/${addressId}/set-default`, {}, { withCredentials: true });
            // Update local state to reflect the change
            setAddresses(addresses.map(addr => ({
                ...addr,
                isDefault: addr._id === addressId
            })));
        } catch (err) {
            setError('Failed to set default address. Please try again.');
            console.error('Error setting default address:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (addressId) => {
        try {
            setIsLoading(true);
            await axios.delete(`${API_URI}/api/addresses/${addressId}`, { withCredentials: true });
            setAddresses(addresses.filter(addr => addr._id !== addressId));
        } catch (err) {
            setError('Failed to delete address. Please try again.');
            console.error('Error deleting address:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setNewAddress(address);
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

    const getGradientByType = (type) => {
        switch (type.toLowerCase()) {
            case 'home':
                return 'from-purple-500/10 to-blue-500/10';
            case 'office':
                return 'from-orange-500/10 to-red-500/10';
            default:
                return 'from-green-500/10 to-teal-500/10';
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        Shipping Addresses
                    </h3>
                    <p className="text-gray-400 mt-1">Manage your delivery locations</p>
                </div>
                <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    <FaPlus className="mr-2" /> Add New Address
                </button>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-6">
                    <p>{error}</p>
                </div>
            )}

            {isLoading && addresses.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                    <div className="text-orange-500 text-xl">Loading addresses...</div>
                </div>
            ) : addresses.length === 0 ? (
                <div className="bg-gray-800/50 rounded-xl p-8 text-center">
                    <p className="text-gray-400 mb-4">You don't have any saved addresses yet.</p>
                    <button
                        onClick={() => setIsAddingAddress(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
                    >
                        <FaPlus className="mr-2" /> Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className={`bg-gradient-to-br ${getGradientByType(address.type)} border border-gray-700/50 rounded-xl p-6 hover:border-orange-500 transition-all duration-300 transform hover:scale-102 hover:shadow-xl`}
                        >
                            <div className="flex justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-white font-semibold">{address.type}</span>
                                        {address.isDefault && (
                                            <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-300">
                                        <FaUser className="text-gray-400" />
                                        <p>{address.name}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <FaPhone className="text-gray-400" />
                                        <p>{address.phone}</p>
                                    </div>
                                    <div className="flex items-start space-x-2 text-gray-400">
                                        <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                        <div>
                                            <p>{address.street}</p>
                                            <p>{address.city}, {address.state} {address.zipCode}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(address._id)}
                                            className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110"
                                            title="Set as default"
                                            disabled={isLoading}
                                        >
                                            <FaRegStar size={20} />
                                        </button>
                                    )}
                                    {address.isDefault && (
                                        <FaStar size={20} className="text-orange-500" />
                                    )}
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110"
                                        disabled={isLoading}
                                    >
                                        <FaPencilAlt size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address._id)}
                                        className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110"
                                        disabled={isLoading}
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isAddingAddress && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl transform transition-all duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsAddingAddress(false);
                                    setEditingAddress(null);
                                }}
                                className="text-gray-400 hover:text-white transition duration-300 transform hover:rotate-90"
                                disabled={isLoading}
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-200">Address Type</label>
                                    <select
                                        className="w-full bg-gray-700/50 text-white rounded-lg p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                                        value={newAddress.type}
                                        onChange={e => setNewAddress({ ...newAddress, type: e.target.value })}
                                        disabled={isLoading}
                                    >
                                        <option>Home</option>
                                        <option>Office</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-200">Full Name</label>
                                    <div className="relative">
                                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                                            value={newAddress.name}
                                            onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-200">Phone Number</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                                        value={newAddress.phone}
                                        onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-200">Street Address</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                                        value={newAddress.street}
                                        onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {['city', 'state', 'zipCode'].map((field) => (
                                    <div key={field} className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-200">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                                            value={newAddress[field]}
                                            onChange={e => setNewAddress({ ...newAddress, [field]: e.target.value })}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={newAddress.isDefault}
                                    onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-600 text-orange-500 focus:ring-orange-500"
                                    disabled={isLoading}
                                />
                                <label className="text-sm font-medium text-gray-200">Set as default address</label>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingAddress(false);
                                        setEditingAddress(null);
                                    }}
                                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                                    disabled={isLoading}
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

export default AddressManagement;