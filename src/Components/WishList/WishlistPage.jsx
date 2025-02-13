import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../../Redux/actions/wishlistAction';
import { addItem, removeItem, updateQuantity } from '../../Redux/actions/cartActions';
import Navbar from "../Landing/Navbar";
import axios from "axios";
import { API_URI } from "../../../config";

export default function WishlistPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlistItems = useSelector(state => state.wishlist.items);
    const cartItems = useSelector(state => state.cart.items);
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdatingCart, setIsUpdatingCart] = useState(false);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            try {
                setLoading(true);
                setError(null);
    
                const validProductIds = wishlistItems.filter(id => id != null);
    
                const productsData = await Promise.all(
                    validProductIds.map(async productId => {
                        try {
                            const response = await axios.get(`${API_URI}/plist/productlist/${productId}`);
                            if (!response.data?.product) return null;
    
                            const product = response.data.product;
                            // Find the specific variant if the ID matches a variant
                            const variant = product.linkedProducts.find(v => v._id === productId) || product.linkedProducts[0];
    
                            return {
                                _id: productId, // Use the actual wishlist item ID
                                mainProductId: product._id, // Store the main product ID separately
                                name: variant.name,
                                price: variant.price,
                                images: variant.images,
                                description: variant.description,
                                color: variant.color,
                                category: product.category,
                                material: product.material
                            };
                        } catch (err) {
                            console.error(`Error fetching product ${productId}:`, err);
                            return null;
                        }
                    })
                );
    
                const validProducts = productsData.filter(product => product !== null);
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
            setIsUpdatingCart(true);
            // Check if product is already in cart
            const existingCartItem = cartItems.find(item =>
                `${item.id}-${item.color}` === `${product._id}-${product.color}`
            );
    
            if (existingCartItem) {
                // If product exists, update quantity
                dispatch(updateQuantity(
                    `${product._id}-${product.color}`,
                    existingCartItem.quantity + 1
                ));
            } else {
                // If product doesn't exist, add with quantity 1
                dispatch(addItem({
                    ...product,
                    quantity: 1,
                    id: product._id
                }));
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            setError("Failed to add item to cart");
        } finally {
            setIsUpdatingCart(false);
        }
    };
    
    const handleRemoveFromCart = (product) => {
        try {
            setIsUpdatingCart(true);
            const existingCartItem = cartItems.find(item =>
                `${item.id}-${item.color}` === `${product._id}-${product.color}`
            );
    
            if (existingCartItem) {
                dispatch(updateQuantity(
                    `${product._id}-${product.color}`,
                    existingCartItem.quantity - 1
                ));
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
            setError("Failed to remove item from cart");
        } finally {
            setIsUpdatingCart(false);
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
            <div className="min-h-screen bg-gray-100 pt-20">
                {error && (
                    <div className="max-w-7xl mx-auto px-4 mb-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

                    {wishlistProducts.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
                            <button
                                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
                                onClick={() => navigate('/product')}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlistProducts.map((product) => {
                                const cartItem = cartItems.find(item =>
                                    (item._id === product._id) || (item.id === product._id)
                                );

                                return (
                                    <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name || 'Product Image'}
                                            className="w-full h-48 object-cover cursor-pointer"
                                            onClick={() => handleProductClick(product._id)}
                                            onError={(e) => {
                                                e.target.src = '/path/to/fallback/image.jpg';
                                                e.target.onerror = null;
                                            }}
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-600 mb-2">
                                                ${(product.price || 0).toFixed(2)}
                                            </p>
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center">
                                                    {cartItem ? (
                                                        <div className="flex items-center space-x-4">
                                                            <button
                                                                className="bg-red-500 text-white p-2 rounded-md disabled:opacity-50"
                                                                onClick={() => handleRemoveFromCart(product._id)}
                                                                disabled={isUpdatingCart}
                                                            >
                                                                <FaMinus />
                                                            </button>
                                                            <span>{cartItem.quantity}</span>
                                                            <button
                                                                className="bg-green-500 text-white p-2 rounded-md disabled:opacity-50"
                                                                onClick={() => handleAddToCart(product)}
                                                                disabled={isUpdatingCart}
                                                            >
                                                                <FaPlus />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 transition duration-300"
                                                            onClick={() => handleAddToCart(product)}
                                                            disabled={isUpdatingCart}
                                                        >
                                                            <FaShoppingCart className="mr-2" />
                                                            Add to Cart
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                                    className="p-2 text-red-500 hover:text-red-600 disabled:opacity-50 transition duration-300"
                                                    disabled={isUpdatingCart}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}