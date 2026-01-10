import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { CONTACT_LINK } from '../constants';

const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-blue-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                    <div className="p-10 md:p-16 md:w-1/2 text-white">
                        <h2 className="text-3xl font-bold mb-6">Ready to Innovate?</h2>
                        <p className="text-blue-100 mb-8 text-lg">
                            Whether you have a breakthrough idea or an early-stage startup, CNEST is here to help you scale. Get in touch with us to apply for incubation or seed funding.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <MapPin className="w-6 h-6 text-blue-400 mt-1 mr-4 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-white">Visit Us</h4>
                                    <p className="text-blue-200 mt-1">
                                        CNEST, CTIE Office<br />
                                        KLE Technological University<br />
                                        Udyambagh, Belagavi, Karnataka
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Mail className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-white">Email Us</h4>
                                    <p className="text-blue-200 mt-1">info@cnest.in</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-center text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Apply for Incubation</h3>
                        <p className="text-gray-600 mb-8">
                            Ready to join CNEST? Contact us to learn more about our incubation programs and support services.
                        </p>
                        <a
                            href={CONTACT_LINK}
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
                        >
                            Contact Us
                            <Mail className="ml-2 w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
