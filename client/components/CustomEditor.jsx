import React, { useRef, useState, useEffect, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ChevronDown, ChevronUp, AlignLeft, AlignRight, Crop } from 'lucide-react';
import ImageCropper from './ImageCropper';
import CustomPromptModal from './CustomPromptModal';
import { useToast } from '../contexts/ToastContext';

// Import image resize module
import ImageResize from 'quill-image-resize-module-react';

// Fix for quill-image-resize-module which expects window.Quill
if (typeof window !== 'undefined' && !window.Quill) {
    window.Quill = Quill;
}

// Register ImageResize module
if (!Quill.imports['modules/imageResize']) {
    Quill.register('modules/imageResize', ImageResize);
}

// Extend Image Blot to support custom styles (float, margin)
const BaseImage = Quill.import('formats/image');
const ImageFormatAttributesList = [
    'alt',
    'height',
    'width',
    'style'
];

class Image extends BaseImage {
    static formats(domNode) {
        return ImageFormatAttributesList.reduce(function (formats, attribute) {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }
    format(name, value) {
        if (ImageFormatAttributesList.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}
Quill.register(Image, true);

// Extend Video Blot (Iframe) to support custom styles (float, margin)
const BaseVideo = Quill.import('formats/video');
const VideoFormatAttributesList = [
    'height',
    'width',
    'style'
];

class Video extends BaseVideo {
    static formats(domNode) {
        return VideoFormatAttributesList.reduce(function (formats, attribute) {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }
    format(name, value) {
        if (VideoFormatAttributesList.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}
Quill.register(Video, true);

const CustomEditor = ({ value, onChange, placeholder, className, minHeight = "150px", segmented = false, sectionTitle, sectionNumber, sectionColor }) => {
    const titleQuillRef = useRef(null);
    const shortDescQuillRef = useRef(null);
    const contentQuillRef = useRef(null);
    const regularQuillRef = useRef(null);

    const [showShortDescription, setShowShortDescription] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [cropTargetIndex, setCropTargetIndex] = useState(null);
    const [selectionInfo, setSelectionInfo] = useState({ section: null, type: null }); // { section: 'title'|'shortDescription'|'content'|'regular', type: 'IMG'|'IFRAME' }
    const [isIframeModalOpen, setIsIframeModalOpen] = useState(false);
    const { addToast } = useToast();

    // Listen for selection changes for all editor instances
    useEffect(() => {
        const createHandler = (sectionName, ref) => (range) => {
            const quill = ref.current?.getEditor();
            if (range && quill) {
                // 1. Try native Quill format check first (reliable for selections)
                const formats = quill.getFormat(range);
                let detectedType = null;

                if (formats.image) detectedType = 'IMG';
                else if (formats.video) detectedType = 'IFRAME';

                // 2. Fallback to indexing check (reliable for clicks/single index)
                if (!detectedType) {
                    let targetIndex = range.index;
                    let [leaf] = quill.getLeaf(targetIndex);

                    if (!(leaf && leaf.domNode && (leaf.domNode.tagName === 'IMG' || leaf.domNode.tagName === 'IFRAME'))) {
                        if (targetIndex > 0) {
                            [leaf] = quill.getLeaf(targetIndex - 1);
                        }
                    }

                    if (leaf && leaf.domNode && (leaf.domNode.tagName === 'IMG' || leaf.domNode.tagName === 'IFRAME')) {
                        detectedType = leaf.domNode.tagName;
                    }
                }

                if (detectedType) {
                    setSelectionInfo({ section: sectionName, type: detectedType });
                } else {
                    setSelectionInfo(prev => prev.section === sectionName ? { section: null, type: null } : prev);
                }
            } else {
                setSelectionInfo(prev => prev.section === sectionName ? { section: null, type: null } : prev);
            }
        };

        const editors = segmented
            ? { title: titleQuillRef, shortDescription: shortDescQuillRef, content: contentQuillRef }
            : { regular: regularQuillRef };

        const cleanupFns = Object.entries(editors).map(([name, ref]) => {
            const quill = ref.current?.getEditor();
            if (!quill) return null;
            const handler = createHandler(name, ref);
            quill.on('selection-change', handler);
            return () => quill.off('selection-change', handler);
        }).filter(Boolean);

        return () => cleanupFns.forEach(fn => fn());
    }, [segmented, showShortDescription]); // Re-run when sections appear/disappear

    // Custom handler for image/iframe floating
    // Custom handler for image/iframe floating
    const handleImageFloat = (direction) => {
        const section = selectionInfo.section;
        const ref = section === 'title' ? titleQuillRef
            : section === 'shortDescription' ? shortDescQuillRef
                : section === 'content' ? contentQuillRef
                    : regularQuillRef;

        const quill = ref.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection();
        if (!range) return;

        // Standard detection logic
        const currentFormats = quill.getFormat(range);
        let [leaf] = quill.getLeaf(range.index);

        if (!(leaf && leaf.domNode && (leaf.domNode.tagName === 'IMG' || leaf.domNode.tagName === 'IFRAME'))) {
            if (range.index > 0) [leaf] = quill.getLeaf(range.index - 1);
        }

        if ((currentFormats.image || currentFormats.video) || (leaf && leaf.domNode && (leaf.domNode.tagName === 'IMG' || leaf.domNode.tagName === 'IFRAME'))) {
            const node = (leaf && leaf.domNode && (leaf.domNode.tagName === 'IMG' || leaf.domNode.tagName === 'IFRAME'))
                ? leaf.domNode
                : quill.container.querySelector('img:focus, iframe:focus'); // Fallback to focused node

            if (node) {
                if (direction === 'left') {
                    node.style.float = 'left';
                    node.style.marginRight = '15px';
                    node.style.marginBottom = '10px';
                    node.setAttribute('style', `float: left; margin-right: 15px; margin-bottom: 10px; ${node.style.width ? 'width: ' + node.style.width + ';' : ''} ${node.style.height ? 'height: ' + node.style.height + ';' : ''}`);
                } else if (direction === 'right') {
                    node.style.float = 'right';
                    node.style.marginLeft = '15px';
                    node.style.marginBottom = '10px';
                    node.setAttribute('style', `float: right; margin-left: 15px; margin-bottom: 10px; ${node.style.width ? 'width: ' + node.style.width + ';' : ''} ${node.style.height ? 'height: ' + node.style.height + ';' : ''}`);
                } else { // None/Center (breaks default float)
                    node.style.float = 'none';
                    node.style.margin = '0 auto';
                    node.setAttribute('style', `float: none; margin: 0 auto; display: block; ${node.style.width ? 'width: ' + node.style.width + ';' : ''} ${node.style.height ? 'height: ' + node.style.height + ';' : ''}`);
                }

                // Sync with Quill and trigger change
                quill.updateContents([{
                    retain: range.index,
                    attributes: { style: node.getAttribute('style') || '' }
                }]);

                // Force a re-registration of the change
                const currentHTML = quill.root.innerHTML;
                if (segmented) {
                    handleSegmentedChange(section, currentHTML);
                } else {
                    onChange(currentHTML);
                }
            }
        }
    };

    const handleIframeInsert = () => {
        // Find which editor to insert into (default to 'content' if segmented, or 'regular')
        let targetSection = 'regular';
        if (segmented) {
            // Logic to determine which editor is currently focused or active
            // For simplicity, we choose the one that last had a selection or 'content'
            targetSection = selectionInfo.section || 'content';
        }
        setIsIframeModalOpen(targetSection);
    };

    const onIframeModalSubmit = (url) => {
        const section = isIframeModalOpen; // We stored the section name in the state
        const ref = section === 'title' ? titleQuillRef
            : section === 'shortDescription' ? shortDescQuillRef
                : section === 'content' ? contentQuillRef
                    : regularQuillRef;

        const quill = ref.current?.getEditor();
        if (!quill || !url) return;

        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'video', url);
        quill.setSelection(range.index + 1);
        addToast("Video embedded successfully!", "success");
    };

    // Reusable Media Controls Component
    const MediaOptions = ({ section }) => {
        if (selectionInfo.section !== section) return null;

        return (
            <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                {selectionInfo.type === 'IMG' && (
                    <button
                        type="button"
                        onClick={handleCropClick}
                        className="text-[10px] px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-1 font-bold border border-blue-200 dark:border-blue-700 shadow-sm"
                        title="Crop selected image"
                    >
                        <Crop size={12} />
                        Crop
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => handleImageFloat('left')}
                    className="text-[10px] px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-1 font-bold border border-green-200 dark:border-green-700 shadow-sm"
                    title="Float media left"
                >
                    <AlignLeft size={12} />
                    Float Left
                </button>
                <button
                    type="button"
                    onClick={() => handleImageFloat('right')}
                    className="text-[10px] px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-1 font-bold border border-green-200 dark:border-green-700 shadow-sm"
                    title="Float media right"
                >
                    <AlignRight size={12} />
                    Float Right
                </button>
                <button
                    type="button"
                    onClick={() => handleImageFloat('none')}
                    className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 font-bold border border-gray-200 dark:border-gray-600 shadow-sm"
                    title="Clear alignment"
                >
                    Reset
                </button>
            </div>
        );
    };

    const handleContainerClick = (ref) => {
        if (ref.current) {
            ref.current.focus();
        }
    };

    const handleCropClick = () => {
        const section = selectionInfo.section;
        const ref = section === 'title' ? titleQuillRef
            : section === 'shortDescription' ? shortDescQuillRef
                : section === 'content' ? contentQuillRef
                    : regularQuillRef;

        const quill = ref.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection();
        if (!range) {
            addToast("Please select an image first to crop.", "warning");
            return;
        }

        // Standard detection logic
        const currentFormats = quill.getFormat(range);
        let targetIndex = range.index;
        let [leaf] = quill.getLeaf(targetIndex);

        if (!(leaf && leaf.domNode && leaf.domNode.tagName === 'IMG')) {
            if (targetIndex > 0) [leaf] = quill.getLeaf(targetIndex - 1);
        }

        if (currentFormats.image || (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG')) {
            const imgNode = (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG')
                ? leaf.domNode
                : quill.container.querySelector('img:focus');

            if (imgNode) {
                setCropImageSrc(imgNode.src);
                const blotIndex = quill.getIndex(leaf) !== -1 ? quill.getIndex(leaf) : targetIndex;
                setCropTargetIndex(blotIndex);
            } else {
                addToast("Could not identify the image to crop.", "error");
            }
        } else {
            addToast("Please select an image first to crop.", "warning");
        }
    };

    const handleCropComplete = (newImageSrc) => {
        const section = selectionInfo.section;
        const ref = section === 'title' ? titleQuillRef
            : section === 'shortDescription' ? shortDescQuillRef
                : section === 'content' ? contentQuillRef
                    : regularQuillRef;

        const quill = ref.current?.getEditor();
        if (!quill || cropTargetIndex === null) return;

        // Try to find the existing image style to preserve it (e.g. float)
        let existingStyle = '';
        const [leaf] = quill.getLeaf(cropTargetIndex);
        if (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG') {
            existingStyle = leaf.domNode.getAttribute('style') || '';
        }

        // Delete old image and insert new one
        // We use a small delay or a single transaction to prevent duplicates
        quill.updateContents({
            ops: [
                { retain: cropTargetIndex },
                { delete: 1 },
                { insert: { image: newImageSrc }, attributes: existingStyle ? { style: existingStyle } : {} }
            ]
        }, 'user');

        // Restore selection
        quill.setSelection(cropTargetIndex + 1);
        setCropImageSrc(null);
        setCropTargetIndex(null);
        addToast("Image cropped successfully!", "success");
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'font': [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                ['clean']
            ],
            handlers: {
                'video': handleIframeInsert
            }
        },
        imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
            tagName: ['img', 'iframe']
        }
    }), []);

    const formats = useMemo(() => [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'align',
        'list', 'indent',
        'blockquote', 'code-block',
        'link', 'image', 'video',
        'script'
    ], []);

    const handleSegmentedChange = (field, newVal) => {
        const currentData = value || { title: '', shortDescription: '', content: '' };
        onChange({ ...currentData, [field]: newVal });
    };

    const segmentedContent = segmented && (
        <div className="segmented-custom-editor">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Section 1: Event Title */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="mb-2 px-6 pt-4 pb-2 bg-gradient-to-r from-blue-50 to-transparent dark:from-gray-800 rounded-t-lg flex items-center justify-between">
                        <div>
                            <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                                Event Title
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Use <strong>Heading 1</strong> or <strong>Heading 2</strong> format for your main title
                            </p>
                        </div>
                        <MediaOptions section="title" />
                    </div>
                    <div className="px-6 pb-4">
                        <div className="custom-quill-container cursor-text" onClick={() => handleContainerClick(titleQuillRef)}>
                            <ReactQuill
                                ref={titleQuillRef}
                                theme="snow"
                                value={(value || {}).title || ''}
                                onChange={(val) => handleSegmentedChange('title', val)}
                                modules={modules}
                                formats={formats}
                                placeholder="Enter event title (use Heading format)..."
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Short Description */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="mb-2 px-6 pt-4 pb-2 bg-gradient-to-r from-purple-50 to-transparent dark:from-gray-800">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-xs font-bold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                                <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                                Short Description
                            </h4>
                            <div className="flex items-center gap-2">
                                <MediaOptions section="shortDescription" />
                                <button
                                    type="button"
                                    onClick={() => setShowShortDescription(!showShortDescription)}
                                    className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors flex items-center gap-1 font-medium"
                                >
                                    {showShortDescription ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    {showShortDescription ? 'Remove' : 'Add'}
                                </button>
                            </div>
                        </div>
                        {showShortDescription && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Add a brief teaser paragraph (1-2 sentences). If omitted, the first 100 characters will be used.
                            </p>
                        )}
                    </div>
                    {showShortDescription && (
                        <div className="px-6 pb-4">
                            <div className="custom-quill-container cursor-text" onClick={() => handleContainerClick(shortDescQuillRef)}>
                                <ReactQuill
                                    ref={shortDescQuillRef}
                                    theme="snow"
                                    value={(value || {}).shortDescription || ''}
                                    onChange={(val) => handleSegmentedChange('shortDescription', val)}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Enter a brief teaser for the notice card..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3: Full Description */}
                <div>
                    <div className="mb-2 px-6 pt-4 pb-2 bg-gradient-to-r from-green-50 to-transparent dark:from-gray-800 flex items-center justify-between">
                        <div>
                            <h4 className="text-xs font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                                Full Description
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Add complete details. Click media to see edit options.
                            </p>
                        </div>
                        <MediaOptions section="content" />
                    </div>
                    <div className="px-6 pb-6">
                        <div className="custom-quill-container cursor-text" onClick={() => handleContainerClick(contentQuillRef)}>
                            <ReactQuill
                                ref={contentQuillRef}
                                theme="snow"
                                value={(value || {}).content || ''}
                                onChange={(val) => handleSegmentedChange('content', val)}
                                modules={modules}
                                formats={formats}
                                placeholder="Enter the full notice content with all details..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const headerColorClass = sectionColor || 'from-blue-50 text-blue-800 dark:text-blue-300';
    const numberBgClass = sectionColor ? sectionColor.replace('from-', 'bg-').split(' ')[0] : 'bg-blue-600';

    const regularContent = !segmented && (
        <div className="segmented-custom-editor">
            <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className || ''}`}>
                {sectionTitle && (
                    <div className={`px-6 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r ${headerColorClass} to-transparent dark:from-gray-800 flex items-center justify-between`}>
                        <h4 className="text-xs font-bold flex items-center gap-2 text-inherit">
                            {sectionNumber && (
                                <span className={`${numberBgClass} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs`}>
                                    {sectionNumber}
                                </span>
                            )}
                            {sectionTitle}
                        </h4>
                        <MediaOptions section="regular" />
                    </div>
                )}
                <div className={`px-6 pb-4 ${sectionTitle ? 'pt-2' : ''}`}>
                    <div
                        className="custom-quill-container cursor-text"
                        style={{ minHeight: minHeight }}
                        onClick={() => handleContainerClick(regularQuillRef)}
                    >
                        <ReactQuill
                            ref={regularQuillRef}
                            theme="snow"
                            value={value}
                            onChange={onChange}
                            modules={modules}
                            formats={formats}
                            placeholder={placeholder}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="custom-editor-wrapper">
            {segmented ? segmentedContent : regularContent}

            {/* Image Cropper Modal */}
            {cropImageSrc && (
                <ImageCropper
                    imageSrc={cropImageSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setCropImageSrc(null);
                        setCropTargetIndex(null);
                    }}
                />
            )}

            <CustomPromptModal
                isOpen={!!isIframeModalOpen}
                onClose={() => setIsIframeModalOpen(false)}
                onSubmit={onIframeModalSubmit}
                title="Insert Video/Iframe"
                placeholder="Enter URL (e.g., https://www.youtube.com/embed/...)"
            />

            <style jsx="true">{`
                .custom-quill-container .ql-container {
                    border: none !important;
                    background-color: transparent !important;
                    min-height: inherit;
                }
                
                .custom-quill-container {
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    overflow: hidden;
                    background-color: #fff;
                    transition: border-color 0.2s;
                }

                .dark .custom-quill-container {
                    border-color: #374151;
                    background-color: #111827;
                }

                .custom-quill-container:focus-within {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 1px #3b82f6;
                }
                
                .dark .custom-quill-container .ql-container {
                    color: white;
                }
                
                .segmented-custom-editor .custom-quill-container .ql-container {
                    min-height: 80px;
                }

                .segmented-custom-editor {
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }

                .custom-quill-container .ql-toolbar {
                    background-color: #f8fafc;
                    border: none !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                }

                .dark .custom-quill-container .ql-toolbar {
                    background-color: #1f2937;
                    border-color: #4b5563 !important;
                }
                
                .dark .custom-quill-container .ql-stroke {
                    stroke: #9ca3af;
                }
                .dark .custom-quill-container .ql-fill {
                    fill: #9ca3af;
                }
                .dark .custom-quill-container .ql-picker {
                    color: #9ca3af;
                }

                /* Image/Iframe Resize and Alignment Styles */
                .custom-quill-container .ql-editor img,
                .custom-quill-container .ql-editor iframe {
                    max-width: 100%;
                    height: auto !important;
                    cursor: pointer;
                    border-radius: 4px;
                    display: block;
                    float: left;
                    margin-right: 15px;
                    margin-bottom: 10px;
                }
                
                .custom-quill-container .ql-editor img[style*="float: left"],
                .custom-quill-container .ql-editor iframe[style*="float: left"] {
                    margin-right: 15px !important;
                    margin-bottom: 10px !important;
                }
                
                .custom-quill-container .ql-editor img[style*="float: right"],
                .custom-quill-container .ql-editor iframe[style*="float: right"] {
                    margin-left: 15px !important;
                    margin-bottom: 10px !important;
                }

                /* Resize Handles Style */
                .custom-quill-container div[style*="cursor: nwse-resize"],
                .custom-quill-container div[style*="cursor: nesw-resize"],
                .custom-quill-container div[style*="cursor: ns-resize"],
                .custom-quill-container div[style*="cursor: ew-resize"] {
                    width: 12px !important;
                    height: 12px !important;
                    background-color: #3b82f6 !important;
                    border: 2px solid white !important;
                    border-radius: 50% !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                    z-index: 100 !important;
                }

                .dark .custom-quill-container .ql-toolbar button:hover,
                .dark .custom-quill-container .ql-picker-label:hover {
                    color: #60a5fa;
                }

                /* Dimension Badge */
                .custom-quill-container div[style*="background-color: rgb(51, 51, 51)"],
                .custom-quill-container div[style*="background-color: #333"] {
                    background-color: rgba(31, 41, 55, 0.9) !important;
                    color: white !important;
                    padding: 4px 8px !important;
                    border-radius: 6px !important;
                    font-size: 10px !important;
                }
            `}</style>
        </div>
    );
};

export default CustomEditor;
