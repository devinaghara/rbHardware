import React, { useState } from 'react';
import { FaPlus, FaPencilAlt, FaTrash, FaStar, FaRegStar, FaTimes, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'Home',
            name: 'John Doe',
            phone: '+1 234-567-8900',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            isDefault: true
        },
        {
            id: 2,
            type: 'Office',
            name: 'John Doe',
            phone: '+1 234-567-8901',
            street: '456 Business Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            isDefault: false
        }
    ]);

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

    const handleSetDefault = (addressId) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        })));
    };

    const handleDelete = (addressId) => {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setNewAddress(address);
        setIsAddingAddress(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            setAddresses(addresses.map(addr => 
                addr.id === editingAddress.id ? { ...newAddress, id: addr.id } : addr
            ));
        } else {
            setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
        }
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
                                        onChange={e => setNewAddress({...newAddress, type: e.target.value})}
                                    >
                                        <option>Home</option>
                                        <option>Work</option>
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
                                            onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                                            required
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
                                        onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                                        required
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
                                        onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                        required
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
                                            onChange={e => setNewAddress({...newAddress, [field]: e.target.value})}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input 
                                    type="checkbox"
                                    checked={newAddress.isDefault}
                                    onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                                    className="w-5 h-5 rounded border-gray-600 text-orange-500 focus:ring-orange-500"
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
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                                >
                                    {editingAddress ? 'Save Changes' : 'Add Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                    <div 
                        key={address.id} 
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
                                        onClick={() => handleSetDefault(address.id)}
                                        className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110"
                                        title="Set as default"
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
                                >
                                    <FaPencilAlt size={20} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(address.id)}
                                    className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110"
                                >
                                    <FaTrash size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressManagement;