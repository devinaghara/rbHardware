import React, { useState } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';

const OrdersTable = ({ orders, onUpdateStatus }) => {
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [editingStatus, setEditingStatus] = useState(null);
    
    const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    const handleViewDetails = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };
    
    const handleStatusChange = (userId, orderId, status) => {
        onUpdateStatus(userId, orderId, status);
        setEditingStatus(null);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                No orders found
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <React.Fragment key={order._id}>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order._id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.user?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${order.totalAmount?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingStatus === order._id ? (
                                            <select
                                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                                defaultValue={order.status}
                                                onChange={(e) => handleStatusChange(order.user?._id, order._id, e.target.value)}
                                                autoFocus
                                                onBlur={() => setEditingStatus(null)}
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                                            >
                                                {order.status || 'Processing'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingStatus(order._id)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Edit Status"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleViewDetails(order._id)}
                                                className="text-gray-600 hover:text-gray-900"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedOrder === order._id && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                            <div className="space-y-3">
                                                <h4 className="font-medium">Order Details</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-700">Shipping Address</h5>
                                                        <p className="text-sm text-gray-600">
                                                            {order.shippingAddress?.street}<br />
                                                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                                                            {order.shippingAddress?.country}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-700">Contact</h5>
                                                        <p className="text-sm text-gray-600">
                                                            {order.user?.email || 'N/A'}<br />
                                                            {order.user?.phone || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-700">Items</h5>
                                                    <table className="min-w-full divide-y divide-gray-200 mt-2">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.items?.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td className="px-3 py-2 text-sm">{item.product?.name || 'Unknown Product'}</td>
                                                                    <td className="px-3 py-2 text-sm">${item.price?.toFixed(2) || '0.00'}</td>
                                                                    <td className="px-3 py-2 text-sm">{item.quantity}</td>
                                                                    <td className="px-3 py-2 text-sm">${(item.price * item.quantity).toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot className="bg-gray-50">
                                                            <tr>
                                                                <td colSpan="3" className="px-3 py-2 text-sm font-medium text-right">Total:</td>
                                                                <td className="px-3 py-2 text-sm font-medium">${order.totalAmount?.toFixed(2) || '0.00'}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                
                                                {order.notes && (
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-700">Notes</h5>
                                                        <p className="text-sm text-gray-600">{order.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;