import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomEditor from '../components/CustomEditor';
import CustomDropdown from '../components/CustomDropdown';
import CustomFileInput from '../components/CustomFileInput';
import { useToast } from '../contexts/ToastContext';
import { PlusCircle, Trash2, Mail, User, Phone, Globe, Hash, List, FileUp, CheckCircle2, ChevronDown, ChevronUp, Link as LinkIcon, Copy } from 'lucide-react';

const AdminDashboard = () => {
    const [notices, setNotices] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [activeTab, setActiveTab] = useState('notices');

    // Create Notice State
    const [newNotice, setNewNotice] = useState({
        noticeContent: { title: '', shortDescription: '', content: '' }, // Segmented editor content
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
    const { addToast } = useToast();

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


    const handleCreateNotice = async (e) => {
        e.preventDefault();
        try {
            // Extract segmented content
            const { title, shortDescription, content } = newNotice.noticeContent;

            const payload = {
                ...newNotice,
                title,
                shortDescription,
                content,
                formFields
            };
            // Remove noticeContent from payload as it's not in the schema
            delete payload.noticeContent;

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
                    noticeContent: { title: '', shortDescription: '', content: '' },
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
                addToast("Notice created successfully!", "success");
            } else {
                addToast("Failed to create notice", "error");
            }
        } catch (err) {
            console.error(err);
            addToast("An error occurred while creating notice", "error");
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
            if (res.ok) {
                fetchNotices();
                addToast("Notice deleted", "success");
            } else {
                addToast("Failed to delete notice", "error");
            }
        } catch (err) {
            console.error(err);
            addToast("Error deleting notice", "error");
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
                addToast(`Registration status: ${notice.acceptingResponses === false ? 'Open' : 'Closed'}`, "info");
            } else {
                addToast("Failed to toggle status", "error");
            }
        } catch (err) {
            console.error(err);
            addToast("Error toggling status", "error");
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

    const copyRegistrationLink = (id) => {
        const url = `${window.location.origin}/register/${id}`;
        navigator.clipboard.writeText(url)
            .then(() => addToast("Link copied to clipboard!", "success"))
            .catch(() => addToast("Failed to copy link", "error"));
    };

    // Helper to get columns for the selected event
    const getColumns = () => {
        if (!selectedNoticeId) return ['Date', 'Event', 'Details']; // Generic view
        const notice = notices.find(n => n._id === selectedNoticeId);
        if (!notice || !notice.formFields || notice.formFields.length === 0) return ['Date', 'Event', 'Legacy/Generic Data'];

        return ['Date', ...notice.formFields.map(f => f.label)];
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 pt-24">
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
                            <p className="text-sm text-gray-500 mb-4">Create your notice content using the segmented editor below.</p>

                            {/* Segmented CustomEditor */}
                            <CustomEditor
                                segmented={true}
                                value={newNotice.noticeContent}
                                onChange={(value) => setNewNotice({ ...newNotice, noticeContent: value })}
                            />

                            {/* Card Background and Word Import - Side by Side */}
                            <div className="mt-4">
                                <CustomFileInput
                                    label="Card Background Image"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const path = await handleFileUpload(e.target.files[0]);
                                        if (path) setNewNotice({ ...newNotice, noticeBgImage: path });
                                    }}
                                    isUploaded={!!newNotice.noticeBgImage}
                                    previewUrl={newNotice.noticeBgImage}
                                />
                            </div>
                        </div>

                        {/* SECTION 2: Form Configuration */}
                        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded shadow border-l-4 border-purple-500">
                            <h2 className="text-xl font-bold mb-4">Step 2: Registration Form</h2>
                            <p className="text-sm text-gray-500 mb-4">This opens when users click 'Register'.</p>

                            <div className="mb-6">
                                <CustomEditor
                                    value={newNotice.formTitle}
                                    onChange={value => setNewNotice({ ...newNotice, formTitle: value })}
                                    placeholder="Enter form title (Leave empty to use Event Title)..."
                                    minHeight="60px"
                                    sectionTitle="Form Title"
                                    sectionColor="from-blue-50 text-blue-800"
                                />
                            </div>

                            <div className="mb-6">
                                <CustomEditor
                                    value={newNotice.formDescription}
                                    onChange={value => setNewNotice({ ...newNotice, formDescription: value })}
                                    sectionTitle="Form Instructions / Description"
                                    sectionColor="from-purple-50 text-purple-800"
                                />
                            </div>

                            <div className="mb-6 mt-6">
                                <CustomFileInput
                                    label="Form Header Background Image"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const path = await handleFileUpload(e.target.files[0]);
                                        if (path) setNewNotice({ ...newNotice, formBgImage: path });
                                    }}
                                    isUploaded={!!newNotice.formBgImage}
                                    previewUrl={newNotice.formBgImage}
                                />
                            </div>

                            <div className="mb-6 p-4 border rounded bg-purple-50 dark:bg-gray-700 rounded-3xl border-purple-200">
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
                                        <CustomDropdown
                                            options={[
                                                { label: 'Roboto (Default)', value: 'Roboto' },
                                                { label: 'Poppins', value: 'Poppins' },
                                                { label: 'Arial', value: 'Arial' },
                                                { label: 'Times New Roman', value: 'Times New Roman' },
                                                { label: 'Georgia', value: 'Georgia' },
                                                { label: 'Courier New', value: 'Courier New' }
                                            ]}
                                            value={newNotice.design.fontFamily}
                                            onChange={val => setNewNotice({ ...newNotice, design: { ...newNotice.design, fontFamily: val } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Title Size</label>
                                        <CustomDropdown
                                            options={[
                                                { label: 'Small (18pt)', value: '18' },
                                                { label: 'Medium (24pt)', value: '24' },
                                                { label: 'Large (32pt)', value: '32' },
                                                { label: 'Huge (40pt)', value: '40' }
                                            ]}
                                            value={newNotice.design.titleFontSize}
                                            onChange={val => setNewNotice({ ...newNotice, design: { ...newNotice.design, titleFontSize: val } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Body Text Size</label>
                                        <CustomDropdown
                                            options={[
                                                { label: 'Small (9pt)', value: '9' },
                                                { label: 'Medium (11pt)', value: '11' },
                                                { label: 'Large (14pt)', value: '14' }
                                            ]}
                                            value={newNotice.design.bodyFontSize}
                                            onChange={val => setNewNotice({ ...newNotice, design: { ...newNotice.design, bodyFontSize: val } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block font-bold text-gray-700 dark:text-gray-300">Registration Form Fields</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormFields([...formFields, { label: 'Full Name', type: 'text', required: true }])}
                                            className="text-[10px] bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1"
                                        >
                                            <User size={12} /> + Name
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormFields([...formFields, { label: 'Email Address', type: 'email', required: true }])}
                                            className="text-[10px] bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1"
                                        >
                                            <Mail size={12} /> + Email
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormFields([...formFields, { label: 'Phone Number', type: 'number', required: true }])}
                                            className="text-[10px] bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1"
                                        >
                                            <Phone size={12} /> + Phone
                                        </button>
                                    </div>
                                </div>

                                {formFields.map((field, index) => (
                                    <div key={index} className="mb-6 bg-white dark:bg-gray-800 p-5 rounded-[15px] border border-gray-200 dark:border-gray-700 shadow-sm relative transition-all hover:shadow-md group">
                                        <div className="absolute -left-1 top-6 bottom-6 w-1 rounded-full" style={{ backgroundColor: newNotice.design.headerColor }}></div>

                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <CustomEditor
                                                className="flex-1"
                                                value={field.label}
                                                onChange={(val) => updateFormField(index, 'label', val)}
                                                placeholder="Enter question or field label..."
                                                minHeight="60px"
                                                sectionTitle="Question"
                                                sectionNumber={index + 1}
                                                sectionColor="from-green-50 text-green-800"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFormField(index)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-4 items-center">
                                            <div className="w-full md:w-64">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Input Type</p>
                                                <CustomDropdown
                                                    options={[
                                                        { label: 'Short Answer', value: 'text' },
                                                        { label: 'Number', value: 'number' },
                                                        { label: 'Email', value: 'email' },
                                                        { label: 'Link (URL)', value: 'url' },
                                                        { label: 'Dropdown Menu', value: 'dropdown' },
                                                        { label: 'Multiple Choice', value: 'radio' },
                                                        { label: 'File Upload', value: 'file' }
                                                    ]}
                                                    value={field.type}
                                                    onChange={val => updateFormField(index, 'type', val)}
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 pt-5">
                                                <label className="flex items-center gap-2 cursor-pointer group/req">
                                                    <div
                                                        onClick={() => updateFormField(index, 'required', !field.required)}
                                                        className={`w-10 h-5 rounded-full relative transition-colors ${field.required ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${field.required ? 'left-5.5' : 'left-0.5'}`} style={{ left: field.required ? '22px' : '2px' }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Required</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Options for Dropdown/Radio */}
                                        {(field.type === 'dropdown' || field.type === 'radio') && (
                                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-[10px] border border-gray-100 dark:border-gray-800">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Answer Options (comma separated)</p>
                                                <input
                                                    type="text"
                                                    placeholder="Option 1, Option 2, Option 3..."
                                                    className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[8px] text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                                    value={field.options ? field.options.join(', ') : ''}
                                                    onChange={e => updateFieldOptions(index, e.target.value)}
                                                />
                                            </div>
                                        )}

                                        {/* File Validation Options */}
                                        {field.type === 'file' && (
                                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-[10px] border border-gray-100 dark:border-gray-800">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-wider">File Upload Settings</p>
                                                <div className="flex gap-6 mb-4">
                                                    {[
                                                        { label: 'PDF', types: ['application/pdf'], icon: <Globe size={14} /> },
                                                        { label: 'Word', types: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], icon: <List size={14} /> },
                                                        { label: 'Images', types: ['image/jpeg', 'image/png'], icon: <PlusCircle size={14} /> }
                                                    ].map(group => {
                                                        const isChecked = group.types.some(t => field.fileValidation?.allowedTypes?.includes(t));
                                                        return (
                                                            <button
                                                                key={group.label}
                                                                type="button"
                                                                onClick={() => {
                                                                    const currentTypes = field.fileValidation?.allowedTypes || [];
                                                                    let newTypes = isChecked
                                                                        ? currentTypes.filter(t => !group.types.includes(t))
                                                                        : [...new Set([...currentTypes, ...group.types])];
                                                                    updateFileValidation(index, 'allowedTypes', newTypes);
                                                                }}
                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                                                    ${isChecked ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'}
                                                                `}
                                                            >
                                                                {isChecked && <CheckCircle2 size={12} />}
                                                                {group.label}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Max File Size</span>
                                                    <div className="w-32">
                                                        <CustomDropdown
                                                            options={[
                                                                { label: '1 MB', value: 1 },
                                                                { label: '5 MB', value: 5 },
                                                                { label: '10 MB', value: 10 },
                                                                { label: '100 MB', value: 100 },
                                                                { label: '1 GB', value: 1024 }
                                                            ]}
                                                            value={field.fileValidation?.maxSizeInMB || 10}
                                                            onChange={val => updateFileValidation(index, 'maxSizeInMB', val)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addFormField}
                                    className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[15px] flex items-center justify-center gap-2 text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all font-medium"
                                >
                                    <PlusCircle size={20} />
                                    Add Question / Form Field
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full mb-12">Post Notice</button>
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
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500 font-mono truncate max-w-[150px]">
                                                {window.location.origin}/register/{notice._id}
                                            </div>
                                            <button
                                                onClick={() => copyRegistrationLink(notice._id)}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-blue-600"
                                                title="Copy direct link"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
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
            )}

            {activeTab === 'registrations' && (
                <div>
                    <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded shadow">
                        <div className="flex items-center gap-4">
                            <label className="font-bold">Select Event:</label>
                            <div className="w-64">
                                <CustomDropdown
                                    options={[
                                        { label: '-- All Registrations --', value: '' },
                                        ...notices.map(n => ({ label: n.title.replace(/<[^>]+>/g, ''), value: n._id }))
                                    ]}
                                    value={selectedNoticeId}
                                    onChange={val => setSelectedNoticeId(val)}
                                />
                            </div>
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
                                                if (col === 'Event') return <td key={i} className="p-4">{reg.event}</td>;
                                                const val = reg.details?.[col] || reg[col.toLowerCase()] || '-';
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
            )}
        </div>
    );
};

export default AdminDashboard;
