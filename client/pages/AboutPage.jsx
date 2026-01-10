import React from 'react';
import { Target, Eye, Compass, Calendar, Rocket, Award, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const timelineEvents = [
        {
            year: "",
            title: "",
            description: "",
            icon: Rocket,
            color: "blue"
        },
        {
            year: "",
            title: "",
            description: "",
            icon: Building2,
            color: "indigo"
        },
        {
            year: "",
            title: "",
            description: "",
            icon: Users,
            color: "purple"
        },
        {
            year: "",
            title: "",
            description: "",
            icon: Award,
            color: "pink"
        },
        {
            year: "",
            title: "",
            description: "",
            icon: Rocket,
            color: "orange"
        }
    ];

    return (
        <section className="pt-32 pb-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        About CNEST
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Centre for Next Gen Entrepreneurship in Science & Technology - Transforming Ideas into Impact
                    </p>
                </div>

                {/* Mission, Vision, Goal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-blue-100 dark:border-blue-900 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                            <Target className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            To identify, nurture, and scale innovative startups in science and technology by providing comprehensive support systems, funding, and mentorship that enables entrepreneurs to transform groundbreaking ideas into successful enterprises.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                            <Eye className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            To become the leading hub for entrepreneurial excellence in North Karnataka, driving economic growth through technological advancement and creating a sustainable ecosystem where innovation thrives and transforms communities.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-purple-100 dark:border-purple-900 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                            <Compass className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Goal</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            To incubate and graduate 50+ successful startups in the next 5 years, creating meaningful job opportunities, solving real-world problems, and establishing Belagavi as a nationally recognized innovation destination.
                        </p>
                    </div>
                </div>

                {/* Journey Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                            Our Journey
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            From inception to impact - witness the evolution of CNEST
                        </p>
                    </div>

                    {/* Vertical Timeline */}
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500"></div>

                        {/* Timeline Events */}
                        <div className="space-y-12">
                            {timelineEvents.map((event, index) => {
                                const Icon = event.icon;
                                const isEven = index % 2 === 0;

                                return (
                                    <div
                                        key={index}
                                        className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                                            } flex-col md:gap-8`}
                                    >
                                        {/* Content Card */}
                                        <div className={`w-full md:w-5/12 ${isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                                            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100 hover:shadow-2xl transition-all transform hover:scale-105">
                                                <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:justify-end' : 'md:justify-start'} justify-start`}>
                                                    <Calendar className="w-5 h-5 text-gray-500" />
                                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                                        {event.year}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                    {event.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {event.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Timeline Icon */}
                                        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-blue-500 shadow-lg flex items-center justify-center z-10">
                                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${event.color}-400 to-${event.color}-600 flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>

                                        {/* Spacer for desktop */}
                                        <div className="hidden md:block w-5/12"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Stats Banner */}
                <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-10 lg:p-16 flex flex-col justify-center">
                            <h3 className="text-3xl font-bold text-white mb-4">
                                Empowering Innovation at KLE Tech
                            </h3>
                            <p className="text-blue-100 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                                Situated at the prestigious KLE Technological University in Udyambagh, Belagavi, CNEST is building a thriving startup ecosystem. With government backing and world-class infrastructure, we're creating the foundation for entrepreneurial excellence in North Karnataka.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                                    <span className="block text-4xl font-bold text-white mb-1">₹10Cr+</span>
                                    <span className="text-blue-200 text-sm">Government Funding</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                                    <span className="block text-4xl font-bold text-white mb-1">2+</span>
                                    <span className="text-blue-200 text-sm">Incubated Startups</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                                    <span className="block text-4xl font-bold text-white mb-1">Govt</span>
                                    <span className="text-blue-200 text-sm">Recognized</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                                    <span className="block text-4xl font-bold text-white mb-1">50+</span>
                                    <span className="text-blue-200 text-sm">Target by 2030</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-64 lg:h-auto min-h-[400px]">
                            <img
                                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop"
                                alt="KLE Tech Campus"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent"></div>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center">
                    <Link
                        to="/contact"
                        className="inline-block px-10 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Get in Touch with Us
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;
