import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="bg-black shadow-lg">
            <div className="w-6xl mx-16">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-7 items-center">
                        <div>
                            {/* Website Logo */}
                            <a href="#" className="flex items-center mx-0">
                                <img src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1720876353/kctpqz4endnkue8lgsz6.jpg" alt="Logo" className="h-16 w-auto object-contain" />
                            </a>
                        </div>
                        {/* Primary Navbar items */}
                        <div className="hidden md:flex items-center space-x-1">
                            <a href="#" className="py-6 px-4 text-white border-b-4 border-orange-500 text-lg font-semibold">Home</a>
                            <a href="#" className="py-6 px-4 text-white font-semibold hover:text-orange-500 text-lg transition duration-300">Products</a>
                            <a href="#" className="py-6 px-4 text-white font-semibold hover:text-orange-500 text-lg transition duration-300">Download</a>
                            <a href="#" className="py-6 px-4 text-white font-semibold hover:text-orange-500 text-lg transition duration-300">Contact Us</a>
                        </div>
                    </div>
                    {/* Secondary Navbar items */}
                    <div className="hidden md:flex items-center space-x-3 relative">
                        <a href="#" className="py-2 px-5 font-medium text-white rounded hover:bg-orange-500 hover:text-white transition duration-300 relative">
                            <FaShoppingCart className="text-xl" />
                            <span className="absolute top-0 right-0 inline-block w-6 h-6 text-center text-white bg-orange-500 rounded-full hover:bg-black">{cartCount}</span>
                        </a>
                        <div className="relative">
                            <CgProfile
                                className="h-8 w-8 rounded-full cursor-pointer text-white"
                                onClick={toggleDropdown}
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-20">
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-orange-500 hover:text-white hover:border rounded-lg">Log In</a>
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-orange-500 hover:text-white hover:border rounded-lg">Sign Up</a>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button className="outline-none mobile-menu-button" onClick={toggleMenu}>
                            <svg className="w-6 h-6 text-gray-500 hover:text-orange-500"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* mobile menu */}
            <div className={`mobile-menu ${isOpen ? '' : 'hidden'} bg-white`}>
                <ul>
                    <li className="active"><a href="#" className="block text-sm px-2 py-4 text-black bg-orange-500 font-semibold">Home</a></li>
                    <li><a href="#" className="block text-sm px-2 py-4 text-black hover:bg-orange-500 hover:text-white transition duration-300">Shop</a></li>
                    <li><a href="#" className="block text-sm px-2 py-4 text-black hover:bg-orange-500 hover:text-white transition duration-300">About</a></li>
                    <li><a href="#" className="block text-sm px-2 py-4 text-black hover:bg-orange-500 hover:text-white transition duration-300">Contact</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
