import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CustomPromptModal = ({ isOpen, onClose, onSubmit, title, placeholder, initialValue = '' }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
        }
    }, [isOpen, initialValue]);

    const textareaRef = React.useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(value);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                    <div className="flex flex-col">
                        <h3 className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight">{title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Paste your embed code or direct URL below</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all group"
                    >
                        <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="mb-6 relative group">
                        <textarea
                            ref={textareaRef}
                            autoFocus
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all dark:text-white min-h-[140px] max-h-[400px] overflow-y-auto scrollbar-thin resize-none text-[13px] leading-relaxed shadow-inner"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#94a3b8 transparent'
                            }}
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
                        >
                            Insert
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomPromptModal;
