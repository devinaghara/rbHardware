import React, { useState } from 'react';
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

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering product click
    setIsAddingToCart(true);
    dispatch(addToCart(product))
      .finally(() => {
        setIsAddingToCart(false);
      });
  };

  const handleIncreaseQuantity = (e) => {
    e.stopPropagation(); // Prevent triggering product click
    if (cartItem) {
      dispatch(updateQuantity(cartItem._id || cartItem.productId, cartItem.quantity + 1));
    }
  };

  const handleDecreaseQuantity = (e) => {
    e.stopPropagation(); // Prevent triggering product click
    if (cartItem && cartItem.quantity > 1) {
      dispatch(updateQuantity(cartItem._id || cartItem.productId, cartItem.quantity - 1));
    } else if (cartItem) {
      dispatch(removeItem(cartItem._id || cartItem.productId));
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevent triggering product click
    onToggleWishlist(product);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={() => onProductClick(product._id)}
    >
      {/* Image Container */}
      <div className="relative group">
        {product.images && product.images.length > 0 && (
          <div className="aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        {/* Wishlist button positioned on top-right of image */}
        <button
          className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full bg-white shadow-md 
            transition-all duration-300 hover:scale-110 
            ${isWishlisted ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FaHeart className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
          <span className="text-base sm:text-lg font-bold text-orange-500 whitespace-nowrap ml-2">₹{product.price.toFixed(2)}</span>
        </div>

        {/* Color and Material Info */}
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <div
              className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-gray-200"
              style={{ backgroundColor: product.colorCode }}
              title={product.color}
            />
            <span className="text-xs sm:text-sm text-gray-600">{product.color}</span>
          </div>
          {product.material && (
            <span className="text-xs sm:text-sm text-gray-600">| {product.material}</span>
          )}
        </div>

        {/* Add to Cart Button or Quantity Counter */}
        {quantityInCart > 0 ? (
          <div className="flex items-center justify-between mt-3 sm:mt-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleDecreaseQuantity}
              className="p-1 sm:p-2 bg-orange-500 text-white rounded-l-lg hover:bg-orange-600 transition-colors duration-300"
              aria-label="Decrease quantity"
            >
              <FaMinus className="w-2 h-2 sm:w-3 sm:h-3" />
            </button>
            <span className="flex-grow text-center font-semibold text-gray-800">
              {quantityInCart}
            </span>
            <button
              onClick={handleIncreaseQuantity}
              className="p-1 sm:p-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors duration-300"
              aria-label="Increase quantity"
            >
              <FaPlus className="w-2 h-2 sm:w-3 sm:h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`w-full mt-3 sm:mt-4 ${isAddingToCart ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'} text-white py-2 px-3 sm:px-4 rounded-lg 
              flex items-center justify-center gap-1 sm:gap-2 transition-colors duration-300 
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
          >
            <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-sm sm:text-base">{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;