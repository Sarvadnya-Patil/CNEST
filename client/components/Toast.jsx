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

export const ConfirmModal = () => {
    const { confirmData, handleConfirm } = useToast();

    if (!confirmData) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="text-yellow-500" size={32} />
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                        {confirmData.title || "Are you sure?"}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 px-2">
                        {confirmData.message || "This action cannot be undone. Please confirm to proceed."}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleConfirm(false)}
                            className="flex-1 px-6 py-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleConfirm(true)}
                            className="flex-1 px-6 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl shadow-lg shadow-red-500/30 transition-all transform active:scale-95"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ToastContainer = () => {
    const { toasts } = useToast();

    return (
        <>
            <ConfirmModal />
            <div className="fixed top-20 right-4 z-[9999] flex flex-col items-end pointer-events-none">
                <div className="pointer-events-auto">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Toast;
