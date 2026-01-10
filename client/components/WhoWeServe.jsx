import React from 'react';
import { Rocket, Lightbulb } from 'lucide-react';

const WhoWeServe = () => {
    return (
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                        Who Can Apply
                    </h2>
                </div>

                {/* Simple List */}
                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-xl border-l-4 border-blue-600 dark:border-blue-400 transition-colors duration-300">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Startups</h3>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border-l-4 border-indigo-600 dark:border-indigo-400 transition-colors duration-300">
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Students with Ideas</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhoWeServe;
