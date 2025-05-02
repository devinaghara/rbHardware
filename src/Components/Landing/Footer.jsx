import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-6 mt-auto w-full">
            <div className="w-full lg:w-6xl mx-auto bottom-0 px-4 sm:px-8 lg:px-14">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 lg:gap-0">
                    {/* Images and Text */}
                    <div className="flex flex-col w-full lg:w-[35rem]">
                        <img
                            src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1720939842/fdh6ybdhl5a5kvfqwiqv.png"
                            alt="First image"
                            className="max-w-full"
                        />
                        <p className="ml-0 sm:ml-2 mt-2 lg:mt-0">
                            Rajkot based hardware manufacturer RB Hardware (India) is
                            <br className="hidden sm:block" />
                            working on a game plan to emerge as a leading
                            <br className="hidden sm:block" />
                            national hardware brand.
                        </p>
                    </div>

                    {/* Company Info */}
                    <div className="flex flex-col text-left lg:text-right space-y-4 mt-4 lg:mt-0">
                        <div>
                            <h4 className="text-lg">Address</h4>
                            <p className="text-base">
                                Ankit Ind. Area, Plot no. 25
                                <br />
                                Near Rolex Rings,
                                Gondal Road,
                                <br />
                                Kotharia, Dist. Rajkot
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg">Contact</h4>
                            <p className="text-base">
                                Phone: +91 9824133099
                            </p>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-400 my-4" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
                    <p className="text-sm order-2 sm:order-1">
                        &copy; 2024 RB Hardware. All rights reserved
                    </p>

                    {/* Social Media Icons */}
                    <div className="flex items-center space-x-4 order-1 sm:order-2">
                        <a href="https://www.instagram.com/rbhardwareindia/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-white text-2xl" />
                        </a>
                        <a href="https://wa.me/c/917698100040" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="text-white text-2xl" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;