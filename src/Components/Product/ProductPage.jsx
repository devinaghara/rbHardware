import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../Redux/actions/wishlistAction';
import axios from 'axios';
import { API_URI } from "../../../config";
import ProductCard from './ProductCard';
import { FilterSkeleton, ProductCardSkeleton } from "../Loader/SkeletonLoading";
import { FaFilter, FaTimes } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

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
    const [showFilters, setShowFilters] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        colors: true,
        materials: true
    });
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

    // Close filter sidebar when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setShowFilters(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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

    const toggleFilterSidebar = () => {
        setShowFilters(!showFilters);
    };

    const closeFilters = () => {
        setShowFilters(false);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedColors([]);
        setSelectedMaterials([]);
    };

    const applyFilters = () => {
        // On mobile, we'll just close the filter panel when "Apply" is clicked
        closeFilters();
    };

    const activeFiltersCount = selectedCategories.length + selectedColors.length + selectedMaterials.length;

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
        const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
        return categoryMatch && colorMatch && materialMatch;
    });

    const FilterSection = ({ title, items, selectedItems, handleChange, section }) => (
        <div className="mb-6">
            <div 
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => toggleSection(section)}
            >
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                {expandedSections[section] ? 
                    <IoMdArrowDropup className="text-gray-600 text-xl" /> : 
                    <IoMdArrowDropdown className="text-gray-600 text-xl" />
                }
            </div>
            
            {expandedSections[section] && (
                <div className={`space-y-2 pl-1 overflow-y-auto max-h-48 ${items.length > 8 ? 'scrollbar-thin' : ''}`}>
                    {items.map((item) => (
                        <div key={item._id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={item._id}
                                checked={selectedItems.includes(item.name)}
                                onChange={() => handleChange(item.name)}
                                className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            />
                            <label htmlFor={item._id} className="text-gray-700">{item.name}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="relative flex flex-col lg:flex-row min-h-screen bg-gray-100 mt-20">
            {/* Mobile Filter Button */}
            <div className="lg:hidden sticky top-20 z-10 bg-white p-4 shadow-md">
                <button 
                    onClick={toggleFilterSidebar} 
                    className="flex items-center justify-center w-full py-2 bg-orange-500 text-white rounded-lg"
                >
                    <FaFilter className="mr-2" />
                    <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>
            </div>

            {/* Mobile Filter Overlay */}
            {showFilters && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden" onClick={closeFilters}></div>
            )}

            {/* Filters Sidebar - Desktop: side panel, Mobile: bottom sheet */}
            <aside 
                className={`
                    ${showFilters ? 'translate-y-0' : 'translate-y-full'} 
                    lg:translate-y-0 lg:translate-x-0
                    fixed 
                    lg:relative 
                    bottom-0 lg:bottom-auto 
                    left-0 right-0 lg:left-auto lg:right-auto
                    z-50 lg:z-0 
                    h-[70vh] lg:h-full 
                    w-full lg:w-64 
                    bg-white 
                    lg:p-6
                    shadow-md 
                    overflow-hidden
                    transition-transform duration-300 ease-in-out
                    lg:sticky lg:top-20
                    rounded-t-3xl lg:rounded-none
                `}
            >
                {/* Mobile filter header */}
                <div className="lg:hidden flex flex-col">
                    {/* Handle/drag indicator */}
                    <div className="w-full flex justify-center py-2 border-b border-gray-200">
                        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    
                    {/* Header with title and close button */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button 
                            onClick={closeFilters}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Filters content with sticky action buttons */}
                <div className="flex flex-col h-[calc(85vh-64px)] lg:h-auto">
                    {/* Scrollable filter content area */}
                    <div className="flex-1 p-4 lg:p-0 overflow-y-auto pb-20">
                        {loading ? (
                            <>
                                <FilterSkeleton />
                                <div className="mt-8">
                                    <FilterSkeleton />
                                </div>
                                <div className="mt-8">
                                    <FilterSkeleton />
                                </div>
                            </>
                        ) : (
                            <>
                                <FilterSection 
                                    title="Categories" 
                                    items={categories} 
                                    selectedItems={selectedCategories}
                                    handleChange={handleCategoryChange}
                                    section="categories"
                                />
                                
                                <FilterSection 
                                    title="Colors" 
                                    items={colors} 
                                    selectedItems={selectedColors}
                                    handleChange={handleColorChange}
                                    section="colors"
                                />
                                
                                <FilterSection 
                                    title="Materials" 
                                    items={materials} 
                                    selectedItems={selectedMaterials}
                                    handleChange={handleMaterialChange}
                                    section="materials"
                                />
                            </>
                        )}
                    </div>

                    {/* Sticky action buttons at bottom */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 flex border-t border-gray-200 p-4 bg-white shadow-md">
                        <button 
                            onClick={clearAllFilters}
                            className="flex-1 py-3 mr-2 border border-gray-300 rounded-lg font-medium"
                        >
                            Clear All
                        </button>
                        <button 
                            onClick={applyFilters}
                            className="flex-1 py-3 ml-2 bg-orange-500 text-white rounded-lg font-medium"
                        >
                            Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-800">
                        {loading ? 
                            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div> : 
                            "Products"
                        }
                    </h1>
                    
                    {/* Active filters display */}
                    {(selectedCategories.length > 0 || selectedColors.length > 0 || selectedMaterials.length > 0) && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {selectedCategories.map(cat => (
                                <span 
                                    key={cat} 
                                    className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center"
                                    onClick={() => handleCategoryChange(cat)}
                                >
                                    {cat}
                                    <FaTimes className="ml-1 cursor-pointer" />
                                </span>
                            ))}
                            {selectedColors.map(color => (
                                <span 
                                    key={color} 
                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                                    onClick={() => handleColorChange(color)}
                                >
                                    {color}
                                    <FaTimes className="ml-1 cursor-pointer" />
                                </span>
                            ))}
                            {selectedMaterials.map(material => (
                                <span 
                                    key={material} 
                                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center"
                                    onClick={() => handleMaterialChange(material)}
                                >
                                    {material}
                                    <FaTimes className="ml-1 cursor-pointer" />
                                </span>
                            ))}
                        </div>
                    )}
                    
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {loading ? (
                            // Skeleton loading for products
                            Array(6).fill(0).map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))
                        ) : error ? (
                            <div className="col-span-full text-center py-10">
                                <p className="text-red-500 text-lg">Error: {error}</p>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={`${product._id}-${product.color}`}
                                    product={product}
                                    onProductClick={handleProductClick}
                                    onToggleWishlist={toggleWishlist}
                                    isWishlisted={wishlistItems.includes(product._id)}
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