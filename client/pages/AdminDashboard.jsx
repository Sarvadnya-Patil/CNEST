import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminDashboard = () => {
    const [notices, setNotices] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [activeTab, setActiveTab] = useState('notices');

    // Create Notice State
    const [newNotice, setNewNotice] = useState({
        title: '',
        content: '', // Short description for the card
        formTitle: '', // Title for the form modal
        formDescription: '', // Detailed description for the form
        noticeBgImage: '',
        formBgImage: '',
        design: {
            fontFamily: 'Roboto',
            headerColor: '#673ab7',
            titleFontSize: '24',
            titleBold: false,
            titleItalic: false,
            bodyFontSize: '11',
            bodyBold: false,
            bodyItalic: false
        }
    });
    const [formFields, setFormFields] = useState([]); // [{ label, type, required, options: [], fileValidation: { allowedTypes: [], maxSizeInMB: 10 } }]

    // View Registrations State
    const [selectedNoticeId, setSelectedNoticeId] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchNotices();
    }, [token, navigate]);

    // Fetch registrations whenever the selected event changes
    useEffect(() => {
        if (activeTab === 'registrations') {
            fetchRegistrations();
        }
    }, [activeTab, selectedNoticeId]);

    const fetchNotices = async () => {
        try {
            const res = await fetch('/api/admin/notices');
            const data = await res.json();
            setNotices(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRegistrations = async () => {
        try {
            let url = '/api/admin/registrations';
            if (selectedNoticeId) url += `?noticeId=${selectedNoticeId}`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setRegistrations(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Generic file upload to server
    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            return data.path; // returns relative path /uploads/filename
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    // Import Word for FORM Description
    const handleWordImportForm = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/parse-word', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            const plainText = data.content.replace(/<[^>]+>/g, '\n');
            setNewNotice({ ...newNotice, formDescription: plainText });
        } catch (err) {
            console.error(err);
        }
    };

    // Import Word for NOTICE Short Content
    const handleWordImportNotice = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/parse-word', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            const plainText = data.content.replace(/<[^>]+>/g, '\n');
            setNewNotice({ ...newNotice, content: plainText });
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateNotice = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newNotice, formFields };
            const res = await fetch('/api/admin/notices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setNewNotice({
                    title: '',
                    content: '',
                    formTitle: '',
                    formDescription: '',
                    noticeBgImage: '',
                    formBgImage: '',
                    design: {
                        fontFamily: 'Roboto',
                        headerColor: '#673ab7',
                        titleFontSize: '24',
                        titleBold: false,
                        titleItalic: false,
                        bodyFontSize: '11',
                        bodyBold: false,
                        bodyItalic: false
                    }
                });
                setFormFields([]);
                fetchNotices();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const addFormField = () => {
        setFormFields([...formFields, {
            label: '',
            type: 'text',
            required: true,
            options: [],
            fileValidation: { allowedTypes: [], maxSizeInMB: 10 }
        }]);
    };

    const updateFormField = (index, key, value) => {
        const updated = [...formFields];
        updated[index][key] = value;
        setFormFields(updated);
    };

    // For dropdown options
    const updateFieldOptions = (index, value) => {
        const updated = [...formFields];
        updated[index].options = value.split(',').map(s => s.trim());
        setFormFields(updated);
    }

    // For File Validation
    const updateFileValidation = (index, key, value) => {
        const updated = [...formFields];
        if (!updated[index].fileValidation) updated[index].fileValidation = { allowedTypes: [], maxSizeInMB: 10 };
        updated[index].fileValidation[key] = value;
        setFormFields(updated);
    }

    const toggleAllowedType = (index, type) => {
        const updated = [...formFields];
        const current = updated[index].fileValidation?.allowedTypes || [];
        if (current.includes(type)) {
            updated[index].fileValidation.allowedTypes = current.filter(t => t !== type);
        } else {
            updated[index].fileValidation.allowedTypes = [...current, type];
        }
        setFormFields(updated);
    }

    const removeFormField = (index) => {
        setFormFields(formFields.filter((_, i) => i !== index));
    };

    const handleDeleteNotice = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/notices/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchNotices();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleNoticeStatus = async (notice) => {
        try {
            const res = await fetch(`/api/admin/notices/${notice._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ acceptingResponses: notice.acceptingResponses === false ? true : false })
            });

            if (res.ok) {
                fetchNotices();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const downloadExcel = async () => {
        try {
            let url = '/api/admin/registrations/excel';
            if (selectedNoticeId) url += `?noticeId=${selectedNoticeId}`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const blob = await res.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlBlob;
            a.download = 'registrations.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error(err);
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    // Helper to get columns for the selected event
    const getColumns = () => {
        if (!selectedNoticeId) return ['Date', 'Event', 'Details']; // Generic view
        const notice = notices.find(n => n._id === selectedNoticeId);
        if (!notice || !notice.formFields || notice.formFields.length === 0) return ['Date', 'Event', 'Legacy/Generic Data'];

        return ['Date', ...notice.formFields.map(f => f.label)];
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
            </div>

            <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                <button
                    className={`pb-2 ${activeTab === 'notices' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                    onClick={() => setActiveTab('notices')}
                >
                    Notices & Forms
                </button>
                <button
                    className={`pb-2 ${activeTab === 'registrations' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                    onClick={() => setActiveTab('registrations')}
                >
                    Registrations
                </button>
            </div>

            {activeTab === 'notices' && (
                <div>
                    <form onSubmit={handleCreateNotice}>
                        {/* SECTION 1: Notice Card */}
                        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded shadow border-l-4 border-blue-500">
                            <h2 className="text-xl font-bold mb-4">Step 1: Public Notice Card</h2>
                            <p className="text-sm text-gray-500 mb-4">This is what appears on the Home Page.</p>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Event Title</label>
                                <ReactQuill
                                    theme="snow"
                                    value={newNotice.title}
                                    onChange={value => setNewNotice({ ...newNotice, title: value })}
                                    className="bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="flex gap-4 items-start mb-4">
                                <div className="w-full">
                                    <label className="block text-sm font-bold mb-1">Short Description</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={newNotice.content}
                                        onChange={value => setNewNotice({ ...newNotice, content: value })}
                                        className="bg-white dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="w-1/3 bg-blue-50 dark:bg-gray-700 p-3 rounded">
                                    <p className="text-xs font-bold mb-1">Import Word to Card</p>
                                    <input type="file" accept=".docx" onChange={handleWordImportNotice} className="block w-full text-xs text-gray-500
                                        file:mr-2 file:py-1 file:px-2
                                        file:rounded-full file:border-0
                                        file:text-xs file:font-semibold
                                        file:bg-blue-100 file:text-blue-700" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Card Background Image</label>
                                <input type="file" accept="image/*" onChange={async (e) => {
                                    const path = await handleFileUpload(e.target.files[0]);
                                    if (path) setNewNotice({ ...newNotice, noticeBgImage: path });
                                }} />
                                {newNotice.noticeBgImage && <p className="text-xs text-green-600">Uploaded</p>}
                            </div>
                        </div>

                        {/* SECTION 2: Form Configuration */}
                        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded shadow border-l-4 border-purple-500">
                            <h2 className="text-xl font-bold mb-4">Step 2: Registration Form</h2>
                            <p className="text-sm text-gray-500 mb-4">This opens when users click 'Register'.</p>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Form Title (Leave empty to use Event Title)</label>
                                <ReactQuill
                                    theme="snow"
                                    value={newNotice.formTitle}
                                    onChange={value => setNewNotice({ ...newNotice, formTitle: value })}
                                    className="bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-bold mb-1">Form Instructions / Description</label>
                                <div className="flex gap-4 items-start mb-2">
                                    <div className="w-full">
                                        <ReactQuill
                                            theme="snow"
                                            value={newNotice.formDescription || ''}
                                            onChange={value => setNewNotice({ ...newNotice, formDescription: value })}
                                            className="bg-white dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="w-1/3 bg-purple-50 dark:bg-gray-700 p-3 rounded">
                                        <p className="text-xs font-bold mb-1">Import Word to Form</p>
                                        <input type="file" accept=".docx" onChange={handleWordImportForm} className="block w-full text-xs text-gray-500
                                            file:mr-2 file:py-1 file:px-2
                                            file:rounded-full file:border-0
                                            file:text-xs file:font-semibold
                                            file:bg-purple-100 file:text-purple-700" />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-1">Form Header Background Image</label>
                                <input type="file" accept="image/*" onChange={async (e) => {
                                    const path = await handleFileUpload(e.target.files[0]);
                                    if (path) setNewNotice({ ...newNotice, formBgImage: path });
                                }} />
                                {newNotice.formBgImage && <p className="text-xs text-green-600">Uploaded</p>}
                            </div>

                            <div className="mb-6 p-4 border rounded bg-purple-50 dark:bg-gray-700 border-purple-200">
                                <h3 className="font-bold mb-3 text-purple-700 dark:text-purple-300">Theme & Design (Google Forms Style)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Header Color</label>
                                        <input type="color" className="w-full h-8"
                                            value={newNotice.design.headerColor}
                                            onChange={e => setNewNotice({ ...newNotice, design: { ...newNotice.design, headerColor: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Font Family</label>
                                        <select className="w-full p-1 border rounded text-sm"
                                            value={newNotice.design.fontFamily}
                                            onChange={e => setNewNotice({ ...newNotice, design: { ...newNotice.design, fontFamily: e.target.value } })}
                                        >
                                            <option value="Roboto">Roboto (Default)</option>
                                            <option value="Poppins">Poppins</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Georgia">Georgia</option>
                                            <option value="Courier New">Courier New</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Title Size</label>
                                        <select className="w-full p-1 border rounded text-sm"
                                            value={newNotice.design.titleFontSize}
                                            onChange={e => setNewNotice({ ...newNotice, design: { ...newNotice.design, titleFontSize: e.target.value } })}
                                        >
                                            <option value="18">Small (18pt)</option>
                                            <option value="24">Medium (24pt)</option>
                                            <option value="32">Large (32pt)</option>
                                            <option value="40">Huge (40pt)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Body Text Size</label>
                                        <select className="w-full p-1 border rounded text-sm"
                                            value={newNotice.design.bodyFontSize}
                                            onChange={e => setNewNotice({ ...newNotice, design: { ...newNotice.design, bodyFontSize: e.target.value } })}
                                        >
                                            <option value="9">Small (9pt)</option>
                                            <option value="11">Medium (11pt)</option>
                                            <option value="14">Large (14pt)</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block font-bold mb-2">Registration Form Fields:</label>
                                {formFields.map((field, index) => (
                                    <div key={index} className="mb-4 bg-gray-50 dark:bg-gray-900 p-3 rounded border dark:border-gray-600 shadow-sm relative pl-6 border-l-4" style={{ borderLeftColor: newNotice.design.headerColor }}>
                                        <div className="mb-2">
                                            <ReactQuill
                                                theme="snow"
                                                value={field.label}
                                                onChange={(value) => updateFormField(index, 'label', value)}
                                                className="bg-white dark:bg-gray-700 dark:text-white"
                                                modules={{
                                                    toolbar: [
                                                        [{ 'header': [1, 2, 3, false] }],
                                                        ['bold', 'italic', 'underline'],
                                                        ['link']
                                                    ]
                                                }}
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center mb-2">
                                            <select
                                                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                                value={field.type}
                                                onChange={e => updateFormField(index, 'type', e.target.value)}
                                            >
                                                <option value="text">Short Answer</option>
                                                <option value="number">Number</option>
                                                <option value="email">Email</option>
                                                <option value="url">Link</option>
                                                <option value="dropdown">Dropdown</option>
                                                <option value="radio">Multiple Choice (Radio)</option>
                                                <option value="file">File Upload</option>
                                            </select>
                                            <label className="flex items-center gap-1 text-sm font-bold ml-2">
                                                <input
                                                    type="checkbox"
                                                    checked={field.required}
                                                    onChange={e => updateFormField(index, 'required', e.target.checked)}
                                                />
                                                Required
                                            </label>
                                            <button type="button" onClick={() => removeFormField(index)} className="text-red-500 font-bold px-2 text-xl">&times;</button>
                                        </div>

                                        {/* Options for Dropdown/Radio */}
                                        {(field.type === 'dropdown' || field.type === 'radio') && (
                                            <div className="ml-4 mt-2">
                                                <label className="text-xs text-gray-500 font-bold uppercase">Options</label>
                                                <input
                                                    type="text"
                                                    placeholder="Option 1, Option 2, Option 3..."
                                                    className="w-full p-2 border-b border-gray-300 focus:border-blue-500 outline-none text-sm dark:bg-transparent dark:text-white"
                                                    value={field.options ? field.options.join(', ') : ''}
                                                    onChange={e => updateFieldOptions(index, e.target.value)}
                                                />
                                            </div>
                                        )}

                                        {/* File Validation Options */}
                                        {field.type === 'file' && (
                                            <div className="ml-4 mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-dashed border-gray-300">
                                                <label className="block text-xs text-gray-500 font-bold uppercase mb-2">File Upload Rules</label>
                                                <div className="flex gap-4 mb-2 flex-wrap">
                                                    {[
                                                        { label: 'PDF', types: ['application/pdf'] },
                                                        { label: 'Word Doc', types: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
                                                        { label: 'Image', types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] }
                                                    ].map(group => {
                                                        const isChecked = group.types.some(t => field.fileValidation?.allowedTypes?.includes(t));
                                                        return (
                                                            <label key={group.label} className="flex items-center gap-1 text-xs cursor-pointer">
                                                                <input type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        const currentTypes = field.fileValidation?.allowedTypes || [];
                                                                        let newTypes;
                                                                        if (e.target.checked) {
                                                                            // Add all types for this group
                                                                            newTypes = [...new Set([...currentTypes, ...group.types])];
                                                                        } else {
                                                                            // Remove all types for this group
                                                                            newTypes = currentTypes.filter(t => !group.types.includes(t));
                                                                        }
                                                                        updateFileValidation(index, 'allowedTypes', newTypes);
                                                                    }}
                                                                />
                                                                {group.label}
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold">Max Size:</span>
                                                    <select className="border rounded text-xs p-1"
                                                        value={field.fileValidation?.maxSizeInMB || 10}
                                                        onChange={e => updateFileValidation(index, 'maxSizeInMB', parseInt(e.target.value))}
                                                    >
                                                        <option value={1}>1 MB</option>
                                                        <option value={5}>5 MB</option>
                                                        <option value={10}>10 MB</option>
                                                        <option value={100}>100 MB</option>
                                                        <option value={1024}>1 GB</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addFormField} className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded">
                                    + Add Form Field
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Post Notice</button>
                    </form>

                    <div className="mt-12 border-t pt-8 dark:border-gray-700">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Active Notices</h2>
                        <div className="grid gap-4">
                            {notices.map(notice => (
                                <div key={notice._id} className="p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-start">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="font-bold text-lg mb-1 truncate" dangerouslySetInnerHTML={{ __html: notice.title }} />
                                        <div className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: notice.content }} />
                                        <div className="mt-2 text-xs text-gray-500">
                                            Fields: {notice.formFields?.map(f => f.label.replace(/<[^>]+>/g, '')).join(', ') || 'None'}
                                        </div>
                                        <span className="text-sm text-gray-500">{new Date(notice.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <label className="flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" checked={notice.acceptingResponses !== false} onChange={() => handleToggleNoticeStatus(notice)} />
                                                <div className={`block w-10 h-6 rounded-full ${notice.acceptingResponses !== false ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${notice.acceptingResponses !== false ? 'transform translate-x-4' : ''}`}></div>
                                            </div>
                                            <div className="ml-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {notice.acceptingResponses !== false ? 'Open' : 'Closed'}
                                            </div>
                                        </label>

                                        <button
                                            onClick={() => handleDeleteNotice(notice._id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
            }

            {
                activeTab === 'registrations' && (
                    <div>
                        <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded shadow">
                            <div className="flex items-center gap-4">
                                <label className="font-bold">Select Event:</label>
                                <select
                                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    value={selectedNoticeId}
                                    onChange={e => setSelectedNoticeId(e.target.value)}
                                >
                                    <option value="">-- All Registrations --</option>
                                    {notices.map(n => (
                                        <option key={n._id} value={n._id}>{n.title}</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={downloadExcel} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Download Excel
                            </button>
                        </div>

                        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
                            <table className="min-w-full text-left">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        {getColumns().map((col, i) => (
                                            <th key={i} className="p-4 border-b dark:border-gray-600">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map(reg => {
                                        const cols = getColumns();
                                        return (
                                            <tr key={reg._id} className="border-t border-gray-200 dark:border-gray-700">
                                                {cols.map((col, i) => {
                                                    if (col === 'Date') return <td key={i} className="p-4">{new Date(reg.createdAt).toLocaleDateString()}</td>;
                                                    // Check if it's a known generic field just in case
                                                    if (col === 'Event') return <td key={i} className="p-4">{reg.event}</td>;

                                                    // Dynamic fields from details
                                                    // Note: reg.details is where we store custom bits
                                                    const val = reg.details?.[col] || (reg[col.toLowerCase()] /* fallback for legacy name/email if label matches */) || '-';
                                                    return <td key={i} className="p-4">{val}</td>;
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {registrations.length === 0 && <p className="p-4 text-center text-gray-500">No registrations found.</p>}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminDashboard;
