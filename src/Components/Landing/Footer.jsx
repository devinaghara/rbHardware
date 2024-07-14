import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
// import IndiaMARTLogo from './path-to-your-indiamart-logo.png'; // Ensure to replace with the correct path to your IndiaMART logo

const Footer = () => {
    return (
        <footer className="bg-black text-white py-6 mt-auto">
            <div className="w-6xl mx-auto bottom-0 px-14">
                <div className="flex justify-between items-center">
                    {/* Images and Text */}
                    <div className="flex flex-col w-[35rem]">
                        <img
                            src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1720939842/fdh6ybdhl5a5kvfqwiqv.png"
                            alt="First image"
                            className=""
                        />
                        <p className="ml-2">
                            Rajkot based hardware manufacturer RB Hardware (India) is
                            <br />
                            working on a game plan to emerge as a leading
                            <br />
                            national hardware brand.
                        </p>
                    </div>

                    {/* Company Info */}
                    <div className="flex flex-col text-right space-y-4">
                        <div>
                            <h4 className="text-lg">Address</h4>
                            <p className="text-base">
                                Ankit Ind. Area, Plot no. 25
                                <br />
                                B/H Gujarat Solvant, Near Rolex Baring
                                <br />
                                Gondal Road, Kotharia, Dist. Rajkot
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg">Contact</h4>
                            <p className="text-base">
                                Phone: +91 9824133099
                                <br />
                                Phone: +91 9890206131
                            </p>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-400 my-4" />
                <div className="flex justify-between items-center">
                    {/* Copyright Info */}
                    <p className="text-sm">
                        &copy; 2024 First Company. All rights reserved.
                    </p>

                    {/* Social Media Icons */}
                    <div className="flex items-center space-x-4">
                        <a href="https://www.instagram.com/rbhardwareindia?igsh=MWx5NDl5bjZzZ3Nydw==" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-white text-2xl" />
                        </a>
                        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="text-white text-2xl" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
