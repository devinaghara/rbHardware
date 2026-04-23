import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaBox,
  FaCheckCircle,
  FaShippingFast,
  FaTruck,
  FaSpinner,
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaClipboard,
} from "react-icons/fa";

/**
 * Status configuration — colors and transitions
 */
const STATUS_CONFIG = {
  Processing: {
    bg: "bg-orange-500",
    light: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
    icon: FaSpinner,
    next: ["Shipped", "Cancelled"],
  },
  Shipped: {
    bg: "bg-indigo-500",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
    icon: FaShippingFast,
    next: ["In Transit", "Cancelled"],
  },
  "In Transit": {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    icon: FaTruck,
    next: ["Delivered"],
  },
  Delivered: {
    bg: "bg-green-500",
    light: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    icon: FaCheckCircle,
    next: [],
  },
  Cancelled: {
    bg: "bg-red-500",
    light: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    icon: FaTimes,
    next: [],
  },
  Pending: {
    bg: "bg-gray-500",
    light: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
    icon: FaClock,
    next: ["Processing", "Cancelled"],
  },
};

const OrdersTable = ({ orders, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Status update form state
  const [updateForm, setUpdateForm] = useState({
    status: "",
    trackingNumber: "",
    estimatedDelivery: "",
    comment: "",
  });

  // Status count chips
  const statusCounts = useMemo(() => {
    const counts = {};
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Filter + Search
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== "ALL" && order.status !== statusFilter) return false;

      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesOrderId = order.orderId?.toLowerCase().includes(term);
        const matchesUser =
          order.user?.name?.toLowerCase().includes(term) ||
          order.user?.email?.toLowerCase().includes(term);
        return matchesOrderId || matchesUser;
      }
      return true;
    });
  }, [orders, statusFilter, searchTerm]);

  const toggleExpand = (orderId) => {
    const newId = expandedOrder === orderId ? null : orderId;
    setExpandedOrder(newId);
    if (newId) {
      const order = orders.find((o) => o._id === orderId);
      if (order) {
        setUpdateForm({
          status: "",
          trackingNumber: order.trackingNumber || "",
          estimatedDelivery: order.estimatedDelivery
            ? new Date(order.estimatedDelivery).toISOString().split("T")[0]
            : "",
          comment: "",
        });
      }
    }
  };

  const handleStatusUpdate = (order) => {
    if (!updateForm.status) {
      alert("Please select a status to update");
      return;
    }

    onUpdateStatus(order._id, {
      status: updateForm.status,
      trackingNumber: updateForm.trackingNumber || undefined,
      estimatedDelivery: updateForm.estimatedDelivery || undefined,
      comment: updateForm.comment || undefined,
    });

    // Reset form
    setUpdateForm((prev) => ({
      ...prev,
      status: "",
      comment: "",
    }));
  };

  const getStatusConfig = (status) =>
    STATUS_CONFIG[status] || STATUS_CONFIG.Pending;

  const getImageSource = (item) => {
    if (item.image) return item.image;
    if (item.images && item.images.length > 0) return item.images[0];
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Status Summary Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            statusFilter === "ALL"
              ? "bg-gray-900 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
          }`}
        >
          All ({orders.length})
        </button>
        {Object.keys(STATUS_CONFIG).map((status) =>
          statusCounts[status] ? (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === status
                  ? `${getStatusConfig(status).bg} text-white shadow-md`
                  : `${getStatusConfig(status).light} ${getStatusConfig(status).text} border ${getStatusConfig(status).border} hover:shadow`
              }`}
            >
              {status} ({statusCounts[status]})
            </button>
          ) : null
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order ID or customer name..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FaBox className="mx-auto text-5xl mb-3" />
          <p className="text-lg font-medium">No orders found</p>
          <p className="text-sm">Try changing filters or search term</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const config = getStatusConfig(order.status);
            const StatusIcon = config.icon;
            const isExpanded = expandedOrder === order._id;
            const allowedNext = config.next || [];

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Order Row */}
                <div
                  className="p-4 sm:p-5 cursor-pointer"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} text-white flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={order.status === "Processing" ? "animate-spin" : ""} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900">{order.orderId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.light} ${config.text}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-0.5">
                          {order.user && (
                            <>
                              <FaUser className="text-xs" />
                              <span className="truncate">{order.user.name || order.user.email}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xl font-extrabold text-orange-500">
                        ₹{order.total?.toFixed(2)}
                      </span>
                      {isExpanded ? (
                        <FaChevronUp className="text-gray-400" />
                      ) : (
                        <FaChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-5 sm:p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Column 1: Customer Info */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FaUser className="text-orange-500" /> Customer
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-800">{order.user?.name || "N/A"}</p>
                            <p>{order.user?.email || "N/A"}</p>
                            {order.user?.phone && <p>Phone: {order.user.phone}</p>}
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-orange-500" /> Shipping
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-800">
                              {order.shippingAddress?.name}{" "}
                              <span className="text-xs text-gray-400">({order.shippingAddress?.type})</span>
                            </p>
                            <p>{order.shippingAddress?.street}</p>
                            <p>
                              {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                              {order.shippingAddress?.zipCode}
                            </p>
                            {order.shippingAddress?.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FaCreditCard className="text-orange-500" /> Payment
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.paymentMethod}</p>
                            <p className={`font-medium ${
                              order.paymentDetails?.status === "Paid" ? "text-green-600" : "text-yellow-600"
                            }`}>
                              {order.paymentDetails?.status || "Pending"}
                            </p>
                            {order.paymentDetails?.id && (
                              <p className="text-xs text-gray-400 break-all">
                                ID: {order.paymentDetails.id}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Order Items */}
                      <div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100 h-full">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FaBox className="text-orange-500" /> Items ({order.items?.length})
                          </h4>
                          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                            {order.items?.map((item, idx) => {
                              const imgSrc = getImageSource(item);
                              return (
                                <div key={idx} className="flex items-center gap-3">
                                  {imgSrc ? (
                                    <img
                                      src={imgSrc}
                                      alt={item.name}
                                      className="w-12 h-12 rounded-lg object-cover border flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                      <FaBox className="text-gray-300" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                                    <p className="text-xs text-gray-400">
                                      Qty: {item.quantity}
                                      {item.color && ` • ${item.color}`}
                                    </p>
                                  </div>
                                  <span className="font-bold text-sm text-orange-500 flex-shrink-0">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span className="text-orange-500">₹{order.total?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Column 3: Status History + Update */}
                      <div className="space-y-4">
                        {/* Status History */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FaClock className="text-orange-500" /> Timeline
                          </h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {[...(order.statusHistory || [])].reverse().map((entry, idx) => {
                              const entryConfig = getStatusConfig(entry.status);
                              return (
                                <div key={idx} className="flex items-start gap-2">
                                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${entryConfig.bg} flex-shrink-0`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-medium text-xs text-gray-800">{entry.status}</span>
                                      <span className="text-xs text-gray-400 flex-shrink-0">
                                        {new Date(entry.timestamp).toLocaleDateString("en-IN", {
                                          day: "numeric", month: "short",
                                        })}
                                      </span>
                                    </div>
                                    {entry.comment && (
                                      <p className="text-xs text-gray-400 truncate">{entry.comment}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Update Status Form */}
                        {allowedNext.length > 0 && (
                          <div className="bg-white rounded-xl p-4 border-2 border-orange-100">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <FaClipboard className="text-orange-500" /> Update Status
                            </h4>
                            <div className="space-y-3">
                              <select
                                value={updateForm.status}
                                onChange={(e) =>
                                  setUpdateForm((prev) => ({ ...prev, status: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              >
                                <option value="">Select new status</option>
                                {allowedNext.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>

                              {(updateForm.status === "Shipped" ||
                                updateForm.status === "In Transit") && (
                                <input
                                  type="text"
                                  value={updateForm.trackingNumber}
                                  onChange={(e) =>
                                    setUpdateForm((prev) => ({
                                      ...prev,
                                      trackingNumber: e.target.value,
                                    }))
                                  }
                                  placeholder="Tracking Number"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                              )}

                              <input
                                type="date"
                                value={updateForm.estimatedDelivery}
                                onChange={(e) =>
                                  setUpdateForm((prev) => ({
                                    ...prev,
                                    estimatedDelivery: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />

                              <textarea
                                value={updateForm.comment}
                                onChange={(e) =>
                                  setUpdateForm((prev) => ({
                                    ...prev,
                                    comment: e.target.value,
                                  }))
                                }
                                placeholder="Add a comment (optional)"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                              />

                              <button
                                onClick={() => handleStatusUpdate(order)}
                                disabled={!updateForm.status}
                                className={`w-full py-2.5 rounded-lg font-bold text-sm transition ${
                                  updateForm.status
                                    ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:scale-[1.02] shadow-md"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                Update to {updateForm.status || "..."}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Terminal state notice */}
                        {allowedNext.length === 0 && (
                          <div className={`rounded-xl p-4 ${config.light} border ${config.border}`}>
                            <p className={`text-sm font-medium ${config.text} text-center`}>
                              {order.status === "Delivered"
                                ? "✓ Order completed"
                                : order.status === "Cancelled"
                                  ? "✕ Order cancelled"
                                  : "No further status updates available"}
                            </p>
                          </div>
                        )}

                        {/* Notes */}
                        {order.notes && (
                          <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                            <p className="text-xs font-medium text-yellow-700">Note: {order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersTable;