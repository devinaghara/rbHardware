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

    const cartItems = useSelector(state => state.cart.items);
    const wishlistItems = useSelector(state => state.wishlist.items);
    const cartItem = cartItems.find(item => item.id === productId);
    const isInWishlist = wishlistItems.includes(productId);

    // Fetch product details from backend API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_URI}/plist/productlist/${productId}`);
                const fetchedProduct = {
                    ...response.data,
                    id: response.data._id // Normalize the id field
                };
                // const fetchedProduct = response.data;
                setProduct(fetchedProduct);
                setSelectedImage(fetchedProduct.images[0]);
                setSelectedColor(fetchedProduct.color);
            } catch (error) {
                console.error("Error fetching product details:", error);
                navigate("/product");
            }
        };

        fetchProduct();
    }, [productId, navigate]);

    if (!product) {
        return <ImageMosaicLoader/>;
    }

    const handleColorChange = (id) => {
        // const colorProduct = product.availableColors.find((item) => item.name === color);
        const colorProduct = product.availableColors.find((item) => item.productId === id);
        console.log(colorProduct);

        if (colorProduct) {
            setSelectedColor(colorProduct.name);
            navigate(`/product/${id}`);
            // navigate(`/product/${product._id}?color=${colorProduct.name}`);
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
                            {product.availableColors.map((colorObj) => (
                                <div
                                    key={colorObj.name}
                                    className={`cursor-pointer rounded-full h-8 w-8 ${selectedColor === colorObj.name ? "ring-4 ring-gray-400" : ""
                                        }`}
                                    style={{ backgroundColor: colorObj.colorCode }}
                                    onClick={() => handleColorChange(colorObj.productId)}
                                >
                                    <span className="sr-only">{colorObj.name}</span>
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