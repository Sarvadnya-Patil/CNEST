import React from 'react';
import { Target, Eye, Compass } from 'lucide-react';

const About = () => {
    return (
        <section id="about" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Who We Are
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                        Situated at the heart of Belgaum in Udyambagh, CNEST is a premier incubation center under CTIE, dedicated to fostering innovation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Mission */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            To identify, nurture, and scale innovative startups in science and technology by providing comprehensive support systems, funding, and mentorship.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-6">
                            <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Vision</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            To become the leading hub for entrepreneurial excellence in North Karnataka, driving economic growth through technological advancement.
                        </p>
                    </div>

                    {/* Goal */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                            <Compass className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Goal</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            To incubate and graduate 50+ successful startups in the next 5 years, creating job opportunities and solving real-world problems.
                        </p>
                    </div>
                </div>

                <div className="mt-16 bg-blue-900 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-10 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-4">Empowering Startups at KLE Tech</h3>
                            <p className="text-blue-100 mb-6">
                                We are just starting out, but our impact is already growing. With 2 companies successfully incubated, CNEST is laying the foundation for a vibrant startup ecosystem in Belagavi.
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-white">2+</span>
                                    <span className="text-blue-200 text-sm">Incubated Startups</span>
                                </div>
                                <div className="h-10 w-px bg-blue-700"></div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-white">Govt</span>
                                    <span className="text-blue-200 text-sm">Recognized</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-64 lg:h-auto">
                            <img
                                src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&q=80"
                                alt="KLE Tech Campus - Innovation Hub"
                                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                            />
                            <div className="absolute inset-0 bg-blue-900/40"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
