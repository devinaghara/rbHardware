import { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Landing/Navbar";
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from '../../Redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '../../Redux/actions/wishlistAction';
import { API_URI } from "../../../config";
import ImageMosaicLoader from "../Loader/ImageMosaicLoader";

export default function ProductDetailPage() {
    const { productId } = useParams();  // Get product ID from URL
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [linkedProducts, setLinkedProducts] = useState([]);

    const cartItems = useSelector(state => state.cart.items);
    const wishlistItems = useSelector(state => state.wishlist.items);
    const cartItem = cartItems.find(item => item.id === productId);
    const isInWishlist = wishlistItems.includes(productId);

    // Fetch product details from backend API
    useEffect(() => {
        const fetchProductAndVariants = async () => {
            try {
                const response = await axios.get(`${API_URI}/plist/productlist/${productId}`);
                const fetchedProduct = response.data.product;
                setProduct(fetchedProduct);
                setSelectedImage(fetchedProduct.images[0]);
                setSelectedColor(fetchedProduct.color);

                // First, add current product to linked products array
                const currentProductColor = {
                    productId: fetchedProduct._id,
                    color: fetchedProduct.color,
                    colorCode: fetchedProduct.colorCode
                };

                // If there are linked products, fetch their details
                if (fetchedProduct.linkedProducts && fetchedProduct.linkedProducts.length > 0) {
                    try {
                        // Fetch all linked products' details
                        const linkedProductsPromises = fetchedProduct.linkedProducts.map(linkedId =>
                            axios.get(`${API_URI}/plist/productlist/${linkedId}`)
                        );
                        const linkedProductsResponses = await Promise.all(linkedProductsPromises);

                        // Extract and format linked products data
                        const linkedProductsData = linkedProductsResponses.map(response => ({
                            productId: response.data.product._id,
                            color: response.data.product.color,
                            colorCode: response.data.product.colorCode
                        }));

                        // Combine current product with linked products
                        setLinkedProducts([currentProductColor, ...linkedProductsData]);
                    } catch (error) {
                        console.error("Error fetching linked products:", error);
                    }
                } else {
                    // If no linked products, just set the current product
                    setLinkedProducts([currentProductColor]);
                }

            } catch (error) {
                console.error("Error fetching product details:", error);
                navigate("/product");
            }
        };

        fetchProductAndVariants();
    }, [productId, navigate]);


    if (!product) {
        return <ImageMosaicLoader />;
    }

    const handleColorChange = (id) => {
        if (id !== product._id) {
            navigate(`/product/${id}`);
        }
    };

    const addToCart = () => {
        if (product) {
            const cartProduct = {
                ...product,
                id: product._id, // Ensure we're using the MongoDB _id
                quantity: 1
            };
            dispatch(addItem(cartProduct));
        }
    };
    const removeFromCart = () => dispatch(removeItem(productId));
    const toggleWishlist = () => {
        if (isInWishlist) {
            dispatch(removeFromWishlist(productId));
        } else {
            dispatch(addToWishlist(productId));
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex mt-20 bg-gray-100">
                {/* Image section remains the same */}
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

                <div className="w-2/3 p-6 bg-white shadow-lg rounded-lg">
                    {/* Product details */}
                    <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
                    <p className="text-xl text-gray-700 mb-2">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600">{product.description}</p>

                    <div className="my-4">
                        <h2 className="text-lg font-semibold">Available Colors:</h2>
                        <div className="flex space-x-4 mt-2">
                            {linkedProducts.map((variant) => (
                                <div
                                    key={variant.productId}
                                    className={`relative cursor-pointer group`}
                                    onClick={() => handleColorChange(variant.productId)}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full ${product._id === variant.productId ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                                            }`}
                                        style={{ backgroundColor: variant.colorCode }}
                                    />
                                    {/* Color name tooltip */}
                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                    bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 mb-2 whitespace-nowrap">
                                        {variant.color}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

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