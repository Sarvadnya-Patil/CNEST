import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomDropdown from './CustomDropdown';
import { useToast } from '../contexts/ToastContext';

const NoticesSection = () => {
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [modalView, setModalView] = useState('details'); // 'details' or 'form'
    const [dynamicData, setDynamicData] = useState({});
    const [fileData, setFileData] = useState({});
    const [errors, setErrors] = useState({}); // To track validation errors
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/admin/notices')
            .then(res => res.json())
            .then(data => setNotices(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedNotice) {
            setDynamicData({});
            setFileData({});
            setErrors({});
            setModalView('details'); // Reset to details view when opening
        }
    }, [selectedNotice]);

    const validateFile = (file, validationRules) => {
        if (!file) return null;
        if (!validationRules) return null;

        const { allowedTypes, maxSizeInMB } = validationRules;

        // Size validation
        if (maxSizeInMB && file.size > maxSizeInMB * 1024 * 1024) {
            return `File size must be less than ${maxSizeInMB} MB`;
        }

        // Type validation
        // allowedTypes contains mime types e.g. 'image/jpeg' or 'image/*'
        // For simplicity, we check precise matches or wildcards like 'image/'
        if (allowedTypes && allowedTypes.length > 0) {
            let isValidType = false;
            for (let type of allowedTypes) {
                if (type === file.type) isValidType = true;
                if (type.endsWith('/*') && file.type.startsWith(type.split('/')[0])) isValidType = true;
            }
            // Very loose word doc check due to complex mime types
            if (allowedTypes.some(t => t.includes('word')) && (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
                isValidType = true;
            }

            if (!isValidType) return `Allowed types: ${allowedTypes.map(t => t.split('/')[1] || t).join(', ')}`;
        }

        return null;
    };

    const handleFileChange = (fieldLabel, file, validationRules) => {
        const error = validateFile(file, validationRules);
        if (error) {
            setErrors(prev => ({ ...prev, [fieldLabel]: error }));
            setFileData(prev => {
                const newData = { ...prev };
                delete newData[fieldLabel];
                return newData;
            });
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldLabel];
                return newErrors;
            });
            setFileData(prev => ({ ...prev, [fieldLabel]: file }));
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        // Check for any remaining errors
        if (Object.keys(errors).length > 0) {
            addToast("Please fix the errors before submitting.", "error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', dynamicData['Name'] || 'Guest');
            formData.append('email', dynamicData['Email'] || 'guest@example.com');
            formData.append('event', selectedNotice.title);

            Object.keys(dynamicData).forEach(key => {
                formData.append(key, dynamicData[key]);
            });

            formData.append('noticeId', selectedNotice._id);

            Object.keys(fileData).forEach(key => {
                formData.append(key, fileData[key]);
            });

            const res = await fetch('/api/admin/registrations', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                addToast("Submission successful!", "success");
                setTimeout(() => {
                    setSelectedNotice(null);
                    setDynamicData({});
                    setFileData({});
                }, 1000);
            } else {
                addToast("Submission failed. Try again.", "error");
            }
        } catch (err) {
            console.log(err);
            addToast("Error occurred during submission.", "error");
        }
    };

    if (notices.length === 0) return null;

    return (
        <section className="py-16 bg-blue-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">Active Forms & Notices</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {notices.map(notice => (
                        <div
                            key={notice._id}
                            className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group cursor-pointer flex flex-col h-full"
                            onClick={() => setSelectedNotice(notice)}
                        >
                            {/* Card Image or Color Strip */}
                            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-600 shrink-0">
                                {notice.noticeBgImage ? (
                                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${notice.noticeBgImage})` }}
                                    ></div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 relative"
                                        style={{ borderTop: `8px solid ${notice.design?.headerColor || '#673ab7'}` }}
                                    >
                                        <span className="text-4xl opacity-20">📄</span>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
                                    </div>
                                )}

                                {/* Closed Badge (Overlaid on Image) */}
                                {notice.acceptingResponses === false && (
                                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow uppercase tracking-wide z-10">
                                        Closed
                                    </div>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2" dangerouslySetInnerHTML={{ __html: notice.title }} />
                                <div
                                    className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 prose dark:prose-invert text-sm flex-1"
                                    dangerouslySetInnerHTML={{
                                        __html: notice.shortDescription ||
                                            (notice.content?.replace(/<[^>]*>/g, '').substring(0, 100) + '...') ||
                                            'Click to view details'
                                    }}
                                />

                                <div className="mt-auto pt-4 border-t dark:border-gray-600 flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">{new Date(notice.date).toLocaleDateString()}</span>
                                    <span className={`font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 ${notice.acceptingResponses === false ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                        View Details <span>&rarr;</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2-Step Modal: Details View -> Form View */}
            {selectedNotice && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center overflow-y-auto z-50 py-10"
                    style={{ fontFamily: selectedNotice.design?.fontFamily || 'Roboto' }}
                >
                    <div className="w-full max-w-4xl px-4 pb-20">
                        {modalView === 'details' && (
                            /* Details View */
                            <>
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-t-8 mb-4 relative overflow-hidden"
                                    style={{ borderTopColor: selectedNotice.design?.headerColor || '#673ab7' }}>
                                    <button
                                        onClick={() => setSelectedNotice(null)}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold z-10"
                                    >
                                        &times;
                                    </button>
                                    <div className="p-8">
                                        <div className="font-bold mb-4 text-gray-900 dark:text-gray-50 prose dark:prose-invert max-w-none"
                                            style={{
                                                fontSize: `${selectedNotice.design?.titleFontSize || 24}pt`,
                                                fontWeight: selectedNotice.design?.titleBold ? 'bold' : 'normal',
                                                fontStyle: selectedNotice.design?.titleItalic ? 'italic' : 'normal'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: selectedNotice.title }}
                                        />
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                            {new Date(selectedNotice.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
                                            style={{
                                                fontSize: `${selectedNotice.design?.bodyFontSize || 11}pt`,
                                                fontWeight: selectedNotice.design?.bodyBold ? 'bold' : 'normal',
                                                fontStyle: selectedNotice.design?.bodyItalic ? 'italic' : 'normal'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: selectedNotice.content }}
                                        />

                                        {/* Register Button - Moved inside the card */}
                                        {selectedNotice.acceptingResponses && selectedNotice.formFields && selectedNotice.formFields.length > 0 && (
                                            <div className="mt-8">
                                                <button
                                                    onClick={() => navigate(`/register/${selectedNotice._id}`, { state: { fromNotice: true } })}
                                                    className="w-full bg-purple-700 hover:bg-purple-800 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                                    style={{ backgroundColor: selectedNotice.design?.headerColor || '#673ab7' }}
                                                >
                                                    {(selectedNotice.formTitle || "Open Registration Form").replace(/<[^>]*>/g, '')} <span>&rarr;</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .prose img, .prose iframe {
                    max-width: 100%;
                    height: auto !important;
                    border-radius: 4px;
                    display: block;
                    float: left;
                    margin-right: 15px;
                    margin-bottom: 10px;
                }
                
                .prose img[style*="float: right"], 
                .prose iframe[style*="float: right"] {
                    float: right !important;
                    margin-left: 15px !important;
                    margin-right: 0 !important;
                }
                
                .prose img[style*="float: none"], 
                .prose iframe[style*="float: none"] {
                    float: none !important;
                    margin: 20px auto !important;
                    display: block !important;
                }
            `}</style>
        </section>
    );
};

export default NoticesSection;
