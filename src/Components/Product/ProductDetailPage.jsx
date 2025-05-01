import { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa";
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
        
        // Update URL to reflect the variant change
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
    
    const goBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 pt-16 sm:pt-20 pb-8">
                <div className="container mx-auto px-4">
                    {/* Back button and wishlist in same row on mobile */}
                    <div className="flex justify-between items-center my-4">
                        <button 
                            onClick={goBack}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            <span>Back</span>
                        </button>
                        
                        {/* Wishlist button for mobile */}
                        <button
                            className={`md:hidden p-3 rounded-full shadow-md ${isInWishlist ? "bg-red-500" : "bg-white"} 
                                transition-all duration-300 flex items-center justify-center`}
                            onClick={toggleWishlist}
                            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <FaHeart className={`${isInWishlist ? "text-white" : "text-gray-500"} text-lg`} />
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Left side - Images */}
                            <div className="w-full lg:w-1/2 p-4">
                                <div className="aspect-square overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.map((img, index) => (
                                        <div 
                                            key={index}
                                            className={`aspect-square cursor-pointer border-2 rounded-md overflow-hidden
                                                ${selectedImage === img ? "border-orange-500" : "border-transparent"}`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name}-${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right side - Product details */}
                            <div className="w-full lg:w-1/2 p-4 md:p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h1 className="text-2xl md:text-3xl font-semibold">{product.name}</h1>
                                    
                                    {/* Wishlist button for desktop/tablet */}
                                    <button
                                        className={`hidden md:flex p-2 rounded-full ${isInWishlist ? "bg-red-500" : "bg-gray-200 hover:bg-gray-300"} 
                                            transition-all duration-300 items-center justify-center`}
                                        onClick={toggleWishlist}
                                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <FaHeart className={`${isInWishlist ? "text-white" : "text-gray-500"}`} />
                                    </button>
                                </div>
                                <p className="text-xl text-gray-700 mb-4">₹{product.price.toFixed(2)}</p>
                                
                                {/* Product description */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-medium mb-2">Description</h2>
                                    <p className="text-gray-600">{product.description}</p>
                                </div>
                                
                                {/* Product details */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-medium mb-2">Details</h2>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-gray-500">Category</div>
                                        <div>{product.category}</div>
                                        {product.material && (
                                            <>
                                                <div className="text-gray-500">Material</div>
                                                <div>{product.material}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Color variants */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-medium mb-2">Available Colors:</h2>
                                    <div className="flex flex-wrap gap-4">
                                        {linkedProducts.map((variant) => (
                                            <div
                                                key={`${variant.variantId}-${variant.color}`}
                                                className="relative cursor-pointer group"
                                                onClick={() => handleColorChange(variant)}
                                            >
                                                <div
                                                    className={`w-8 h-8 rounded-full 
                                                        ${product.color === variant.color ? 'ring-2 ring-offset-2 ring-orange-500' : ''}`}
                                                    style={{ backgroundColor: variant.colorCode }}
                                                />
                                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                                                    bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 
                                                    transition-opacity duration-200 mb-2 whitespace-nowrap z-10">
                                                    {variant.color}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cart actions */}
                                <div className="flex flex-wrap gap-4 items-center">
                                    {quantityInCart > 0 ? (
                                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1 w-32 sm:w-40">
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
                                                flex items-center justify-center gap-2 w-full sm:w-auto
                                                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
                                            onClick={addToCartHandler}
                                            disabled={isAddingToCart}
                                        >
                                            <FaShoppingCart className="inline-block mr-2" />
                                            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                    )}
                                    {/* Wishlist button is removed from here since it's now in the header sections */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}