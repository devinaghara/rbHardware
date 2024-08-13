import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div 
            onClick={onClick}
            style={{
                ...arrowStyle,
                left: '10px'
            }}
        >
            &#10094;
        </div>
    );
};

const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div 
            onClick={onClick}
            style={{
                ...arrowStyle,
                right: '10px'
            }}
        >
            &#10095;
        </div>
    );
};

const arrowStyle = {
    color: 'black',
    fontSize: '30px',
    cursor: 'pointer',
    zIndex: 1,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)'
};

const categories = [
    {
        id: 1,
        name: "Lockbody",
        description: "Lockbody",
        products: [
            { id: 1, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576849/combine_photos/ceq8yubolpu9xojzpb62.jpg" },
            { id: 2, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576894/combine_photos/t2hokvnamuj5hyhyphdw.jpg" },
            { id: 3, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576891/combine_photos/rbjco8arya0cfbqjbrnu.jpg" },
            { id: 4, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576846/combine_photos/ge132wvsj3vns6zllrpr.jpg" },
            { id: 5, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576840/combine_photos/lvfxmo3kr2sg8ir72lan.jpg" },
            { id: 6, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576836/combine_photos/cxakjzb6hk1hw7z1niy0.jpg" },
        ]
    },
    {
        id: 2,
        name: "Round Mortise Handle (Stainless Steel)",
        description: "Round Mortise Handle (Stainless Steel)",
        products: [
            { id: 1, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576874/combine_photos/fiv7nr4apk1eqajfazpr.jpg" },
            { id: 2, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576891/combine_photos/dodi8t803ff5pqw96x9g.jpg" },
            { id: 3, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576877/combine_photos/stpamhyiedjflmemkbsj.jpg" },
            { id: 4, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576871/combine_photos/ndaymbi8smowhy3btbcu.jpg" },
        ]
    },
    {
        id: 3,
        name: "Square Mortise Handle (Stainless Steel)",
        description: "Square Mortise Handle (Stainless Steel)",
        products: [
            { id: 1, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576862/combine_photos/bviwfwojflydodbs0aj7.jpg" },
            { id: 2, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576842/combine_photos/h4ffnbqe5evk2g7drs05.jpg" },
            { id: 3, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576874/combine_photos/zmadicqtycujr6vzqz41.jpg" },
            { id: 4, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576866/combine_photos/kt5x6fmg5rvqnmz3iaoy.jpg" },
        ]
    },
    {
        id: 4,
        name: "Lock Cylinder",
        description: "Lock Cylinder",
        products: [
            { id: 1, imageUrl: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576890/combine_photos/tsavesnnyim2ewdnob4c.jpg" },
        ]
    },
];

const FeatureProductSlide = () => {
    const categorySettings = {
        infinite: true,
        dots: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 6000,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const productSettings = {
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    };
    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            style={{ maxWidth: '1450px' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Heading and Paragraph */}
            <div className="space-y-2 mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Featured Products
                </h2>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                    Discover our curated selection of the best products for your home, office, and lifestyle.
                </p>
            </div>

            <Slider {...categorySettings}>
                {categories.map(category => (
                    <motion.div
                        key={category.id}
                        className="mb-12"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-full bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col lg:flex-row" style={{ maxHeight: '450px' }}>
                            <div className="lg:w-1/2 overflow-hidden">
                                <Slider {...productSettings}>
                                    {category.products.map(product => (
                                        <motion.div
                                            key={product.id}
                                            className="p-2"
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img
                                                src={product.imageUrl}
                                                alt={`Product ${product.id}`}
                                                className="w-full"
                                                style={{ maxHeight: '100%' }}
                                            />
                                        </motion.div>
                                    ))}
                                </Slider>
                            </div>
                            <div className="lg:w-1/2 text-center mt-5 lg:text-left ml-10">
                                <h2 className="text-4xl font-bold relative mb-4 text-orange-500 inline-block">
                                    {category.name}
                                    <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-10/12 underline"></span>
                                    <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-8/12 underline"></span>
                                </h2>
                                <p className="text-gray-700 my-4">{category.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </Slider>
        </motion.div>
    );
};

export default FeatureProductSlide;
