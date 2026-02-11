import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const Toast = ({ id, message, type }) => {
    const { removeToast } = useToast();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        warning: <AlertTriangle className="text-yellow-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
        error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
        warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
        info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    };

    return (
        <div
            className={`flex items-center gap-3 p-4 mb-3 rounded-lg border shadow-lg transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                } ${bgColors[type] || bgColors.info} min-w-[300px] max-w-md`}
        >
            <div className="shrink-0">{icons[type] || icons.info}</div>
            <div className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                {message}
            </div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => removeToast(id), 300);
                }}
                className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export const ToastContainer = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </div>
    );
};

export default Toast;
