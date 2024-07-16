// src/components/ContactPage.js
import React from 'react';
import emailjs from 'emailjs-com';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const ContactPage = () => {
    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(service_7b5c1ei, template_it43k7o, e.target, )
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
        e.target.reset();
    };

    return (
        <div className="contact-us bg-white p-6 min-h-screen flex flex-col items-center">
            <div className="map-container w-full relative" style={{ height: '450px' }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d877.5864815371508!2d70.8046749!3d22.2371851!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb42d4bc14db%3A0x4f4bd9d85d47f80!2sRB%20Hardware%20(Madhav%20Industries)!5e1!3m2!1sen!2sin!4v1721049414642!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="contact-info bg-black text-white p-6 absolute top-0 left-0 mt-4 ml-4 shadow-lg rounded-lg">
                    <h2 className="text-2xl mb-4">Contact Information</h2>
                    <p><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> 1234 Street Name, City, State, 12345</p><br />
                    <p><FontAwesomeIcon icon={faEnvelope} className="mr-2" /> company@gmail.com</p><br />
                    <p><FontAwesomeIcon icon={faPhone} className="mr-2" /> (123) 456-7890</p>
                </div>
            </div>
            <div className="w-full flex justify-center mt-8">
                <div className="get-in-touch bg-gray-50 p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-black text-2xl mb-4">Get in Touch</h2>
                    <form onSubmit={sendEmail} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="user_name" required className="mt-1 block w-full px-4 py-2 bg-white shadow-inner rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="user_email" required className="mt-1 block w-full px-4 py-2 bg-white shadow-inner rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="user_phone" required className="mt-1 block w-full px-4 py-2 bg-white shadow-inner rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea name="message" required className="mt-1 block w-full px-4 py-2 bg-white shadow-inner rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"></textarea>
                        </div>
                        <div>
                            <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
