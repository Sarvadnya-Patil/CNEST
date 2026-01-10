import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import Gallery from './pages/Gallery';
import Careers from './pages/Careers';
import ContactPage from './pages/ContactPage';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return null;
}

const AppContent = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {!isAdmin && <Header />}
            <ScrollToTop />
            <main className="transition-opacity duration-300 ease-in-out">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
            </main>
            {!isAdmin && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <DarkModeProvider>
            <Router>
                <AppContent />
            </Router>
        </DarkModeProvider>
    );
};

export default App;
