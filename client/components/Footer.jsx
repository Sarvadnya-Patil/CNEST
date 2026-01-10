import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white dark:text-gray-100 py-12 border-t border-gray-800 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">CNEST</h3>
                        <p className="text-gray-400 dark:text-gray-400 text-sm leading-relaxed">
                            Centre for Next Gen Entrepreneurship in Science & Technology
                        </p>
                        <div className="mt-4 text-gray-500 dark:text-gray-500 text-xs">
                            Under CTIE, KLE Technological University
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-200 dark:text-gray-200">Pages</h4>
                        <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400">
                            <li><Link to="/" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">About</Link></li>
                            <li><Link to="/gallery" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Gallery</Link></li>
                            <li><Link to="/careers" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-200 dark:text-gray-200">Contact</h4>
                        <ul className="space-y-3 text-sm text-gray-400 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-blue-400" />
                                <span>KLE Tech University, Dr. M.S. Sheshgiri Campus, Belagavi</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 flex-shrink-0 text-blue-400" />
                                <a href="mailto:aruntigadi.mss@kletech.ac.in" className="hover:text-blue-400 transition-colors">aruntigadi.mss@kletech.ac.in</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                                <a href="tel:+919886719354" className="hover:text-blue-400 transition-colors">+91 98867 19354</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-200 dark:text-gray-200">Government Funded</h4>
                        <p className="text-sm text-gray-400 dark:text-gray-400 leading-relaxed mb-3">
                            Supported by the Government of Karnataka with ₹10 Crores funding
                        </p>
                        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg text-center font-semibold text-sm">
                            Karnataka Innovation
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-500">
                    <p>&copy; {new Date().getFullYear()} CNEST - Centre for Next Gen Entrepreneurship in Science & Technology. All rights reserved.</p>
                    <p className="mt-2 text-xs">KLE Technological University, Belagavi, Karnataka</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
