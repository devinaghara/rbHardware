import React from 'react';
import { Link } from 'react-router-dom';
import FeatureProductSlide from './FeatureProductSlide';
import Whyus from './Whyus';
import Facts from './Facts';
import Aboutus from './Aboutus';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen justify-center items-center pb-7 mt-12">
            <section className="pt-12 flex justify-center px-4 lg:px-8">
                <div className="container grid gap-4 px-4 md:px-6 lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="flex flex-col items-center lg:items-start justify-center space-y-4 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                            RB Hardware
                        </h1>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl">
                            Established in the year 1998, RB Hardware is engaged in manufacturing, supplying, and exporting a technically advanced range of stainless-steel Builder Hardware fittings for doors & windows. Our products are fabricated using superior quality raw material and components, which are procured from the authentic vendors of the industry. Finding application in diverse industries, the range that we export is widely known for its high-end features like excellent finish, dimensional accuracy, high tensile strength, corrosion resistance and durability.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-orange-500 text-white px-8 text-sm font-medium shadow transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Shop Now
                        </Link>
                    </div>
                    <img
                        src="https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722919884/r8zvidbktna8ilzamg7i.jpg"
                        width="800"
                        height="600"
                        alt="Hero Product"
                        className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
                    />
                </div>
            </section>
            <FeatureProductSlide />
            <Facts/>
            <Whyus/>
            <Aboutus/>
        </div>
    );
};

export default HomePage;
