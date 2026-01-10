import React from 'react';
import { Award } from 'lucide-react';

const Achievements = () => {
    return (
        <section id="achievements" className="py-20 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-600 shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-black/5 rounded-full blur-3xl"></div>

                    <div className="relative px-8 py-16 md:p-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white backdrop-blur-sm mb-6">
                                <Award className="w-5 h-5 mr-2" />
                                <span className="font-semibold">Major Achievement</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                Empowered by ₹10 Crores Funding
                            </h2>
                            <p className="text-orange-50 text-lg md:text-xl max-w-2xl mb-8">
                                We are proud to announce that the Government of Karnataka has entrusted CNEST with significant funding to accelerate the growth of the startup ecosystem in our region.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                                    <span className="block text-2xl font-bold text-white">Govt of Karnataka</span>
                                    <span className="text-orange-100 text-sm">Supported By</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                                    <span className="block text-2xl font-bold text-white">Expanding</span>
                                    <span className="text-orange-100 text-sm">Our Reach</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 relative">
                            {/* Decorative visual for achievement */}
                            <div className="w-64 h-64 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-inner">
                                <div className="text-center">
                                    <span className="block text-6xl font-black text-white drop-shadow-md">₹10Cr</span>
                                    <span className="text-white font-medium tracking-widest uppercase mt-2">Grant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Achievements;
