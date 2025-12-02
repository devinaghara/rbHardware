import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URI } from "../../../config";

const OrderPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  // Fallback image path to use when an image fails to load
  const fallbackImagePath = "/path/to/fallback/image.jpg";

  useEffect(() => {
    // Fetch orders from API
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
        setError(
          err.response?.data?.message || err.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // This useEffect will handle the case where a new order is added via navigation state
  useEffect(() => {
    if (location.state?.newOrder) {
      setOrders((prevOrders) => {
        // Check if the order already exists to avoid duplicates
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

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <FaCheckCircle size={24} />;
      case "in transit":
        return <FaShippingFast size={24} />;
      case "processing":
        return <FaSpinner size={24} className="animate-spin" />;
      case "cancelled":
        return <FaTimes size={24} />;
      default: // pending or other statuses
        return <FaBox size={24} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "from-green-500 to-emerald-500";
      case "in transit":
        return "from-orange-500 to-amber-500";
      case "processing":
        return "from-blue-500 to-cyan-500";
      case "cancelled":
        return "from-red-500 to-rose-500";
      default: // pending or other statuses
        return "from-gray-500 to-slate-500";
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.patch(
        `${API_URI}/order/cancel/${orderId}`,
        {
          reason: "Cancelled by user",
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the order in the state
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
      alert(
        err.response?.data?.message || err.message || "Failed to cancel order"
      );
    }
  };

  // Helper function to get the appropriate image source
  const getImageSource = (item) => {
    console.log("Item images:", item);
    if (item.image) return item.image;
    if (item.images && item.images.length > 0) return item.images[0];
    return fallbackImagePath;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black pt-20 flex justify-center items-center">
        <div className="text-white flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl mb-4" />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black pt-20 flex justify-center items-center">
        <div className="bg-red-900/50 p-6 rounded-xl text-white max-w-md">
          <h2 className="text-xl font-bold mb-4">Error Loading Orders</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate("/product")}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Orders
            </h1>
            <p className="text-gray-400 mt-2">
              Track and manage your purchases
            </p>
          </div>
          <button
            onClick={() => navigate("/product")}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
            <FaBox size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold text-white mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-400 mb-6">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/product")}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id || order.orderId}
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Status Bar */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getStatusStyle(
                    order.status
                  )} opacity-10 transform rotate-45 translate-x-16 -translate-y-16`}
                />

                {/* Header Section */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-white">
                          {order.orderId}
                        </span>
                        <div
                          className={`px-4 py-1 rounded-full bg-gradient-to-r ${getStatusStyle(
                            order.status
                          )} flex items-center space-x-2`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="font-medium text-white">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400">
                        Ordered on{" "}
                        {new Date(
                          order.statusHistory?.[0]?.timestamp || order.date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {expandedOrder === (order._id || order.orderId) &&
                        order.items.slice(0, 2).map((item, index) => (
                          <div key={item.id || index} className="relative">
                            <img
                              loading="lazy"
                              decoding="async"
                              src={getImageSource(item)}
                              alt={item.name || "Product"}
                              className="w-16 h-16 rounded-lg object-cover ring-2 ring-gray-700"
                              // onError={(e) => {
                              //   e.target.src = fallbackImagePath;
                              //   e.target.onerror = null;
                              // }}
                            />

                            {index === 1 && order.items.length > 2 && (
                              <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                                <span className="text-white font-medium">
                                  +{order.items.length - 2}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    <button
                      onClick={() => toggleOrder(order._id || order.orderId)}
                      className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors duration-300"
                    >
                      <span>
                        {expandedOrder === (order._id || order.orderId)
                          ? "Show Less"
                          : "Show Details"}
                      </span>
                      {expandedOrder === (order._id || order.orderId) ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === (order._id || order.orderId) && (
                  <div className="border-t border-gray-700 bg-gray-800/50 p-6 space-y-6">
                    {/* Items */}
                    <div className="grid gap-4">
                      {order.items.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="flex items-center space-x-4 bg-gray-700/30 p-4 rounded-xl"
                        >
                          <img
                            loading="lazy"
                            decoding="async"
                            src={getImageSource(item)}
                            alt={item.name || "Product"}
                            className="w-20 h-20 rounded-lg object-cover"
                            // onError={(e) => {
                            //   e.target.src = fallbackImagePath;
                            //   e.target.onerror = null;
                            // }}
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-white">
                              {item.name}
                            </h3>
                            <p className="text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-orange-500">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-700/30 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-3">
                          <FaMapMarkerAlt className="text-orange-500" />
                          <h4 className="text-lg font-medium text-white">
                            Shipping Address
                          </h4>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                          {order.shippingAddress.street}
                          <br />
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zipCode}
                        </p>
                      </div>
                      <div className="bg-gray-700/30 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-3">
                          <FaCreditCard className="text-orange-500" />
                          <h4 className="text-lg font-medium text-white">
                            Payment Method
                          </h4>
                        </div>
                        <p className="text-gray-400">{order.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                      {(order.status === "Pending" ||
                        order.status === "Processing") && (
                        <button
                          onClick={() =>
                            cancelOrder(order._id || order.orderId)
                          }
                          className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          Cancel Order
                        </button>
                      )}
                      {order.trackingNumber && order.status !== "Cancelled" && (
                        <button className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300">
                          Track Order
                        </button>
                      )}
                      <button
                        onClick={() =>
                          navigate(`/order/${order._id || order.orderId}`)
                        }
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
