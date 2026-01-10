import React, { useEffect, useState } from 'react';

const NoticesSection = () => {
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [dynamicData, setDynamicData] = useState({});
    const [fileData, setFileData] = useState({});
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({}); // To track validation errors

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
            // Enhance body background or modal background depending on request. 
            // For good UX, locking body scroll might be nice, but skipping for now.
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
            setMessage("Please fix the errors before submitting.");
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
                setMessage("Submission successful!");
                setTimeout(() => {
                    setMessage('');
                    setSelectedNotice(null);
                    setDynamicData({});
                    setFileData({});
                }, 2000);
            } else {
                setMessage("Submission failed. Try again.");
            }
        } catch (err) {
            console.log(err);
            setMessage("Error occurred.");
        }
    };

    if (notices.length === 0) return null;

    return (
        <section className="py-16 bg-blue-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Active Forms & Notices</h2>
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
                                <div className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 prose dark:prose-invert text-sm flex-1" dangerouslySetInnerHTML={{ __html: notice.content }} />

                                <div className="mt-auto pt-4 border-t dark:border-gray-600 flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">{new Date(notice.date).toLocaleDateString()}</span>
                                    <span className={`font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 ${notice.acceptingResponses === false ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                        {notice.acceptingResponses === false ? 'View Details' : 'Open Form'} <span>&rarr;</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Google Forms Style Modal */}
            {selectedNotice && (
                <div className="fixed inset-0 bg-gray-200 dark:bg-gray-900 bg-opacity-95 flex justify-center overflow-y-auto z-50 py-10"
                    style={{ fontFamily: selectedNotice.design?.fontFamily || 'Roboto' }}
                >
                    <div className="w-full max-w-2xl px-4 pb-20">
                        {/* Form Background Image Holder if exists */}
                        {selectedNotice.formBgImage && (
                            <div className="w-full h-40 md:h-60 rounded-t-lg bg-center bg-cover mb-4 shadow" style={{ backgroundImage: `url(${selectedNotice.formBgImage})` }}></div>
                        )}

                        {/* Header Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-t-8 mb-4 relative overflow-hidden"
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
                                    dangerouslySetInnerHTML={{ __html: selectedNotice.formTitle || selectedNotice.title }}
                                />
                                <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
                                    style={{
                                        fontSize: `${selectedNotice.design?.bodyFontSize || 11}pt`,
                                        fontWeight: selectedNotice.design?.bodyBold ? 'bold' : 'normal',
                                        fontStyle: selectedNotice.design?.bodyItalic ? 'italic' : 'normal'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: selectedNotice.formDescription || selectedNotice.content }}
                                />
                                <div className="mt-4 pt-4 border-t text-sm text-red-600 font-bold">* Indicates required question</div>
                            </div>
                        </div>

                        {selectedNotice.acceptingResponses === false ? (
                            <div className="bg-red-50 dark:bg-gray-800 p-8 rounded-lg border border-red-200 dark:border-red-900 text-center">
                                <h3 className="text-xl font-bold text-red-600 mb-2">Registrations are closed</h3>
                                <p className="text-gray-600 dark:text-gray-400">This event is no longer accepting responses.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRegister}>
                                {/* Standard Fields (Name/Email) if no custom fields, OR always? 
                                        User asked for google forms style. Usually name/email are just questions.
                                        If custom fields exist, we assume they include what's needed. If not, we show these.
                                    */}
                                {(!selectedNotice.formFields || selectedNotice.formFields.length === 0) && (
                                    <>
                                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4 border border-gray-200 dark:border-gray-700">
                                            <label className="block font-bold mb-4">Name <span className="text-red-500">*</span></label>
                                            <input type="text" required className="w-full border-b focus:border-purple-600 outline-none py-2 bg-transparent dark:text-white transition-colors border-gray-300 dark:border-gray-600"
                                                value={dynamicData['Name'] || ''} onChange={e => setDynamicData({ ...dynamicData, Name: e.target.value })} placeholder="Your answer"
                                            />
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4 border border-gray-200 dark:border-gray-700">
                                            <label className="block font-bold mb-4">Email <span className="text-red-500">*</span></label>
                                            <input type="email" required className="w-full border-b focus:border-purple-600 outline-none py-2 bg-transparent dark:text-white transition-colors border-gray-300 dark:border-gray-600"
                                                value={dynamicData['Email'] || ''} onChange={e => setDynamicData({ ...dynamicData, Email: e.target.value })} placeholder="Your answer"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedNotice.formFields && selectedNotice.formFields.map((field, idx) => (
                                    <div key={idx} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4 border border-gray-200 dark:border-gray-700 ${errors[field.label] ? 'border-red-500' : ''}`}>
                                        <div className="block font-medium mb-4 text-gray-900 dark:text-gray-100 prose dark:prose-invert max-w-none" style={{ fontSize: '11pt' }}>
                                            <div className="inline" dangerouslySetInnerHTML={{ __html: field.label }} />
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </div>

                                        {field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'url' ? (
                                            <input
                                                type={field.type}
                                                required={field.required}
                                                className="w-1/2 border-b focus:border-purple-600 outline-none py-2 bg-transparent dark:text-white transition-colors border-gray-300 dark:border-gray-600"
                                                placeholder="Your answer"
                                                value={dynamicData[field.label] || ''}
                                                onChange={e => setDynamicData({ ...dynamicData, [field.label]: e.target.value })}
                                            />
                                        ) : field.type === 'dropdown' ? (
                                            <select
                                                required={field.required}
                                                className="w-1/2 p-2 border rounded bg-transparent dark:text-white dark:border-gray-600"
                                                value={dynamicData[field.label] || ''}
                                                onChange={e => setDynamicData({ ...dynamicData, [field.label]: e.target.value })}
                                            >
                                                <option value="">Choose</option>
                                                {field.options && field.options.map((opt, i) => (
                                                    <option key={i} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : field.type === 'radio' ? (
                                            <div className="flex flex-col gap-3">
                                                {field.options && field.options.map((opt, i) => (
                                                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${dynamicData[field.label] === opt ? 'border-purple-600' : 'border-gray-400'}`}>
                                                            {dynamicData[field.label] === opt && <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>}
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
                                            <div>
                                                <input
                                                    type="file"
                                                    required={field.required}
                                                    className="block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded file:border 
                                                        file:text-sm file:font-semibold
                                                        file:bg-white file:text-purple-700
                                                        hover:file:bg-purple-50"
                                                    onChange={e => handleFileChange(field.label, e.target.files[0], field.fileValidation)}
                                                />
                                                {errors[field.label] && <p className="text-red-500 text-sm mt-2">⚠️ {errors[field.label]}</p>}
                                                {field.fileValidation && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Max size: {field.fileValidation.maxSizeInMB}MB.
                                                        {field.fileValidation.allowedTypes?.length > 0 && ` Types: ${field.fileValidation.allowedTypes.join(', ')}`}
                                                    </p>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}

                                <div className="flex justify-between items-center mt-6">
                                    <button type="submit" className="bg-purple-700 text-white px-8 py-2 rounded text-sm font-bold shadow hover:bg-purple-800 transition"
                                        style={{ backgroundColor: selectedNotice.design?.headerColor || '#673ab7' }}
                                    >
                                        Submit
                                    </button>
                                    <button type="button" onClick={() => { setDynamicData({}); setFileData({}); }} className="text-purple-700 font-bold text-sm hover:underline dark:text-purple-300">
                                        Clear form
                                    </button>
                                </div>
                                {message && <p className={`mt-4 font-bold text-center ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default NoticesSection;
