import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { API_URI } from '../../../config';

const ProductTable = ({ products, onEdit, onDelete, onRefresh }) => {
    const [expandedRows, setExpandedRows] = useState({});
    const [togglingId, setTogglingId] = useState(null);

    const toggleRow = (productId) => {
        setExpandedRows(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const handleToggleOrderable = async (product) => {
        try {
            setTogglingId(product._id);
            await axios.patch(
                `${API_URI}/plist/productlist/${product._id}/orderable`,
                { isOrderable: !product.isOrderable },
                { withCredentials: true }
            );
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Failed to toggle orderable:', error);
            alert(error.response?.data?.message || 'Failed to update product availability');
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Material
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Variants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Orderable
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map(product => (
                        <React.Fragment key={product._id}>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => toggleRow(product._id)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        {expandedRows[product._id] ? 
                                            <ChevronUp className="h-5 w-5" /> : 
                                            <ChevronDown className="h-5 w-5" />
                                        }
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.productId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.material}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.linkedProducts.length} variants
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleToggleOrderable(product)}
                                        disabled={togglingId === product._id}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                                            product.isOrderable !== false
                                                ? 'bg-green-500'
                                                : 'bg-gray-300'
                                        } ${togglingId === product._id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                                        title={product.isOrderable !== false ? 'Click to disable ordering' : 'Click to enable ordering'}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                                product.isOrderable !== false
                                                    ? 'translate-x-6'
                                                    : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <FaEdit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(product._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FaTrash className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                            {expandedRows[product._id] && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            {product.linkedProducts.map((linkedProduct, index) => (
                                                <div 
                                                    key={index}
                                                    className="bg-gray-50 p-4 rounded-lg"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-semibold text-lg">
                                                            {linkedProduct.name}
                                                        </h3>
                                                        <span className="font-medium text-lg">
                                                            ₹{linkedProduct.price}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Color: </span>
                                                                {linkedProduct.color}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-sm">Color Preview:</span>
                                                                <div 
                                                                    className="w-6 h-6 rounded border"
                                                                    style={{ backgroundColor: linkedProduct.colorCode }}
                                                                />
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                <span className="font-medium">Description: </span>
                                                                {linkedProduct.description}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm mb-2">Images:</p>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {linkedProduct.images.map((image, imgIndex) => (
                                                                    <img
                                                                        key={imgIndex}
                                                                        src={image}
                                                                        alt={`${linkedProduct.name} ${imgIndex + 1}`}
                                                                        className="w-full h-24 object-cover rounded"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;