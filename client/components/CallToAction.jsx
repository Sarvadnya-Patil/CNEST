import React from 'react';
import { MapPin, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Ready to Innovate */}
                    <div className="text-white">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                            Ready to Innovate?
                        </h2>
                        <p className="text-lg text-blue-100 dark:text-gray-300 mb-8 leading-relaxed">
                            Whether you have a breakthrough idea or an early-stage startup, CNEST is here to help you scale. Get in touch with us to apply for incubation or seed funding.
                        </p>

                        {/* Visit Us */}
                        <div className="mb-6">
                            <div className="flex items-start gap-3 mb-2">
                                <MapPin className="w-6 h-6 text-blue-300 dark:text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                                    <p className="text-blue-100 dark:text-gray-300 leading-relaxed">
                                        CNEST, CTIE Office<br />
                                        KLE Technological University<br />
                                        Udyambagh, Belgaum, Karnataka
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email Us */}
                        <div>
                            <div className="flex items-start gap-3">
                                <Mail className="w-6 h-6 text-blue-300 dark:text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Email Us</h3>
                                    <a
                                        href="mailto:contact@cnest.kle.edu"
                                        className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors"
                                    >
                                        contact@mail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Apply for Incubation */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
                            Apply for Incubation
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-center mb-8 text-lg">
                            Fill out our inquiry form and our team will get back to you with the next steps.
                        </p>

                        <Link
                            to="/contact#contact-form"
                            className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Join CNEST
                            <ExternalLink className="w-5 h-5" />
                        </Link>

                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-4">
                            *By clicking, you will be redirected to the contact form.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
