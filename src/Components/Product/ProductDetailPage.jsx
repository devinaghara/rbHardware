import { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Landing/Navbar";
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, updateQuantity } from '../../Redux/actions/cartActions';
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

    const cartItems = useSelector(state => state.cart.items);

    const wishlistItems = useSelector(state => state.wishlist?.items || []);
    // const isInWishlist = product ? (wishlistItems || []).includes(product.mainProductId) : false;
    const isInWishlist = product ? wishlistItems.includes(product._id) : false;
    // Update cart item finding logic to match with both id and color
    const cartItem = cartItems.find(item =>
        (item.id === product?._id || item._id === product?._id) &&
        item.color === product?.color
    );

    // console.log(product)

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

                console.log("Current variant id", currentVariant._id)

                setProduct({
                    _id: currentVariant._id,  // This will give you the variant ID like "678e81ee503cd72b13a19cbc"
                    mainProductId: mainProduct._id,  // Keep main product ID if needed
                    productId: mainProduct.productId,
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
                    productId: mainProduct._id,
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
        setProduct(prev => ({
            ...prev,
            ...colorVariant
        }));
        setSelectedImage(colorVariant.images[0]);
    };

    const addToCart = () => {
        if (product) {
            const cartProduct = {
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                images: product.images,
                color: product.color,
                colorCode: product.colorCode,
                material: product.material,
                category: product.category,
                quantity: 1
            };
            dispatch(addItem(cartProduct));
        }
    };

    const removeFromCart = () => {
        if (product && cartItem) {
            dispatch(updateQuantity(`${product._id}-${product.color}`, cartItem.quantity - 1));
        }
    };

    const toggleWishlist = () => {
        if (!product) return;
        if (isInWishlist) {
            dispatch(removeFromWishlist(product._id));  // Using variant ID
        } else {
            dispatch(addToWishlist(product._id));  // Using variant ID
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
                                    key={`${variant.productId}-${variant.color}`}
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
                        {cartItem ? (
                            <div className="flex items-center space-x-4">
                                <button
                                    className="bg-red-500 text-white p-2 rounded-md"
                                    onClick={removeFromCart}
                                >
                                    <FaMinus />
                                </button>
                                <span>{cartItem.quantity}</span>
                                <button
                                    className="bg-green-500 text-white p-2 rounded-md"
                                    onClick={addToCart}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        ) : (
                            <button
                                className="px-4 py-2 bg-orange-500 text-white rounded transition duration-300 ease-in-out hover:bg-orange-600"
                                onClick={addToCart}
                            >
                                <FaShoppingCart className="inline-block mr-2" />
                                Add to Cart
                            </button>
                        )}
                        <button
                            className={`p-2 rounded-md ${isInWishlist ? "bg-red-500" : "bg-gray-500"}`}
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