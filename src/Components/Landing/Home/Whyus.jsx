import React from 'react';
import { FaUserTie, FaShieldAlt, FaDollarSign } from 'react-icons/fa';

const Whyus = () => {
    return (
        <div className="relative w-full bg-gray-100 py-20 flex items-center justify-center">
            <div className="relative flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto px-4 lg:pl-10 lg:pr-10 md:pl-10 md:pr-10">
                {/* Left Side Content */}
                <div className="relative flex-1 text-center md:text-left flex flex-col items-center md:items-start pl-6 md:pl-21 md:pr-11">
                    {/* Vertical Orange Line */}
                    <div className="absolute hidden md:block w-1 bg-orange-500 h-full top-0 left-0 -translate-x-4"></div>
                    <div className="relative z-10 text-justify">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Why Us ?
                        </h1>
                        <p className="mb-6 text-lg">
                            Renowned for the best quality products, we have garnered a lot of trust from our esteemed patrons.
                            We provide customized solutions, achieving utmost client satisfaction by using the latest technology and high-grade raw materials.
                        </p>
                    </div>
                </div>

                {/* Right Side Content */}
                <div className="flex-1 mt-10 md:mt-0 text-center md:text-left md:pl-11">
                    <h2 className="text-2xl font-semibold text-orange-500 mb-8">
                        What We Do
                    </h2>
                    <ul className="space-y-4">
                        <li className="flex items-center justify-center md:justify-start mb-4">
                            <div className="mr-4 text-orange-500 text-2xl pb-10">
                                <FaUserTie />
                            </div>
                            <div className="flex flex-col text-center md:text-left">
                                <h3 className="text-lg font-semibold">Experienced and Trained Workforce</h3>
                                <p className="text-sm">Our team consists of highly skilled professionals with extensive training to ensure top-notch results for every product.</p>
                            </div>
                        </li>
                        <li className="flex items-center justify-center md:justify-start mb-4">
                            <div className="mr-4 text-orange-500 text-2xl pb-10">
                                <FaShieldAlt />
                            </div>
                            <div className="flex flex-col text-center md:text-left">
                                <h3 className="text-lg font-semibold">Optimum Quality</h3>
                                <p className="text-sm">We prioritize quality by adhering to rigorous standards and utilizing premium materials for the best outcomes.</p>
                            </div>
                        </li>
                        <li className="flex items-center justify-center md:justify-start mb-4">
                            <div className="mr-4 text-orange-500 text-2xl pb-10">
                                <FaDollarSign />
                            </div>
                            <div className="flex flex-col text-center md:text-left">
                                <h3 className="text-lg font-semibold">Cost Efficient Products</h3>
                                <p className="text-sm">Our solutions are designed to be cost-effective without compromising on quality, providing value for your investment.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Whyus;
