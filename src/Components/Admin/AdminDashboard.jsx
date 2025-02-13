import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSync, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { API_URI } from '../../../config';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm'; // Add this import
import ProductTable from './ProductTable';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();

    const emptyProductForm = {
        name: '',
        description: '',
        price: '',
        images: [],
        linkedProducts: [],
        color: '',
        colorCode: '',
        category: '',
        material: ''
    };

    const [productForm, setProductForm] = useState(emptyProductForm);

    const handleLogout = async () => {
        try {
            await axios.get(`${API_URI}/auth/logout`, { withCredentials: true });
            navigate("/login");
            console.log('User logged out');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleRefresh = () => {
        fetchAllData();
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
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
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setProductForm(emptyProductForm);
        setShowProductForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            ...product,
            linkedProducts: product.linkedProducts || []
        });
        setShowProductForm(true);
    };

    const handleCloseForm = () => {
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm(emptyProductForm);
    };

    const handleProductSubmit = async (productData) => {
        try {
            if (editingProduct) {
                // Format the data to match the backend expectations
                const formattedData = {
                    productId: productData.productId,
                    category: productData.category,
                    material: productData.material,
                    linkedProducts: productData.linkedProducts.map(product => ({
                        name: product.name,
                        price: parseFloat(product.price),
                        description: product.description,
                        color: product.color,
                        colorCode: product.colorCode,
                        images: product.images
                    }))
                };

                const response = await axios.put(
                    `${API_URI}/plist/productlist/${editingProduct._id}`,
                    formattedData,
                    { withCredentials: true }
                );

                if (response.data) {
                    // Update the local state with the new data
                    setProducts(products.map(p =>
                        p._id === editingProduct._id ? response.data.product : p
                    ));
                    // Fetch all data to ensure synchronization
                    await fetchAllData();
                    handleCloseForm();
                }
            } else {
                // Handle new product creation
                const response = await axios.post(
                    `${API_URI}/plist/addproduct`,
                    productData,
                    { withCredentials: true }
                );

                if (response.data) {
                    setProducts([...products, response.data.product]);
                    await fetchAllData();
                    handleCloseForm();
                }
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert(error.response?.data?.message || 'Failed to save product. Please check all required fields.');
        }
    };

    const handleFilterSubmit = async (type, data) => {
        try {
            if (type === 'category') {
                await axios.post(`${API_URI}/categoryfilter/categories`, data);
            } else if (type === 'color') {
                await axios.post(`${API_URI}/colorfilter/colors`, data);
            } else if (type === 'material') {
                await axios.post(`${API_URI}/materialfilter/materials`, data);
            }
            fetchAllData();
        } catch (error) {
            console.error(`Error saving ${type}:`, error);
        }
    };

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`${API_URI}/plist/productlist/${productId}`, {
                withCredentials: true
            });
            // Update local state after successful deletion
            setProducts(products.filter(p => p._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        }
    };

    const deleteItem = async (type, id) => {
        if (type === 'product') {
            await handleDelete(id);
            return;
        }

        try {
            if (type === 'category') {
                await axios.delete(`${API_URI}/categoryfilter/categories/${id}`, { withCredentials: true });
            } else if (type === 'color') {
                await axios.delete(`${API_URI}/colorfilter/colors/${id}`, { withCredentials: true });
            } else if (type === 'material') {
                await axios.delete(`${API_URI}/materialfilter/materials/${id}`, { withCredentials: true });
            }
            fetchAllData();
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <FaSync className="mr-2" />
                            Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="flex space-x-4 mb-6">
                    {['products', 'categories', 'colors', 'materials'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg ${activeTab === tab
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-orange-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Products</h2>
                                <button
                                    onClick={handleAddProduct}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center"
                                >
                                    <FaPlus className="mr-2" /> Add Product
                                </button>
                            </div>

                            {showProductForm && (
                                <ProductForm
                                    productForm={productForm}
                                    setProductForm={setProductForm}
                                    handleSubmit={handleProductSubmit}
                                    products={products}
                                    categories={categories}
                                    materials={materials}
                                    colors={colors}
                                    editingProduct={editingProduct}
                                    onClose={handleCloseForm}
                                />
                            )}

                            <ProductTable
                                products={products}
                                onEdit={handleEditProduct}
                                onDelete={(id) => deleteItem('product', id)}
                            />
                        </div>
                    )}

                    {(activeTab === 'categories' || activeTab === 'colors' || activeTab === 'materials') && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Manage {activeTab}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(activeTab === 'categories' ? categories :
                                    activeTab === 'colors' ? colors : materials).map(item => (
                                        <div key={item._id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                            <span>{item.name}</span>
                                            <div>
                                                <button
                                                    onClick={() => deleteItem(activeTab.slice(0, -1), item._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                {activeTab === 'categories' ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = {
                                                id: e.target.id.value.toLowerCase(),
                                                name: e.target.name.value
                                            };
                                            handleFilterSubmit('category', formData);
                                            e.target.reset();
                                        }}
                                        className="flex flex-col gap-2"
                                    >
                                        <input
                                            name="id"
                                            type="text"
                                            placeholder="Category ID (e.g., roller-latch)"
                                            className="border p-2 rounded"
                                        />
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Category Name"
                                            className="border p-2 rounded"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Add Category
                                        </button>
                                    </form>
                                ) : (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleFilterSubmit(activeTab.slice(0, -1), { name: e.target.name.value });
                                            e.target.reset();
                                        }}
                                        className="flex gap-2"
                                    >
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder={`New ${activeTab.slice(0, -1)} name`}
                                            className="border p-2 rounded flex-grow"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Add
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;