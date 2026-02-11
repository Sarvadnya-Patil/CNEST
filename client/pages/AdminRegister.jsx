import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const AdminRegister = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [masterKey, setMasterKey] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showMasterKey, setShowMasterKey] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, masterKey })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                addToast("Registration Successful! Welcome to CNEST.", "success");
                // Auto-login: Save token and user info
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', data.username);

                // Redirect to dashboard after a short delay
                setTimeout(() => navigate('/admin'), 1500);
            } else {
                setError(data || "Registration failed");
                addToast(data || "Registration failed", "error");
            }
        } catch (err) {
            setError("Registration failed. Please try again.");
            addToast("Network error or server down", "error");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="p-8 bg-white dark:bg-gray-800 rounded shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Register New Admin</h2>

                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center text-sm">
                        Registration successful! Redirecting to login...
                    </div>
                )}

                {error && <p className="mb-4 text-red-500 text-sm text-center font-medium">{error}</p>}

                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Master Key</label>
                        <div className="relative">
                            <input
                                type={showMasterKey ? "text" : "password"}
                                required
                                placeholder="Required for registration"
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
                                value={masterKey}
                                onChange={(e) => setMasterKey(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => setShowMasterKey(!showMasterKey)}
                            >
                                {showMasterKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        >
                            Register and Login
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/login')}
                            className="w-full px-4 py-2 font-bold text-blue-600 border border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none transition"
                        >
                            Login Page
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center border-t pt-4 dark:border-gray-700">
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                    >
                        &larr; Back to Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
