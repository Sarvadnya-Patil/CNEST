import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
                ? 'bg-white dark:bg-gray-950 shadow-md py-2'
                : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            C
                        </div>
                        <div className="flex flex-col text-gray-900 dark:text-white">
                            <span className="font-bold text-lg leading-tight">CNEST</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">KLE Technological University</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-baseline space-x-8">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${location.pathname === item.href
                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <DarkModeToggle />
                    </div>

                    <div className="-mr-2 flex md:hidden items-center gap-2">
                        <DarkModeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-950 shadow-xl absolute w-full top-full left-0 border-t border-gray-200 dark:border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.href
                                        ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
