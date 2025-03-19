import React, { useState, useEffect } from 'react';
import Navbar from '../Landing/Navbar';
import Footer from '../Landing/Footer';
import ContactPage from './ContactPage';
import ContactPageSkeleton from '../Loader/ContactPageSkeleton';

const ContactUs = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500); // Adjust time as needed
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Navbar />
            {loading ? <ContactPageSkeleton /> : <ContactPage />}
            <Footer />
        </>
    );
};

export default ContactUs;