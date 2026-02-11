import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CustomDropdown from '../components/CustomDropdown';
import { useToast } from '../contexts/ToastContext';

const RegistrationPage = () => {
    const { noticeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();

    // Check if user came from a notice
    const fromNotice = location.state?.fromNotice;

    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dynamicData, setDynamicData] = useState({});
    const [fileData, setFileData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!noticeId) {
            navigate('/');
            return;
        }

        fetch(`/api/admin/notices/${noticeId}`)
            .then(res => {
                if (!res.ok) throw new Error("Notice not found");
                return res.json();
            })
            .then(data => {
                setNotice(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                addToast("Could not load registration form.", "error");
                navigate('/');
            });
    }, [noticeId, navigate]);

    const validateFile = (file, validationRules) => {
        if (!file) return null;
        if (!validationRules) return null;
        const { allowedTypes, maxSizeInMB } = validationRules;
        if (maxSizeInMB && file.size > maxSizeInMB * 1024 * 1024) {
            return `File size must be less than ${maxSizeInMB} MB`;
        }
        if (allowedTypes && allowedTypes.length > 0) {
            let isValidType = false;
            for (let type of allowedTypes) {
                if (type === file.type) isValidType = true;
                if (type.endsWith('/*') && file.type.startsWith(type.split('/')[0])) isValidType = true;
            }
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
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0) {
            addToast("Please fix the errors before submitting.", "error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', dynamicData['Name'] || 'Guest');
            formData.append('email', dynamicData['Email'] || 'guest@example.com');
            formData.append('event', notice.title);
            formData.append('noticeId', notice._id);

            Object.keys(dynamicData).forEach(key => {
                formData.append(key, dynamicData[key]);
            });

            Object.keys(fileData).forEach(key => {
                formData.append(key, fileData[key]);
            });

            const res = await fetch('/api/admin/registrations', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                addToast("Registration successful!", "success");
                setTimeout(() => navigate('/'), 2000);
            } else {
                addToast("Submission failed. Please try again.", "error");
            }
        } catch (err) {
            console.error(err);
            addToast("An error occurred during registration.", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-12 px-4 transition-colors duration-300"
            style={{ fontFamily: notice.design?.fontFamily || 'Roboto' }}>
            <div className="max-w-3xl mx-auto">
                {/* Back Link - Always visible for better navigation */}
                <button
                    onClick={() => {
                        if (fromNotice) navigate(-1);
                        else navigate('/');
                    }}
                    className="mb-8 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-bold flex items-center gap-2 transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Go Back
                </button>

                {/* Form Header Image */}
                {notice.formBgImage && (
                    <div className="w-full h-48 md:h-64 rounded-t-xl bg-center bg-cover shadow-lg mb-0"
                        style={{ backgroundImage: `url(${notice.formBgImage})` }}>
                    </div>
                )}

                {/* Main Content Card */}
                <div className={`bg-white dark:bg-gray-800 shadow-xl border-t-8 mb-6 overflow-hidden ${notice.formBgImage ? 'rounded-b-xl' : 'rounded-xl'}`}
                    style={{ borderTopColor: notice.design?.headerColor || '#673ab7' }}>
                    <div className="p-8">
                        <h1 className="font-bold mb-4 text-gray-900 dark:text-gray-50 prose dark:prose-invert max-w-none"
                            style={{
                                fontSize: `${notice.design?.titleFontSize || 24}pt`,
                                fontWeight: notice.design?.titleBold ? 'bold' : 'normal',
                                fontStyle: notice.design?.titleItalic ? 'italic' : 'normal'
                            }}
                            dangerouslySetInnerHTML={{ __html: notice.formTitle || notice.title }}
                        />
                        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none mb-4"
                            style={{
                                fontSize: `${notice.design?.bodyFontSize || 11}pt`,
                                fontWeight: notice.design?.bodyBold ? 'bold' : 'normal',
                                fontStyle: notice.design?.bodyItalic ? 'italic' : 'normal'
                            }}
                            dangerouslySetInnerHTML={{ __html: notice.formDescription || notice.content }}
                        />
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-red-600 font-bold">
                            * Indicates required question
                        </div>
                    </div>
                </div>

                {notice.acceptingResponses === false ? (
                    <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl border border-red-200 dark:border-red-800 text-center shadow-md">
                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Registrations are closed</h3>
                        <p className="text-gray-600 dark:text-gray-400">This event is no longer accepting responses.</p>
                    </div>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Standard Fields Fallback */}
                        {(!notice.formFields || notice.formFields.length === 0) && (
                            <>
                                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                                    <label className="block font-bold mb-4 text-gray-900 dark:text-gray-100">Name <span className="text-red-500">*</span></label>
                                    <input type="text" required className="w-full border-b focus:border-purple-600 outline-none py-2 bg-transparent dark:text-white transition-colors border-gray-300 dark:border-gray-600"
                                        value={dynamicData['Name'] || ''} onChange={e => setDynamicData({ ...dynamicData, Name: e.target.value })} placeholder="Your answer"
                                    />
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                                    <label className="block font-bold mb-4 text-gray-900 dark:text-gray-100">Email <span className="text-red-500">*</span></label>
                                    <input type="email" required className="w-full border-b focus:border-purple-600 outline-none py-2 bg-transparent dark:text-white transition-colors border-gray-300 dark:border-gray-600"
                                        value={dynamicData['Email'] || ''} onChange={e => setDynamicData({ ...dynamicData, Email: e.target.value })} placeholder="Your answer"
                                    />
                                </div>
                            </>
                        )}

                        {/* Custom Fields */}
                        {notice.formFields && notice.formFields.map((field, idx) => (
                            <div key={idx} className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all ${errors[field.label] ? 'border-red-500 ring-1 ring-red-500' : ''}`}>
                                <div className="block font-medium mb-4 text-gray-900 dark:text-gray-100 prose dark:prose-invert max-w-none" style={{ fontSize: '12pt' }}>
                                    <div className="inline" dangerouslySetInnerHTML={{ __html: field.label }} />
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </div>

                                {field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'url' ? (
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        className="w-full md:w-3/4 border-b focus:border-purple-600 outline-none py-2 bg-transparent dark:text-white transition-colors border-gray-300 dark:border-gray-600"
                                        placeholder="Your answer"
                                        value={dynamicData[field.label] || ''}
                                        onChange={e => setDynamicData({ ...dynamicData, [field.label]: e.target.value })}
                                    />
                                ) : field.type === 'dropdown' ? (
                                    <div className="w-full md:w-3/4">
                                        <CustomDropdown
                                            options={field.options ? field.options.map(opt => ({ label: opt, value: opt })) : []}
                                            value={dynamicData[field.label] || ''}
                                            onChange={val => setDynamicData({ ...dynamicData, [field.label]: val })}
                                            placeholder="Choose"
                                        />
                                    </div>
                                ) : field.type === 'radio' ? (
                                    <div className="flex flex-col gap-4 mt-2">
                                        {field.options && field.options.map((opt, i) => (
                                            <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${dynamicData[field.label] === opt ? 'border-purple-600' : 'border-gray-300 dark:border-gray-600 group-hover:border-purple-400'}`}>
                                                    {dynamicData[field.label] === opt && <div className="w-3 h-3 rounded-full bg-purple-600"></div>}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={field.label}
                                                    value={opt}
                                                    className="hidden"
                                                    required={field.required}
                                                    checked={dynamicData[field.label] === opt}
                                                    onChange={e => setDynamicData({ ...dynamicData, [field.label]: e.target.value })}
                                                />
                                                <span className="text-gray-800 dark:text-gray-200">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : field.type === 'file' ? (
                                    <div className="space-y-4">
                                        <input
                                            type="file"
                                            required={field.required}
                                            className="block w-full text-sm text-gray-500 cursor-pointer
                                                file:mr-4 file:py-2.5 file:px-6
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-bold
                                                file:bg-purple-100 file:text-purple-700
                                                hover:file:bg-purple-200 dark:file:bg-gray-700 dark:file:text-gray-200"
                                            onChange={e => handleFileChange(field.label, e.target.files[0], field.fileValidation)}
                                        />
                                        {errors[field.label] && <p className="text-red-500 text-sm animate-pulse">⚠️ {errors[field.label]}</p>}
                                        {field.fileValidation && (
                                            <div className="flex flex-wrap gap-2">
                                                <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">Max: {field.fileValidation.maxSizeInMB}MB</span>
                                                {field.fileValidation.allowedTypes?.length > 0 && field.fileValidation.allowedTypes.map(t => (
                                                    <span key={t} className="text-[10px] bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded text-purple-600 dark:text-purple-400 capitalize">{t.split('/')[1] || t}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        ))}

                        {/* Form Submission */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
                            <button
                                type="submit"
                                className="w-full md:w-auto px-12 py-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                style={{ backgroundColor: notice.design?.headerColor || '#673ab7' }}
                            >
                                Submit Registration
                            </button>
                            <button
                                type="button"
                                onClick={() => { setDynamicData({}); setFileData({}); setErrors({}); }}
                                className="text-gray-500 dark:text-gray-400 font-bold hover:underline transition-all"
                            >
                                Clear Form
                            </button>
                        </div>
                    </form>
                )}

                {/* Footer Copyright */}
                <div className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600">
                    &copy; {new Date().getFullYear()} CNEST. All rights reserved.
                </div>

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
            </div>
        </div>
    );
};

export default RegistrationPage;
