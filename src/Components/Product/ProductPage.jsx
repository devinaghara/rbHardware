import { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../Redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '../../Redux/actions/wishlistAction';
import axios from 'axios';  // Import axios
import { API_URI } from "../../../config";
import ImageMosaicLoader from "../Loader/ImageMosaicLoader";

// Add all categories, colors, and materials
const categories = [
    { id: "round-mortise-handle", name: "Round Mortise Handle" },
    { id: "square-mortise-handle", name: "Square Mortise Handle" },
    { id: "lock-body", name: "Lock Body" },
    { id: "roller-body", name: "Roller Body" },
    { id: "baby-latch", name: "Baby Latch" },
    { id: "roller-latch", name: "Roller Latch" },
];

const colors = ["Matt", "Antique", "Jet Black", "Gold PVD", "Rose Gold PVD"];
const materials = ["Stainless Steel", "Brass", "Zinc"];

export default function ProductPage() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [products, setProducts] = useState([]);  // State to store fetched products
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);      // Error state
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlistItems = useSelector(state => state.wishlist.items);

    // Fetch products from backend using Axios
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true); // Start loading
                const response = await axios.get(`${API_URI}/plist/productlist`);  // Replace with your backend endpoint
                setProducts(response.data); // Store products in state
                setLoading(false); // Stop loading
            } catch (error) {
                setError(error.message); // Handle error
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleColorChange = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color)
                ? prev.filter((c) => c !== color)
                : [...prev, color]
        );
    };

    const handleMaterialChange = (material) => {
        setSelectedMaterials((prev) =>
            prev.includes(material)
                ? prev.filter((m) => m !== material)
                : [...prev, material]
        );
    };

    const toggleWishlist = (productId) => {
        if (wishlistItems.includes(productId)) {
            dispatch(removeFromWishlist(productId));
        } else {
            dispatch(addToWishlist(productId));
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`); // Navigate to the ProductDetailPage with the product ID
    };

    // Filter products based on selected criteria
    const filteredProducts = products.filter((product) => {
        const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(product.category) : true;
        const colorMatch = selectedColors.length > 0 ? selectedColors.includes(product.color) : true;
        const materialMatch = selectedMaterials.length > 0 ? selectedMaterials.includes(product.material) : true;
        return categoryMatch && colorMatch && materialMatch;
    });

    if (loading) {
        return <ImageMosaicLoader/>; // Display loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Display error state
    }

    const handleAddToCart = (product) => {
        // Create a normalized product object
        const normalizedProduct = {
            id: product._id, // Use _id from MongoDB as the id
            name: product.name,
            price: product.price,
            description: product.description,
            images: product.images,
            quantity: 1, // Initialize quantity
            color: product.color,
            material: product.material
        };
        dispatch(addItem(normalizedProduct));
    };

    return (
        <div className="flex min-h-screen bg-gray-100 mt-20">
            <aside className="w-64 bg-white p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            id={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor={category.id} className="text-gray-700">{category.name}</label>
                    </div>
                ))}
                <h2 className="text-xl font-semibold mt-6 mb-4">Colors</h2>
                {colors.map((color) => (
                    <div key={color} className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            id={color}
                            checked={selectedColors.includes(color)}
                            onChange={() => handleColorChange(color)}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor={color} className="text-gray-700">{color}</label>
                    </div>
                ))}
                <h2 className="text-xl font-semibold mt-6 mb-4">Materials</h2>
                {materials.map((material) => (
                    <div key={material} className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            id={material}
                            checked={selectedMaterials.includes(material)}
                            onChange={() => handleMaterialChange(material)}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor={material} className="text-gray-700">{material}</label>
                    </div>
                ))}
            </aside>

            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">Products</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-45 object-cover rounded-t-lg cursor-pointer"
                                    onClick={() => handleProductClick(product._id)}
                                />
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            className={`text-${wishlistItems.includes(product._id) ? "red-500" : "gray-500"}`}
                                            onClick={() => toggleWishlist(product._id)}
                                        >
                                            <FaHeart />
                                        </button>
                                        <button
                                            className="text-green-500"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <FaShoppingCart />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products found matching the selected criteria.</p>
                    )}
                </div>
            </main>
        </div>
    );
}