import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

const CustomFileInput = ({ onChange, accept, label, iconType = 'image', isUploaded = false, previewUrl = null, className = "" }) => {
    const inputRef = useRef(null);

    const handleClick = () => {
        inputRef.current.click();
    };

    const Icon = iconType === 'word' ? FileText : Upload;

    return (
        <div className={`w-full ${className}`}>
            <input
                type="file"
                ref={inputRef}
                onChange={onChange}
                accept={accept}
                className="hidden"
            />
            <button
                type="button"
                onClick={handleClick}
                className={`w-full flex items-center justify-between px-4 py-3 border-2 border-dashed rounded-[15px] transition-all group
                    ${isUploaded
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-500 dark:text-gray-400'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-lg overflow-hidden transition-colors shrink-0 ${isUploaded && !previewUrl ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-800'}`}>
                        {previewUrl && iconType === 'image' ? (
                            <img src={previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded shadow-sm" />
                        ) : isUploaded ? (
                            <div className="p-1.5"><CheckCircle2 size={18} className="text-green-600 dark:text-green-400" /></div>
                        ) : (
                            <div className="p-1.5"><Icon size={18} className="group-hover:text-blue-600 dark:group-hover:text-blue-400" /></div>
                        )}
                    </div>
                    <div className="text-left">
                        <p className={`text-sm font-bold ${isUploaded ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300'}`}>
                            {label}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                            {isUploaded ? 'File Uploaded Successfully' : `Click to upload ${iconType === 'word' ? 'Document' : 'Image'}`}
                        </p>
                    </div>
                </div>
                {!isUploaded && (
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Browse
                    </span>
                )}
            </button>
        </div>
    );
};

export default CustomFileInput;
