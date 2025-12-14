import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../Redux/actions/wishlistAction";
import axios from "axios";
import { API_URI } from "../../../config";
import ProductCard from "./ProductCard";
import { FilterSkeleton, ProductCardSkeleton } from "../Loader/SkeletonLoading";
import { FaFilter, FaTimes } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

export default function ProductPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  // ✅ Filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // ✅ Debounced filters (for performance)
  const [debouncedFilters, setDebouncedFilters] = useState({
    categories: [],
    colors: [],
    materials: [],
  });

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
    materials: true,
  });

  // ✅ FETCH PRODUCTS ONCE
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, colorsRes, materialsRes] =
          await Promise.all([
            axios.get(`${API_URI}/plist/productlist`),
            axios.get(`${API_URI}/categoryfilter/categories`),
            axios.get(`${API_URI}/colorfilter/colors`),
            axios.get(`${API_URI}/materialfilter/materials`),
          ]);

        const transformedProducts = productsRes.data.products.flatMap(
          (product) =>
            product.linkedProducts.map((linkedProduct) => ({
              _id: product._id,
              productId: product.productId,
              category: product.category,
              material: product.material,
              ...linkedProduct,
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

  // ✅ DEBOUNCE FILTER UPDATES (NO LAG)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        categories: selectedCategories,
        colors: selectedColors,
        materials: selectedMaterials,
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategories, selectedColors, selectedMaterials]);

  // ✅ CLOSE FILTER ON DESKTOP RESIZE
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setShowFilters(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ FILTER HANDLERS (MEMOIZED)
  const handleCategoryChange = useCallback((value) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }, []);

  const handleColorChange = useCallback((value) => {
    setSelectedColors((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }, []);

  const handleMaterialChange = useCallback((value) => {
    setSelectedMaterials((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
  }, []);

  // ✅ INSTANT FILTERING WITH useMemo
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        debouncedFilters.categories.length === 0 ||
        debouncedFilters.categories.includes(product.category);

      const colorMatch =
        debouncedFilters.colors.length === 0 ||
        debouncedFilters.colors.includes(product.color);

      const materialMatch =
        debouncedFilters.materials.length === 0 ||
        debouncedFilters.materials.includes(product.material);

      return categoryMatch && colorMatch && materialMatch;
    });
  }, [products, debouncedFilters]);

  // ✅ WISHLIST
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

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedColors.length +
    selectedMaterials.length;

  const FilterSection = ({
    title,
    items,
    selectedItems,
    handleChange,
    section,
  }) => (
    <div className="mb-6">
      <div
        className="flex justify-between items-center cursor-pointer mb-2"
        onClick={() => toggleSection(section)}
      >
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {expandedSections[section] ? (
          <IoMdArrowDropup className="text-gray-600 text-xl" />
        ) : (
          <IoMdArrowDropdown className="text-gray-600 text-xl" />
        )}
      </div>

      {expandedSections[section] && (
        <div className="space-y-2 pl-1 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div key={item._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.name)}
                onChange={() => handleChange(item.name)}
                className="h-5 w-5 rounded text-orange-500"
              />
              <label className="text-gray-700">{item.name}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] min-h-screen mt-20">
      {/* ✅ FILTER SIDEBAR */}
      <aside className="hidden lg:block w-72 p-6 sticky top-24 bg-white shadow-md rounded-xl h-fit">
        {loading ? (
          <FilterSkeleton />
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

            <button
              onClick={clearAllFilters}
              className="w-full mt-6 py-2 border rounded-lg text-orange-500 border-orange-500 hover:bg-orange-50"
            >
              Clear All
            </button>
          </>
        )}
      </aside>

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          ) : error ? (
            <p className="text-red-500">{error}</p>
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
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
