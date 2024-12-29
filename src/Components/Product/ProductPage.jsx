import { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../Redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '../../Redux/actions/wishlistAction';
import axios from 'axios';
import { API_URI } from "../../../config";
import ImageMosaicLoader from "../Loader/ImageMosaicLoader";

export default function ProductPage() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlistItems = useSelector(state => state.wishlist.items);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes, colorsRes, materialsRes] = await Promise.all([
                    axios.get(`${API_URI}/plist/productlist`),
                    axios.get(`${API_URI}/categoryfilter/categories`),
                    axios.get(`${API_URI}/colorfilter/colors`),
                    axios.get(`${API_URI}/materialfilter/materials`)
                ]);

                setProducts(productsRes.data.products);
                setCategories(categoriesRes.data);
                setColors(colorsRes.data);
                setMaterials(materialsRes.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Rest of your existing component code remains the same...
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
        navigate(`/product/${productId}`);
    };

    const filteredProducts = products.filter((product) => {
        const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(product.category) : true;
        const colorMatch = selectedColors.length > 0 ? selectedColors.includes(product.color) : true;
        const materialMatch = selectedMaterials.length > 0 ? selectedMaterials.includes(product.material) : true;
        return categoryMatch && colorMatch && materialMatch;
    });

    if (loading) return <ImageMosaicLoader />;
    if (error) return <div>Error: {error}</div>;

    const handleAddToCart = (product) => {
        const normalizedProduct = {
            id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            images: product.images,
            quantity: 1,
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
                    <div key={category._id} className="flex items-center space-x-2 mb-2">
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
                    <div key={color._id} className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            id={color.name}
                            checked={selectedColors.includes(color.name)}
                            onChange={() => handleColorChange(color.name)}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor={color.name} className="text-gray-700">{color.name}</label>
                    </div>
                ))}
                <h2 className="text-xl font-semibold mt-6 mb-4">Materials</h2>
                {materials.map((material) => (
                    <div key={material._id} className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            id={material.name}
                            checked={selectedMaterials.includes(material.name)}
                            onChange={() => handleMaterialChange(material.name)}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor={material.name} className="text-gray-700">{material.name}</label>
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
                                    <div
                                        className="w-6 h-6 rounded-full mt-2"
                                        style={{ backgroundColor: product.colorCode }}
                                        title={product.color}
                                    />
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