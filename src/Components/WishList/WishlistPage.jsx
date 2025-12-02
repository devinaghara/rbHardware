import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../Redux/actions/wishlistAction";
import { addToCart, updateQuantity } from "../../Redux/actions/cartActions";
import Navbar from "../Landing/Navbar";
import axios from "axios";
import { API_URI } from "../../../config";

export default function WishlistPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);
  const cartLoading = useSelector((state) => state.cart.loading);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const validProductIds = wishlistItems.filter((id) => id != null);

        const productsData = await Promise.all(
          validProductIds.map(async (productId) => {
            try {
              const response = await axios.get(
                `${API_URI}/plist/productlist/${productId}`
              );
              if (!response.data?.product) return null;

              const product = response.data.product;
              // Find the specific variant if the ID matches a variant
              const variant =
                product.linkedProducts.find((v) => v._id === productId) ||
                product.linkedProducts[0];

              return {
                _id: productId, // Use the actual wishlist item ID
                mainProductId: product._id, // Store the main product ID separately
                name: variant.name,
                price: variant.price,
                images: variant.images,
                description: variant.description,
                color: variant.color,
                category: product.category,
                material: product.material,
              };
            } catch (err) {
              console.error(`Error fetching product ${productId}:`, err);
              return null;
            }
          })
        );

        const validProducts = productsData.filter(
          (product) => product !== null
        );
        setWishlistProducts(validProducts);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
        setError("Failed to load wishlist products");
      } finally {
        setLoading(false);
      }
    };

    if (wishlistItems?.length > 0) {
      fetchWishlistProducts();
    } else {
      setWishlistProducts([]);
      setLoading(false);
    }
  }, [wishlistItems]);

  const handleRemoveFromWishlist = (productId) => {
    try {
      dispatch(removeFromWishlist(productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setError("Failed to remove item from wishlist");
    }
  };

  const handleAddToCart = (product) => {
    try {
      // Check if product is already in cart
      const existingCartItem = cartItems.find(
        (item) =>
          item.productId === product._id ||
          (item.productId === product._id && item.color === product.color)
      );

      if (existingCartItem) {
        // If product exists, update quantity
        dispatch(
          updateQuantity(existingCartItem._id, existingCartItem.quantity + 1)
        );
      } else {
        // If product doesn't exist, add with quantity 1
        dispatch(addToCart(product, 1));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add item to cart");
    }
  };

  const handleRemoveFromCart = (product) => {
    try {
      const existingCartItem = cartItems.find(
        (item) =>
          item.productId === product._id ||
          (item.productId === product._id && item.color === product.color)
      );

      if (existingCartItem && existingCartItem.quantity > 1) {
        dispatch(
          updateQuantity(existingCartItem._id, existingCartItem.quantity - 1)
        );
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError("Failed to remove item from cart");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">Loading wishlist...</div>
          </div>
        </div>
      </>
    );
  }

  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] pt-20 pb-36">

      {/* ✅ Header */}
      <div className="max-w-7xl mx-auto px-4 mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            My Wishlist
          </h1>
          <p className="text-gray-500 text-sm">Your saved premium picks ✨</p>
        </div>

        <button
          onClick={() => navigate("/product")}
          className="px-7 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold rounded-full shadow-lg hover:scale-105 transition"
        >
          Explore Store
        </button>
      </div>

      {/* ✅ Error */}
      {error && (
        <div className="max-w-5xl mx-auto px-4 mb-6">
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl shadow">
            {error}
          </div>
        </div>
      )}

      {/* ✅ Empty State */}
      {wishlistProducts.length === 0 ? (
        <div className="max-w-xl mx-auto mt-24 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-12 text-center shadow-2xl">
          <p className="text-gray-600 text-lg mb-6">
            Your wishlist is feeling lonely 🥲
          </p>
          <button
            onClick={() => navigate("/product")}
            className="px-10 py-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold rounded-full hover:scale-105 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (

        /* ✅ TRENDY GRID */
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistProducts.map((product) => {
            const cartItem = cartItems.find(
              item => item.productId === product._id
            );

            return (
              <div
                key={product._id}
                className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl overflow-hidden shadow-xl group hover:shadow-orange-200 transition-all duration-500"
              >

                {/* ✅ IMAGE + FLOATING CONTROLS */}
                <div
                  onClick={() => handleProductClick(product._id)}
                  className="relative h-64 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    className="w-full h-full object-cover scale-100 group-hover:scale-110 transition duration-700"
                  />

                  {/* ✅ Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />

                  {/* ✅ Floating Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(product._id);
                    }}
                    className="absolute top-3 right-3 bg-white/90 text-red-500 p-3 rounded-full shadow hover:bg-red-500 hover:text-white transition"
                  >
                    <FaTrash />
                  </button>

                  {/* ✅ Floating Add to Cart */}
                  {!cartItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="absolute bottom-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
                    >
                      <FaShoppingCart />
                    </button>
                  )}
                </div>

                {/* ✅ TEXT INFO */}
                <div className="p-5">

                  <h3 className="font-semibold text-gray-900 tracking-wide line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-orange-500 font-bold text-lg mt-1">
                    ₹{product.price.toFixed(2)}
                  </p>

                  {/* ✅ QUANTITY CONTROLS */}
                  {cartItem && (
                    <div className="mt-4 flex items-center justify-between bg-orange-50 rounded-full px-4 py-2">

                      <button
                        onClick={() => handleRemoveFromCart(product)}
                        className="text-gray-800 hover:text-orange-500 transition"
                      >
                        <FaMinus />
                      </button>

                      <span className="font-bold text-gray-900">
                        {cartItem.quantity}
                      </span>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="text-gray-800 hover:text-orange-500 transition"
                      >
                        <FaPlus />
                      </button>

                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </>
);

}
