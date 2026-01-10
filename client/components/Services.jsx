import React from 'react';
import { SERVICES } from '../constants';

const Services = () => {
    return (
        <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase text-sm">What We Offer</span>
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Comprehensive Incubation Support
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                        From technical guidance to seed funding, we provide everything a budding entrepreneur needs to thrive.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SERVICES.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                <div className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">
                                    {service.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
