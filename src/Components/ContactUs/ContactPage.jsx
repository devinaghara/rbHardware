import React from 'react';
import emailjs from 'emailjs-com';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import './styles.css'; // Import custom styles for Google Font

const ContactPage = () => {
    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_7b5c1ei', 'template_it43k7o', e.target, '--l-iS7BKmk7F5suy')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
        e.target.reset();
    };

    return (
        <div className="contact-us bg-gray-100 p-6 min-h-screen flex flex-col items-center">
            <div className="w-full flex flex-col items-center mb-8">
                <h2 className="custom-font text-4xl font-bold text-center w-11/12 lg:w-8/12 relative mb-4 text-orange-500">
                    Get In Touch
                    <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-8/12 underline-primary"></span>
                    <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-6/12 underline-secondary"></span>
                </h2>
                <br />
                <div className="w-full" style={{ height: '450px' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d877.5864815371508!2d70.8046749!3d22.2371851!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb42d4bc14db%3A0x4f4bd9d85d47f80!2sRB%20Hardware%20(Madhav%20Industries)!5e1!3m2!1sen!2sin!4v1721049414642!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            <div className="w-full max-w-4xl bg-slate-50 shadow-md rounded-lg p-6 mt-6">
                <div className="flex flex-col lg:flex-row mb-8">
                    <div className="w-full lg:w-1/2 flex flex-col items-start justify-center mb-8 lg:mb-0 lg:pr-8">
                        <h2 className="custom-font text-2xl font-bold mb-6 relative">
                            Contact Information
                            <span className="absolute left-0 bottom-0 w-11/12 underline-primary"></span>
                        </h2>
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-500 mr-3 text-xl" />
                            <span className="text-lg">Ankit Ind. Area, Plot no. 25 Near Rolex Rings, Rajkot.</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faEnvelope} className="text-orange-500 mr-3 text-xl" />
                            <span className="text-lg">info@company.com</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faPhone} className="text-orange-500 mr-3 text-xl" />
                            <span className="text-lg">+91 9824133099</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <FontAwesomeIcon icon={faPhone} className="text-orange-500 mr-3 text-xl" />
                            <span className="text-lg">+91 9890206131</span>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <h2 className="custom-font text-2xl font-bold mb-6 relative">
                            Send Us a Message
                            <span className="absolute left-0 bottom-0 w-6/12 underline-primary"></span>
                        </h2>
                        <form onSubmit={sendEmail} className="flex flex-col space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                className="p-3 border border-gray-300 rounded-md"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                className="p-3 border border-gray-300 rounded-md"
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Your Phone Number"
                                className="p-3 border border-gray-300 rounded-md"
                                required
                            />
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                className="p-3 border border-gray-300 rounded-md"
                                rows="5"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                className="bg-orange-600 text-white p-3 rounded-md hover:bg-orange-500 transition duration-300"
                            >
                                Send Inquiry
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
