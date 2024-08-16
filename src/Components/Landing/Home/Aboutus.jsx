import React from "react";

const AboutUs = () => {
    return (
        <div className="relative w-full py-12 bg-white text-black pl-16 pr-16">
            {/* Heading Section */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Us</h2>
                <p className="mt-4 text-lg md:text-xl lg:text-base xl:text-xl">
                    Discover our mission, values, and the team behind our success.</p>
            </div>

            {/* Content Section */}
            <div className="relative flex flex-col md:flex-row items-center">
                {/* Right Side Image */}
                <div className="md:w-1/2 w-full relative md:ml-8 flex justify-center md:justify-end">
                    <img
                        src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1723826638/gfvdvanne8ouo6w4pjur.jpg"
                        alt="About Us"
                        className="rounded-lg object-cover w-11/12 md:w-full h-auto"
                    />
                </div>

                {/* Left Side Content */}
                <div className="absolute z-10 top-4 md:static md:top-auto md:w-1/2 w-11/12 md:left-0 flex flex-col space-y-8 p-8 mt-8 md:mt-0 md:ml-[-50px]">
                    <div className="bg-black bg-opacity-80 shadow-lg rounded-lg p-6">
                        <h3 className="text-2xl font-semibold text-white mb-5">
                            How we make a <span className="text-orange-500">Difference.</span>
                        </h3>
                        <p className="text-base mb-6 text-white">
                            Our team shares our enthusiasm to reach the height of excellence through high quality range of products. Professionals working with us are highly qualified and hold immense experience in their respective domains. Our talented team of designers constantly works towards enhancing the product range with innovative designs. Our conscientious team members realize the importance of eliminating wastage through judicious use of our resources, and this helps us in minimizing cost and the price that we offer to our clients.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
