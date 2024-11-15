import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URI } from '../../../config';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const cartCount = useSelector((state) => state.cart.totalQuantity);

    // Check if user is logged in using axios
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${API_URI}/auth/me`, { withCredentials: true });
                // print(response)
                // console.log(response.body)
                if (response.status = 200) {
                    setIsLoggedIn(true);
                }
                else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                // console.error('Failed to check login status:', );
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogin = () => {
        navigate("/login");
    }

    const handleSignUp = () => {
        navigate("/signup");
    }

    const handleLogout = async () => {
        try {
            await axios.get('${API_URI}/auth/logout', { withCredentials: true });
            navigate("/login");
            console.log('User logged out');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isActive = (path) => {
        return location.pathname === path || (path === '/product' && location.pathname.startsWith('/product/'));
    };

    return (
        <nav className="bg-black shadow-lg fixed top-0 w-full z-50">
            <div className="w-6xl mx-16">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-7 items-center">
                        <div>
                            <a href="/" className="flex items-center mx-0">
                                <img src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1720876353/kctpqz4endnkue8lgsz6.jpg" alt="Logo" className="h-16 w-auto object-contain" />
                            </a>
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/" className={`py-6 px-4 text-lg font-semibold ${isActive('/') ? 'text-white border-b-4 border-orange-500' : 'text-white hover:text-orange-500 transition duration-300'}`}>Home</Link>
                            <Link to="/product" className={`py-6 px-4 text-lg font-semibold ${isActive('/product') ? 'text-white border-b-4 border-orange-500' : 'text-white hover:text-orange-500 transition duration-300'}`}>Products</Link>
                            <Link to="/download" className={`py-6 px-4 text-lg font-semibold ${isActive('/download') ? 'text-white border-b-4 border-orange-500' : 'text-white hover:text-orange-500 transition duration-300'}`}>Download</Link>
                            <Link to="/contactus" className={`py-6 px-4 text-lg font-semibold ${isActive('/contactus') ? 'text-white border-b-4 border-orange-500' : 'text-white hover:text-orange-500 transition duration-300'}`}>Contact Us</Link>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-3 relative">
                        <Link to="/cart" className="py-2 px-5 font-medium text-white rounded hover:bg-orange-500 hover:text-white transition duration-300 relative">
                            <FaShoppingCart className="text-xl" />
                            <span className="absolute top-0 right-0 inline-block w-6 h-6 text-center text-white bg-orange-500 rounded-full">{cartCount}</span>
                        </Link>
                        <div className="relative">
                            <CgProfile
                                className="h-8 w-8 rounded-full cursor-pointer text-white"
                                onClick={toggleDropdown}
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-20">
                                    {isLoggedIn ? (
                                        <>
                                            <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-orange-500 hover:text-white">Your Profile</Link>
                                            <Link to="/wishlist" className="block px-4 py-2 text-gray-800 hover:bg-orange-500 hover:text-white">Your Wishlist</Link>
                                            <Link to="/order" className="block px-4 py-2 text-gray-800 hover:bg-orange-500 hover:text-white">Your Order</Link>
                                            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-500 hover:text-white" onClick={handleLogout}>Logout</button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-orange-500 hover:text-white" onClick={handleLogin}>Sign In</Link>
                                            <Link to="/signup" className="block px-4 py-2 text-gray-800 hover:bg-orange-500 hover:text-white" onClick={handleSignUp}>Sign Up</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
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
            <div className={`mobile-menu ${isOpen ? '' : 'hidden'} bg-white`}>
                <ul>
                    <li><Link to="/" className={`block text-sm px-2 py-4 ${location.pathname === '/' ? 'text-black bg-orange-500 font-semibold' : 'text-black hover:bg-orange-500 hover:text-white transition duration-300'}`}>Home</Link></li>
                    <li><Link to="/product" className={`block text-sm px-2 py-4 ${location.pathname === '/product' ? 'text-black bg-orange-500 font-semibold' : 'text-black hover:bg-orange-500 hover:text-white transition duration-300'}`}>Shop</Link></li>
                    <li><Link to="/about" className={`block text-sm px-2 py-4 ${location.pathname === '/about' ? 'text-black bg-orange-500 font-semibold' : 'text-black hover:bg-orange-500 hover:text-white transition duration-300'}`}>About</Link></li>
                    <li><Link to="/contactus" className={`block text-sm px-2 py-4 ${location.pathname === '/contactus' ? 'text-black bg-orange-500 font-semibold' : 'text-black hover:bg-orange-500 hover:text-white transition duration-300'}`}>Contact</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
