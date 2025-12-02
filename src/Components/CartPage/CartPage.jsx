import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaShoppingCart,
} from "react-icons/fa";
import {
  fetchCart,
  removeItem,
  updateQuantity,
} from "../../Redux/actions/cartActions";
import { useNavigate } from "react-router-dom";
import Navbar from "../Landing/Navbar";

const CartPage = () => {
  const {
    items: cartItems,
    totalAmount,
    loading,
    error,
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch cart on component mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleIncreaseQuantity = (item) => {
    dispatch(updateQuantity(item._id, item.quantity + 1));
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity(item._id, item.quantity - 1));
    } else {
      dispatch(removeItem(item._id));
    }
  };

  const handleRemoveItem = (item) => {
    dispatch(removeItem(item._id));
  };

  const handleProceedToPay = () => {
    navigate("/address");
  };

  const handleContinueShopping = () => {
    navigate("/product");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-center text-orange-500">
          <p className="text-xl">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12 mt-10 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error loading cart
          </h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchCart())}
            className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center text-orange-500">
          Your Shopping Cart
        </h1>

        {/* ✅ EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 text-center shadow-xl border border-gray-200">
            <FaShoppingCart className="mx-auto text-7xl text-orange-400 mb-6" />
            <p className="text-xl text-gray-700 mb-8">Your cart is empty</p>

            <button
              onClick={handleContinueShopping}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 
            text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ✅ CART ITEMS */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center justify-between p-6 border-b last:border-b-0"
                >
                  {/* ✅ PRODUCT INFO */}
                  <div className="flex items-center gap-6 w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover border"
                    />

                    <div>
                      <h2 className="font-semibold text-gray-900 text-lg">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.color || "Standard"}
                      </p>
                      <p className="text-orange-500 font-bold text-lg mt-2">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ✅ QUANTITY CONTROLS */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-orange-50 rounded-full overflow-hidden shadow">
                      <button
                        onClick={() => handleDecreaseQuantity(item)}
                        className="px-4 py-2 bg-orange-500 text-white"
                      >
                        <FaMinus />
                      </button>

                      <span className="px-5 font-bold text-gray-900">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        className="px-4 py-2 bg-orange-500 text-white"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ ORDER SUMMARY */}
            <div className="sticky top-24 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-8 h-fit">
              <h2 className="text-2xl font-extrabold mb-6 text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-500 font-semibold">Free</span>
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-extrabold">
                  <span>Total</span>
                  <span className="text-orange-500">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToPay}
                className="w-full mt-8 bg-gradient-to-r from-orange-500 to-yellow-400 
              text-white font-bold py-4 rounded-full shadow-lg hover:scale-105 transition"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full mt-4 border border-orange-400 text-orange-500 py-3 rounded-full 
              hover:bg-orange-50 transition flex items-center justify-center"
              >
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ MOBILE FIXED CHECKOUT BAR */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full sm:hidden bg-white border-t shadow-xl flex items-center justify-between px-4 py-3 z-50">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-extrabold text-orange-500">
              ₹{totalAmount.toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleProceedToPay}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 
          text-white font-bold rounded-full shadow"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
