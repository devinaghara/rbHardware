import React, { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, removeItem } from '../../Redux/actions/cartActions';

const ProductCard = ({ product, onProductClick, onToggleWishlist, isWishlisted }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();
  
  // Get cart items to check if product is already in cart
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find(item => item.productId === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    dispatch(addToCart(product))
      .finally(() => {
        setIsAddingToCart(false);
      });
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      dispatch(updateQuantity(cartItem._id || cartItem.productId, cartItem.quantity + 1));
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      dispatch(updateQuantity(cartItem._id || cartItem.productId, cartItem.quantity - 1));
    } else if (cartItem) {
      dispatch(removeItem(cartItem._id || cartItem.productId));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative group">
        {product.images && product.images.length > 0 && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 hover:cursor-pointer"
            onClick={() => onProductClick(product._id)}
          />
        )}
        {/* Wishlist button positioned on top-right of image */}
        <button
          className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md 
            transition-all duration-300 hover:scale-110 
            ${isWishlisted ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"}`}
          onClick={() => onToggleWishlist(product)}
        >
          <FaHeart className="w-5 h-5" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
          <span className="text-lg font-bold text-orange-500">₹{product.price.toFixed(2)}</span>
        </div>

        {/* Color and Material Info */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-gray-200"
              style={{ backgroundColor: product.colorCode }}
              title={product.color}
            />
            <span className="text-sm text-gray-600">{product.color}</span>
          </div>
          {product.material && (
            <span className="text-sm text-gray-600">| {product.material}</span>
          )}
        </div>

        {/* Add to Cart Button or Quantity Counter */}
        {quantityInCart > 0 ? (
          <div className="flex items-center justify-between mt-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleDecreaseQuantity}
              className="p-2 bg-orange-500 text-white rounded-l-lg hover:bg-orange-600 transition-colors duration-300"
              aria-label="Decrease quantity"
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <span className="flex-grow text-center font-semibold text-gray-800">
              {quantityInCart}
            </span>
            <button
              onClick={handleIncreaseQuantity}
              className="p-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors duration-300"
              aria-label="Increase quantity"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`w-full mt-4 ${isAddingToCart ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'} text-white py-2 px-4 rounded-lg 
              flex items-center justify-center gap-2 transition-colors duration-300 
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
          >
            <FaShoppingCart className="w-4 h-4" />
            <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;