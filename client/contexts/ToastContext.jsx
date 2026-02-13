import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmData, setConfirmData] = useState(null); // { title, message, resolve }

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const askConfirm = useCallback((title, message) => {
        return new Promise((resolve) => {
            setConfirmData({ title, message, resolve });
        });
    }, []);

    const handleConfirm = useCallback((result) => {
        if (confirmData?.resolve) {
            confirmData.resolve(result);
        }
        setConfirmData(null);
    }, [confirmData]);

    return (
        <ToastContext.Provider value={{
            addToast,
            removeToast,
            toasts,
            askConfirm,
            confirmData,
            handleConfirm
        }}>
            {children}
        </ToastContext.Provider>
    );
};
