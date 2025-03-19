import React from 'react';
import Navbar from '../Landing/Navbar';
import ProductPage from './ProductPage';
import Footer from '../Landing/Footer';

const Product = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
                <ProductPage />
            </div>
            <Footer />
        </div>
    );
};

export default Product;