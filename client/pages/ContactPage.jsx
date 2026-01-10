import React from 'react';
import { MapPin, Mail, Building2, User, Phone, MessageSquare, Send } from 'lucide-react';

const ContactPage = () => {
    return (
        <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Contact Us
                    </h1>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Address</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">

                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">

                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div id="contact-form" className="mb-12 max-w-3xl mx-auto">
                    <div className="relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-10 border border-blue-100 dark:border-gray-700 transition-colors duration-300 overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 dark:bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                        <div className="relative">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Get in Touch</h2>
                                <p className="text-gray-600 dark:text-gray-400">We'd love to hear from you. Fill out the form below and we'll get back to you soon.</p>
                            </div>

                            <form className="space-y-6">
                                {/* Name Field */}
                                <div className="group">
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full px-5 py-4 bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                {/* Email and Phone Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full px-5 py-4 bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div className="group">
                                        <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            className="w-full px-5 py-4 bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                {/* Subject Field */}
                                <div className="group">
                                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        className="w-full px-5 py-4 bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 cursor-pointer"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="incubation">🚀 Incubation Inquiry</option>
                                        <option value="partnership">🤝 Partnership Opportunity</option>
                                        <option value="general">💬 General Inquiry</option>
                                        <option value="other">📋 Other</option>
                                    </select>
                                </div>

                                {/* Message Field */}
                                <div className="group">
                                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        className="w-full px-5 py-4 bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        placeholder="Tell us about your idea, project, or inquiry..."
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    Send Message
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </button>

                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                                    We typically respond within 24-48 hours
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto transition-colors duration-300">
                    <div className="p-6 bg-blue-900 dark:bg-blue-800 text-white">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">Our Location</h2>
                        </div>
                        <p className="text-blue-100 dark:text-blue-200 mt-2">
                            KLE Technological University's, Dr. M. S. Sheshgiri Campus<br />
                            Angol Main Rd, Udyambag, Belagavi, Karnataka 590006
                        </p>
                    </div>
                    <div className="aspect-[16/9] w-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.6901291080335!2d74.49383589678958!3d15.820284900000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf65ce55555555%3A0x9b70f622a9a0fb44!2sKLE%20Technological%20University&#39;s%2C%20Dr.%20M.%20S.%20Sheshgiri%20Campus!5e0!3m2!1sen!2sin!4v1767033188281!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="KLE Dr. M. S. Sheshgiri Campus Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
