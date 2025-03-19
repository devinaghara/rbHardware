import { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Landing/Navbar";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, removeItem } from '../../Redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '../../Redux/actions/wishlistAction';
import { API_URI } from "../../../config";
import ImageMosaicLoader from "../Loader/ImageMosaicLoader";

export default function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [linkedProducts, setLinkedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [currentVariantId, setCurrentVariantId] = useState(null);

    const cartItems = useSelector(state => state.cart.items);
    const wishlistItems = useSelector(state => state.wishlist?.items || []);
    
    const isInWishlist = product ? wishlistItems.includes(product._id) : false;
    
    // Find the cart item for the current variant
    const cartItem = cartItems.find(item => 
        item.productId === currentVariantId || 
        item._id === currentVariantId || 
        item.id === currentVariantId
    );
    
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${API_URI}/plist/productlist/${productId}`);

                if (!response.data || !response.data.product) {
                    throw new Error('Product data is missing or invalid');
                }

                const mainProduct = response.data.product;
                const currentVariant = mainProduct.linkedProducts.find(
                    variant => variant._id === productId
                ) || mainProduct.linkedProducts[0];

                // Set the current variant ID
                setCurrentVariantId(currentVariant._id);

                setProduct({
                    _id: currentVariant._id,
                    mainProductId: mainProduct._id,
                    productId: currentVariant._id, // Ensure this matches the ID used in cart
                    name: currentVariant.name,
                    price: currentVariant.price,
                    images: currentVariant.images,
                    color: currentVariant.color,
                    colorCode: currentVariant.colorCode,
                    description: currentVariant.description,
                    category: mainProduct.category,
                    material: mainProduct.material
                });

                setSelectedImage(currentVariant.images[0]);

                const variants = mainProduct.linkedProducts.map(variant => ({
                    productId: variant._id, // Use variant ID as productId for cart
                    variantId: variant._id,
                    color: variant.color,
                    colorCode: variant.colorCode,
                    name: variant.name,
                    price: variant.price,
                    images: variant.images,
                    description: variant.description
                }));

                setLinkedProducts(variants);

            } catch (error) {
                console.error("Error fetching product details:", error);
                setError(error.message || 'Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    if (loading) return <ImageMosaicLoader />;
    if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
    if (!product) return <div className="text-center mt-20">Product not found</div>;

    const handleColorChange = (colorVariant) => {
        // Update the current variant ID when changing color
        setCurrentVariantId(colorVariant.variantId);
        
        setProduct(prev => ({
            ...prev,
            _id: colorVariant.variantId,
            productId: colorVariant.variantId,
            name: colorVariant.name,
            price: colorVariant.price,
            images: colorVariant.images,
            color: colorVariant.color,
            colorCode: colorVariant.colorCode,
            description: colorVariant.description
        }));
        
        setSelectedImage(colorVariant.images[0]);
        
        // Optionally, update URL to reflect the variant change
        navigate(`/product/${colorVariant.variantId}`, { replace: true });
    };

    const addToCartHandler = () => {
        if (product) {
            setIsAddingToCart(true);
            dispatch(addToCart({
                ...product,
                productId: product._id  // Ensure productId is set correctly
            }))
            .finally(() => {
                setIsAddingToCart(false);
            });
        }
    };

    const increaseQuantity = () => {
        if (cartItem) {
            const itemId = cartItem._id || cartItem.id || cartItem.productId;
            dispatch(updateQuantity(itemId, cartItem.quantity + 1));
        }
    };

    const decreaseQuantity = () => {
        if (cartItem) {
            const itemId = cartItem._id || cartItem.id || cartItem.productId;
            if (cartItem.quantity > 1) {
                dispatch(updateQuantity(itemId, cartItem.quantity - 1));
            } else {
                dispatch(removeItem(itemId));
            }
        }
    };

    const toggleWishlist = () => {
        if (!product) return;
        if (isInWishlist) {
            dispatch(removeFromWishlist(product._id));
        } else {
            dispatch(addToWishlist(product._id));
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex mt-20 bg-gray-100">
                {/* Left side - Images */}
                <div className="w-1/3 p-6">
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full h-96 object-cover rounded-lg mb-4"
                    />
                    <div className="flex space-x-2">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name}-${index}`}
                                className={`w-20 h-20 object-cover cursor-pointer border-2 rounded-md ${selectedImage === img ? "border-blue-500" : "border-transparent"
                                    }`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right side - Product details */}
                <div className="w-2/3 p-6 bg-white shadow-lg rounded-lg">
                    <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
                    <p className="text-xl text-gray-700 mb-2">₹{product.price.toFixed(2)}</p>
                    <p className="text-gray-600">{product.description}</p>

                    {/* Color variants */}
                    <div className="my-4">
                        <h2 className="text-lg font-semibold">Available Colors:</h2>
                        <div className="flex space-x-4 mt-2">
                            {linkedProducts.map((variant) => (
                                <div
                                    key={`${variant.variantId}-${variant.color}`}
                                    className="relative cursor-pointer group"
                                    onClick={() => handleColorChange(variant)}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full ${product.color === variant.color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                                            }`}
                                        style={{ backgroundColor: variant.colorCode }}
                                    />
                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                                        bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 
                                        transition-opacity duration-200 mb-2 whitespace-nowrap">
                                        {variant.color}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart and wishlist actions */}
                    <div className="flex space-x-4 my-4">
                        {quantityInCart > 0 ? (
                            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1 w-40">
                                <button
                                    onClick={decreaseQuantity}
                                    className="p-2 bg-orange-500 text-white rounded-l-lg hover:bg-orange-600 transition-colors duration-300"
                                    aria-label="Decrease quantity"
                                >
                                    <FaMinus className="w-3 h-3" />
                                </button>
                                <span className="flex-grow text-center font-semibold text-gray-800">
                                    {quantityInCart}
                                </span>
                                <button
                                    onClick={increaseQuantity}
                                    className="p-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors duration-300"
                                    aria-label="Increase quantity"
                                >
                                    <FaPlus className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <button
                                className={`px-4 py-2 ${isAddingToCart ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded transition duration-300 ease-in-out
                                    flex items-center justify-center gap-2
                                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
                                onClick={addToCartHandler}
                                disabled={isAddingToCart}
                            >
                                <FaShoppingCart className="inline-block mr-2" />
                                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                        )}
                        <button
                            className={`p-2 rounded-md ${isInWishlist ? "bg-red-500" : "bg-gray-500"} 
                                hover:scale-110 transition-transform duration-300`}
                            onClick={toggleWishlist}
                        >
                            <FaHeart className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}