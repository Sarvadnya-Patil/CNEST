import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&q=80"
                    alt="Innovation and Entrepreneurship"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/70"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                <div className="sm:max-w-2xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 dark:bg-blue-400/20 text-blue-200 dark:text-blue-300 border border-blue-400/30 dark:border-blue-300/30 text-sm font-semibold mb-6 backdrop-blur-sm">
                        KLE Technological University
                    </span>
                    <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl mb-6">
                        Centre for Next Gen <span className="text-blue-400 dark:text-blue-300">Entrepreneurship</span> in Science & Technology
                    </h1>
                    <p className="mt-4 text-xl text-gray-300 dark:text-gray-200 mb-8 leading-relaxed">
                        Incubating the future of Belagavi. We provide the ecosystem, funding, and expertise to turn your scientific innovations into scalable enterprises.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                        >
                            Join CNEST
                            <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                        </Link>
                        <Link
                            to="/about"
                            className="inline-flex items-center justify-center px-8 py-3 border border-gray-400 dark:border-gray-300 text-base font-medium rounded-md text-gray-200 dark:text-gray-100 hover:text-white hover:border-white dark:hover:border-white transition-all duration-300 backdrop-blur-sm bg-white/5 dark:bg-white/10 transform hover:-translate-y-0.5"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
