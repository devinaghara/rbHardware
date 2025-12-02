import React, { useState } from 'react';
import { FaHeart, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, removeItem } from '../../Redux/actions/cartActions';

const ProductCard = ({ product, onProductClick, onToggleWishlist, isWishlisted }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find(item => item.productId === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    dispatch(addToCart(product)).finally(() => {
      setIsAddingToCart(false);
    });
  };

  const handleIncreaseQuantity = (e) => {
    e.stopPropagation();
    dispatch(updateQuantity(cartItem._id || cartItem.productId, cartItem.quantity + 1));
  };

  const handleDecreaseQuantity = (e) => {
    e.stopPropagation();
    if (cartItem.quantity > 1) {
      dispatch(updateQuantity(cartItem._id || cartItem.productId, cartItem.quantity - 1));
    } else {
      dispatch(removeItem(cartItem._id || cartItem.productId));
    }
  };

  return (
    <div
      onClick={() => onProductClick(product._id)}
      className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl 
      overflow-hidden shadow-xl group hover:shadow-orange-200 transition-all duration-500 cursor-pointer"
    >
      {/* ✅ IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.images?.[0]}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          alt={product.name}
        />

        {/* ✅ Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />

        {/* ✅ Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-3 rounded-full shadow 
          ${isWishlisted ? "bg-red-500 text-white" : "bg-white text-gray-600"} hover:scale-110 transition`}
        >
          <FaHeart />
        </button>

        {/* ✅ Floating Cart Button */}
        {!cartItem && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-400 
            text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
          >
            <FaShoppingCart />
          </button>
        )}
      </div>

      {/* ✅ CONTENT */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 tracking-wide line-clamp-1">
          {product.name}
        </h3>

        <p className="text-orange-500 font-bold text-lg mt-1">
          ₹{product.price.toFixed(2)}
        </p>

        {/* ✅ COLOR + MATERIAL */}
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: product.colorCode }}
          />
          <span>{product.color}</span>
          {product.material && <span>| {product.material}</span>}
        </div>

        {/* ✅ QUANTITY CONTROLS */}
        {cartItem && (
          <div className="mt-4 flex items-center justify-between bg-orange-50 rounded-full px-4 py-2">
            <button onClick={handleDecreaseQuantity}>
              <FaMinus />
            </button>
            <span className="font-bold text-gray-900">{quantityInCart}</span>
            <button onClick={handleIncreaseQuantity}>
              <FaPlus />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
