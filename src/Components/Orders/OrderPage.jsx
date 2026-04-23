import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
  FaCreditCard,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaTruck,
  FaClock,
} from "react-icons/fa";
import axios from "axios";
import { API_URI } from "../../../config";
import Navbar from "../Landing/Navbar";

/**
 * Status steps for the order timeline visualization
 */
const STATUS_STEPS = ["Processing", "Shipped", "In Transit", "Delivered"];

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle new order via navigation state
  useEffect(() => {
    if (location.state?.newOrder) {
      setOrders((prevOrders) => {
        const orderExists = prevOrders.some(
          (order) => order.orderId === location.state.newOrder.orderId
        );
        if (!orderExists) {
          return [location.state.newOrder, ...prevOrders];
        }
        return prevOrders;
      });
    }
  }, [location.state]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URI}/order/user`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        throw new Error(response.data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.response?.status === 401) {
        setError("Please log in to view your orders.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const iconClass = "text-lg";
    switch (status?.toLowerCase()) {
      case "delivered":
        return <FaCheckCircle className={iconClass} />;
      case "in transit":
        return <FaTruck className={iconClass} />;
      case "shipped":
        return <FaShippingFast className={iconClass} />;
      case "processing":
        return <FaSpinner className={`${iconClass} animate-spin`} />;
      case "cancelled":
        return <FaTimes className={iconClass} />;
      default:
        return <FaBox className={iconClass} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { bg: "bg-green-500", text: "text-green-500", light: "bg-green-50", border: "border-green-200" };
      case "in transit":
        return { bg: "bg-blue-500", text: "text-blue-500", light: "bg-blue-50", border: "border-blue-200" };
      case "shipped":
        return { bg: "bg-indigo-500", text: "text-indigo-500", light: "bg-indigo-50", border: "border-indigo-200" };
      case "processing":
        return { bg: "bg-orange-500", text: "text-orange-500", light: "bg-orange-50", border: "border-orange-200" };
      case "cancelled":
        return { bg: "bg-red-500", text: "text-red-500", light: "bg-red-50", border: "border-red-200" };
      default:
        return { bg: "bg-gray-500", text: "text-gray-500", light: "bg-gray-50", border: "border-gray-200" };
    }
  };

  const getStatusStepIndex = (status) => {
    if (status === "Cancelled") return -1;
    return STATUS_STEPS.indexOf(status);
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancellingId(orderId);
      const response = await axios.patch(
        `${API_URI}/order/${orderId}/cancel`,
        { reason: "Cancelled by user" },
        { withCredentials: true }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId || order._id === orderId
              ? response.data.order
              : order
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert(err.response?.data?.message || err.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const getImageSource = (item) => {
    if (item.image) return item.image;
    if (item.images && item.images.length > 0) return item.images[0];
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7]">
        <Navbar />
        <div className="pt-28 flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7]">
        <Navbar />
        <div className="pt-28 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Unable to Load Orders</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => navigate("/product")}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full font-bold hover:scale-105 transition shadow-lg"
            >
              Go to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              My Orders
            </h1>
            <p className="text-gray-400 mt-1">
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </p>
          </div>
          <button
            onClick={() => navigate("/product")}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full font-bold hover:scale-105 transition shadow-lg"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/product")}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full font-bold hover:scale-105 transition shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusColors = getStatusColor(order.status);
              const isExpanded = expandedOrder === (order._id || order.orderId);
              const currentStepIdx = getStatusStepIndex(order.status);
              const isCancelled = order.status === "Cancelled";

              return (
                <div
                  key={order._id || order.orderId}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:shadow-xl"
                >
                  {/* Order Header */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-lg font-bold text-gray-900">
                            {order.orderId}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 text-white ${statusColors.bg}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Ordered on{" "}
                          {new Date(
                            order.createdAt || order.statusHistory?.[0]?.timestamp
                          ).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-orange-500">
                          ₹{order.total?.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-400">{order.items?.length} item(s)</p>
                      </div>
                    </div>

                    {/* Mini preview + Expand */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {order.items?.slice(0, 3).map((item, idx) => {
                          const imgSrc = getImageSource(item);
                          return imgSrc ? (
                            <img
                              key={idx}
                              src={imgSrc}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div key={idx} className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <FaBox className="text-gray-300" />
                            </div>
                          );
                        })}
                        {order.items?.length > 3 && (
                          <span className="text-sm text-gray-400 font-medium">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleOrder(order._id || order.orderId)}
                        className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-medium text-sm transition"
                      >
                        {isExpanded ? "Hide Details" : "View Details"}
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-5 sm:p-6 space-y-6">
                      {/* Status Timeline */}
                      {!isCancelled && (
                        <div className="bg-white rounded-xl p-5 border border-gray-100">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FaClock className="text-orange-500" /> Order Progress
                          </h4>
                          <div className="flex items-center justify-between relative">
                            {/* Progress line */}
                            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full mx-8" />
                            <div
                              className="absolute top-4 left-0 h-1 bg-orange-500 rounded-full mx-8 transition-all duration-500"
                              style={{
                                width: currentStepIdx >= 0
                                  ? `calc(${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}% - 4rem)`
                                  : "0%",
                              }}
                            />

                            {STATUS_STEPS.map((stepName, idx) => {
                              const isCompleted = idx <= currentStepIdx;
                              const isCurrent = idx === currentStepIdx;
                              return (
                                <div key={stepName} className="flex flex-col items-center z-10 flex-1">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                      isCompleted
                                        ? "bg-orange-500 text-white shadow-md"
                                        : "bg-gray-200 text-gray-400"
                                    } ${isCurrent ? "ring-4 ring-orange-200" : ""}`}
                                  >
                                    {isCompleted ? "✓" : idx + 1}
                                  </div>
                                  <span
                                    className={`text-xs mt-2 font-medium text-center ${
                                      isCompleted ? "text-orange-600" : "text-gray-400"
                                    }`}
                                  >
                                    {stepName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Estimated Delivery */}
                          {order.estimatedDelivery && (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                              <FaTruck className="text-orange-500" />
                              <span>
                                Estimated delivery:{" "}
                                <strong className="text-gray-700">
                                  {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                                    year: "numeric", month: "long", day: "numeric",
                                  })}
                                </strong>
                              </span>
                            </div>
                          )}

                          {/* Tracking Number */}
                          {order.trackingNumber && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <FaShippingFast className="text-orange-500" />
                              <span>
                                Tracking: <strong className="text-gray-700">{order.trackingNumber}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Cancelled Banner */}
                      {isCancelled && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                          <FaTimes className="text-red-500 text-xl" />
                          <div>
                            <p className="font-bold text-red-700">Order Cancelled</p>
                            <p className="text-sm text-red-500">
                              {order.statusHistory?.find((h) => h.status === "Cancelled")?.comment || "Cancelled by user"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Order Items */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.items?.map((item, index) => {
                            const imgSrc = getImageSource(item);
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100"
                              >
                                {imgSrc ? (
                                  <img
                                    src={imgSrc}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover border"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <FaBox className="text-gray-300" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-gray-900 truncate">{item.name}</h5>
                                  <p className="text-sm text-gray-400">
                                    Qty: {item.quantity}
                                    {item.color && ` • ${item.color}`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-orange-500">₹{item.price?.toFixed(2)}</p>
                                  <p className="text-xs text-gray-400">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Shipping & Payment */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaMapMarkerAlt className="text-orange-500" />
                            <h4 className="font-bold text-gray-900">Shipping Address</h4>
                          </div>
                          <div className="text-sm text-gray-600 space-y-0.5">
                            <p className="font-medium text-gray-800">{order.shippingAddress?.name}</p>
                            <p>{order.shippingAddress?.street}</p>
                            <p>
                              {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                              {order.shippingAddress?.zipCode}
                            </p>
                            {order.shippingAddress?.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCreditCard className="text-orange-500" />
                            <h4 className="font-bold text-gray-900">Payment</h4>
                          </div>
                          <div className="text-sm text-gray-600 space-y-0.5">
                            <p>{order.paymentMethod}</p>
                            <p className={`font-medium ${
                              order.paymentDetails?.status === "Paid"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}>
                              Status: {order.paymentDetails?.status || "Pending"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status History */}
                      {order.statusHistory && order.statusHistory.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <h4 className="font-bold text-gray-900 mb-3">Order Timeline</h4>
                          <div className="space-y-3">
                            {[...order.statusHistory].reverse().map((entry, idx) => {
                              const entryColors = getStatusColor(entry.status);
                              return (
                                <div key={idx} className="flex items-start gap-3">
                                  <div className={`w-3 h-3 rounded-full mt-1.5 ${entryColors.bg}`} />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm text-gray-800">{entry.status}</span>
                                      <span className="text-xs text-gray-400">
                                        {new Date(entry.timestamp).toLocaleString("en-IN", {
                                          day: "numeric", month: "short", year: "numeric",
                                          hour: "2-digit", minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                    {entry.comment && (
                                      <p className="text-xs text-gray-400 mt-0.5">{entry.comment}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-end gap-3 pt-2">
                        {!isCancelled &&
                          (order.status === "Pending" || order.status === "Processing") && (
                            <button
                              onClick={() => cancelOrder(order._id || order.orderId)}
                              disabled={cancellingId === (order._id || order.orderId)}
                              className="px-5 py-2.5 border-2 border-red-400 text-red-500 rounded-full font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-wait"
                            >
                              {cancellingId === (order._id || order.orderId)
                                ? "Cancelling..."
                                : "Cancel Order"}
                            </button>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
