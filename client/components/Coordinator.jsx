import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Coordinator = () => {
    return (
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Meet Our Coordinator
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                        {/* Photo */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 mx-auto md:mx-0">
                                <img
                                    src="/api/placeholder/128/128"
                                    alt="Dr. Arun Sadanand Tigadi"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                Dr. Arun Sadanand Tigadi
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Associate Professor, ECE | Coordinator CTIE & AICTE IDEA LAB
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                With 15+ years of experience and a Ph.D. in Electrical & Electronics Engineering,
                                Dr. Tigadi leads CNEST in shaping the future of technology and entrepreneurship in North Karnataka.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                <a
                                    href="mailto:aruntigadi.mss@kletech.ac.in"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <Mail className="w-4 h-4" />
                                    aruntigadi.mss@kletech.ac.in
                                </a>
                                <a
                                    href="tel:+919886719354"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <Phone className="w-4 h-4" />
                                    +91 9886719354
                                </a>
                            </div>
                        </div>

                        {/* Contact Button */}
                        <div className="flex items-center justify-center md:justify-end">
                            <Link
                                to="/contact"
                                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Placeholder for more members */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">More team members coming soon...</p>
                </div>
            </div>
        </section>
    );
};

export default Coordinator;
