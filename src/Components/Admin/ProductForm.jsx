import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const COLOR_MAPPING = {
    'Jet Black': '#0a0a0a',
    'Antique': '#5e503f',
    'Matt': '#5e503f',
    'Gold PVD': '#ffd700',
    'Rose Gold PVD': '#b76e79'
};

const ProductForm = ({
    handleSubmit,
    categories,
    materials,
    onClose,
    editingProduct
}) => {
    const [mainProductData, setMainProductData] = useState({
        productId: '',
        category: '',
        material: '',
    });

    const [showLinkedProductForm, setShowLinkedProductForm] = useState(false);
    const [linkedProducts, setLinkedProducts] = useState([]);
    const [expandedForms, setExpandedForms] = useState([]);

    const [currentLinkedProduct, setCurrentLinkedProduct] = useState({
        name: '',
        price: '',
        description: '',
        color: '',
        colorCode: '',
        images: []
    });

    // Load existing data when editing
    useEffect(() => {
        if (editingProduct) {
            setMainProductData({
                productId: editingProduct.productId || '',
                category: editingProduct.category || '',
                material: editingProduct.material || ''
            });

            if (editingProduct.linkedProducts && editingProduct.linkedProducts.length > 0) {
                setLinkedProducts(editingProduct.linkedProducts);
                setExpandedForms(new Array(editingProduct.linkedProducts.length).fill(false));
                setShowLinkedProductForm(true);
            }
        }
    }, [editingProduct]);

    const handleColorChange = (e) => {
        const selectedColor = e.target.value;
        setCurrentLinkedProduct({
            ...currentLinkedProduct,
            color: selectedColor,
            colorCode: COLOR_MAPPING[selectedColor] || ''
        });
    };

    const handleMainProductSubmit = (e) => {
        e.preventDefault();
        setShowLinkedProductForm(true);
    };

    const handleLinkedProductAdd = () => {
        if (currentLinkedProduct.name && currentLinkedProduct.price) {
            setLinkedProducts([...linkedProducts, currentLinkedProduct]);
            setExpandedForms([...expandedForms, false]);
            setCurrentLinkedProduct({
                name: '',
                price: '',
                description: '',
                color: '',
                colorCode: '',
                images: []
            });
        }
    };

    const toggleFormExpansion = (index) => {
        const newExpandedForms = [...expandedForms];
        newExpandedForms[index] = !newExpandedForms[index];
        setExpandedForms(newExpandedForms);
    };

    const removeLinkedProduct = (index) => {
        const updatedProducts = linkedProducts.filter((_, i) => i !== index);
        const updatedExpanded = expandedForms.filter((_, i) => i !== index);
        setLinkedProducts(updatedProducts);
        setExpandedForms(updatedExpanded);
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();

        if (linkedProducts.length === 0) {
            alert('Please add at least one linked product');
            return;
        }

        const finalData = {
            productId: mainProductData.productId,
            category: mainProductData.category,
            material: mainProductData.material,
            linkedProducts: linkedProducts.map(product => ({
                name: product.name,
                price: parseFloat(product.price),
                images: product.images,
                color: product.color,
                colorCode: product.colorCode,
                description: product.description
            }))
        };

        if (!finalData.productId || !finalData.category || !finalData.material) {
            alert('Please fill in all main product fields');
            return;
        }

        const isValidLinkedProducts = finalData.linkedProducts.every(product =>
            product.name &&
            product.price &&
            Array.isArray(product.images) &&
            product.images.length > 0 &&
            product.color &&
            product.colorCode &&
            product.description
        );

        if (!isValidLinkedProducts) {
            alert('Please ensure all linked products have complete information');
            return;
        }

        handleSubmit(finalData);
    };

    const handleImageAdd = () => {
        setCurrentLinkedProduct({
            ...currentLinkedProduct,
            images: [...currentLinkedProduct.images, '']
        });
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...currentLinkedProduct.images];
        updatedImages[index] = value;
        setCurrentLinkedProduct({
            ...currentLinkedProduct,
            images: updatedImages
        });
    };

    const handleImageRemove = (index) => {
        const updatedImages = currentLinkedProduct.images.filter((_, i) => i !== index);
        setCurrentLinkedProduct({
            ...currentLinkedProduct,
            images: updatedImages
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    {!showLinkedProductForm && (
                        <form onSubmit={handleMainProductSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Product ID"
                                value={mainProductData.productId}
                                onChange={e => setMainProductData({ ...mainProductData, productId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={mainProductData.category}
                                    onChange={e => setMainProductData({ ...mainProductData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>

                                <select
                                    value={mainProductData.material}
                                    onChange={e => setMainProductData({ ...mainProductData, material: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Select Material</option>
                                    {materials.map(mat => (
                                        <option key={mat._id} value={mat.name}>{mat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                            >
                                Continue to Add Linked Products
                            </button>
                        </form>
                    )}

                    {showLinkedProductForm && (
                        <form onSubmit={handleFinalSubmit} className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="font-medium text-gray-700">Main Product Details</h3>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>Product ID: {mainProductData.productId}</p>
                                    <p>Category: {mainProductData.category}</p>
                                    <p>Material: {mainProductData.material}</p>
                                </div>
                            </div>

                            {linkedProducts.map((product, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg">
                                    <div
                                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                                        onClick={() => toggleFormExpansion(index)}
                                    >
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-500">${product.price}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeLinkedProduct(index);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                            {expandedForms[index] ? <ChevronUp /> : <ChevronDown />}
                                        </div>
                                    </div>
                                    {expandedForms[index] && (
                                        <div className="p-4 border-t border-gray-200">
                                            <div className="space-y-2">
                                                <p><span className="font-medium">Color:</span> {product.color}</p>
                                                <p><span className="font-medium">Color Code:</span> {product.colorCode}</p>
                                                <p><span className="font-medium">Description:</span> {product.description}</p>
                                                <div>
                                                    <p className="font-medium">Images:</p>
                                                    <ul className="list-disc list-inside">
                                                        {product.images.map((img, imgIndex) => (
                                                            <li key={imgIndex} className="text-sm text-gray-600">{img}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                <h4 className="text-lg font-medium text-gray-800">Add New Linked Product</h4>
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={currentLinkedProduct.name}
                                    onChange={e => setCurrentLinkedProduct({ ...currentLinkedProduct, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={currentLinkedProduct.price}
                                        onChange={e => setCurrentLinkedProduct({ ...currentLinkedProduct, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <select
                                        value={currentLinkedProduct.color}
                                        onChange={handleColorChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="">Select Color</option>
                                        {Object.keys(COLOR_MAPPING).map(color => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Color Code (hex)"
                                    value={currentLinkedProduct.colorCode}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                                />

                                <textarea
                                    placeholder="Description"
                                    value={currentLinkedProduct.description}
                                    onChange={e => setCurrentLinkedProduct({ ...currentLinkedProduct, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows="3"
                                />

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-medium text-gray-700">Images</h5>
                                        <button
                                            type="button"
                                            onClick={handleImageAdd}
                                            className="flex items-center space-x-1 bg-orange-500 text-white px-3 py-1.5 rounded-md hover:bg-orange-600 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span>Add Image</span>
                                        </button>
                                    </div>
                                    {currentLinkedProduct.images.map((image, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="url"
                                                value={image}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                                placeholder="Image URL"
                                                className="p-2 text-red-500 hover:text-red-700"
                                                />
                                            <button
                                                type="button"
                                                onClick={() => handleImageRemove(index)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLinkedProductAdd}
                                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                                >
                                    Add This Linked Product
                                </button>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                                >
                                    {editingProduct ? 'Update Product' : 'Save All Products'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductForm;