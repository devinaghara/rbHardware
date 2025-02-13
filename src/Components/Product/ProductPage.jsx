import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../Redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '../../Redux/actions/wishlistAction';
import axios from 'axios';
import { API_URI } from "../../../config";
import ImageMosaicLoader from "../Loader/ImageMosaicLoader";
import ProductCard from './ProductCard';

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
    const wishlistItems = useSelector(state => state.wishlist?.items || []);

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

                const transformedProducts = productsRes.data.products.flatMap(product =>
                    product.linkedProducts.map(linkedProduct => ({
                        _id: product._id,
                        productId: product.productId,
                        category: product.category,
                        material: product.material,
                        ...linkedProduct
                    }))
                );

                setProducts(transformedProducts);
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

    const handleCategoryChange = (categoryName) => {
        setSelectedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleColorChange = (color) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
    };

    const handleMaterialChange = (material) => {
        setSelectedMaterials(prev =>
            prev.includes(material)
                ? prev.filter(m => m !== material)
                : [...prev, material]
        );
    };

    const toggleWishlist = (product) => {
        const variantId = product._id;
        if (wishlistItems.includes(variantId)) {
            dispatch(removeFromWishlist(variantId));
        } else {
            dispatch(addToWishlist(variantId));
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

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

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
        const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
        return categoryMatch && colorMatch && materialMatch;
    });

    if (loading) return <ImageMosaicLoader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex min-h-screen bg-gray-100 mt-20">
            {/* Filters Sidebar */}
            <aside className="w-64 bg-white p-6 shadow-md sticky top-20 h-screen overflow-y-auto">
                {/* Categories */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category._id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={category._id}
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => handleCategoryChange(category.name)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                />
                                <label htmlFor={category._id} className="text-gray-700 text-sm">{category.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Colors</h2>
                    <div className="space-y-2">
                        {colors.map((color) => (
                            <div key={color._id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={color._id}
                                    checked={selectedColors.includes(color.name)}
                                    onChange={() => handleColorChange(color.name)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                />
                                <label htmlFor={color._id} className="text-gray-700 text-sm">{color.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Materials */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Materials</h2>
                    <div className="space-y-2">
                        {materials.map((material) => (
                            <div key={material._id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={material._id}
                                    checked={selectedMaterials.includes(material.name)}
                                    onChange={() => handleMaterialChange(material.name)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                />
                                <label htmlFor={material._id} className="text-gray-700 text-sm">{material.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800">Products</h1>
                    
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={`${product._id}-${product.color}`}
                                    product={product}
                                    onProductClick={handleProductClick}
                                    onToggleWishlist={toggleWishlist}
                                    isWishlisted={wishlistItems.includes(product._id)}
                                    onAddToCart={handleAddToCart}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-500 text-lg">No products found matching the selected criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}