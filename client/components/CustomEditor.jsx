import React, { useRef, useState, useEffect, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ChevronDown, ChevronUp, AlignLeft, AlignRight, AlignCenter, Crop, Maximize } from 'lucide-react';
import ImageCropper from './ImageCropper';
import CustomPromptModal from './CustomPromptModal';
import { useToast } from '../contexts/ToastContext';

// Fix for quill-image-resize-module which expects window.Quill
// WE MUST DO THIS BEFORE IMPORTING ImageResize
if (typeof window !== 'undefined') {
    window.Quill = Quill;
}

// Import image resize module
import ImageResize from 'quill-image-resize-module-react';

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
    const [cropSection, setCropSection] = useState(null); // Persist section during crop
    const [selectionInfo, setSelectionInfo] = useState({ section: null, type: null });
    const selectionInfoRef = useRef(selectionInfo);
    useEffect(() => { selectionInfoRef.current = selectionInfo; }, [selectionInfo]);

    const activeMediaRef = useRef(null); // { node, index, section }
    const [isIframeModalOpen, setIsIframeModalOpen] = useState(false);
    // isResizingRef tracks if we are in "resize mode" to allow event propagation
    const isResizingRef = useRef(false);
    const { addToast } = useToast();

    // Helper function to focus editor when clicking container
    const handleContainerClick = (ref) => {
        const quill = ref.current?.getEditor();
        if (quill) {
            try {
                quill.focus();
            } catch (e) {
                console.warn("Quill focus failed:", e);
            }
        }
    };

    // -------------------------------------------------------------------------
    // 1. Selection & Visibility Logic - SIMPLIFIED
    // -------------------------------------------------------------------------
    useEffect(() => {
        const editors = segmented
            ? { title: titleQuillRef, shortDescription: shortDescQuillRef, content: contentQuillRef }
            : { regular: regularQuillRef };

        const cleanupFns = [];

        Object.entries(editors).forEach(([name, ref]) => {
            const quill = ref.current?.getEditor();
            if (!quill) return;

            // Simple click handler - the ONLY source of truth for media selection
            const handleClick = (e) => {
                const target = e.target;

                // Clicked on media
                if (target.tagName === 'IMG' || target.tagName === 'IFRAME') {
                    // Check if we are in explicit resize mode
                    if (isResizingRef.current) {
                        // Allow propagation so Resize Module can see it
                        // Reset flag after one successful propagation if desired, 
                        // or keep it until deselection. Let's keep it for now.
                    } else {
                        // Standard mode: block propagation to keep our UI clean
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    const blot = Quill.find(target);
                    if (!blot) return;

                    const offset = quill.getIndex(blot);
                    activeMediaRef.current = {
                        node: target,
                        index: offset,
                        section: name
                    };
                    // Keep selection stable, only update if needed
                    if (selectionInfoRef.current.section !== name || selectionInfoRef.current.type !== target.tagName) {
                        setSelectionInfo({ section: name, type: target.tagName });
                    }
                    return;
                }

                // Clicked on media options - do nothing
                if (target.closest('.media-options-container')) {
                    e.stopPropagation();
                    return;
                }

                // Clicked elsewhere in editor - clear selection
                setSelectionInfo({ section: null, type: null });
                activeMediaRef.current = null;
                isResizingRef.current = false;
            };

            const root = quill.root;
            root.addEventListener('click', handleClick, true); // Use capture phase
            cleanupFns.push(() => root.removeEventListener('click', handleClick, true));
        });

        // Global click to clear when clicking outside
        const handleGlobalClick = (e) => {
            if (!e.target.closest('.ql-editor') &&
                !e.target.closest('.media-options-container')) {
                setSelectionInfo({ section: null, type: null });
                activeMediaRef.current = null;
                isResizingRef.current = false;
            }
        };

        document.addEventListener('click', handleGlobalClick);
        cleanupFns.push(() => document.removeEventListener('click', handleGlobalClick));

        return () => cleanupFns.forEach(fn => fn());
    }, [segmented, showShortDescription]);

    // -------------------------------------------------------------------------
    // 2. Media Handlers (Float, Crop, Iframe) - SIMPLIFIED
    // -------------------------------------------------------------------------
    const handleImageFloat = (direction) => {
        const target = activeMediaRef.current;

        if (!target || !target.node) {
            addToast("Please click on an image or video first", "warning");
            return;
        }

        const ref = target.section === 'title' ? titleQuillRef
            : target.section === 'shortDescription' ? shortDescQuillRef
                : target.section === 'content' ? contentQuillRef
                    : regularQuillRef;

        const quill = ref.current?.getEditor();
        if (!quill) return;

        const node = target.node;

        // Get current dimensions
        const width = node.style.width || node.getAttribute('width') || '';
        const height = node.style.height || node.getAttribute('height') || '';
        const cleanWidth = width.replace(/!important/g, '').trim();
        const cleanHeight = height.replace(/!important/g, '').trim();

        // Build size preservation
        let sizeStr = '';
        if (cleanWidth) sizeStr += `width: ${cleanWidth} !important; `;
        if (cleanHeight) sizeStr += `height: ${cleanHeight} !important; `;

        // Build alignment styles
        let styleStr = '';
        if (direction === 'left') {
            styleStr = `float: left !important; margin: 0 15px 10px 0 !important; display: inline-block !important; ${sizeStr}`;
        } else if (direction === 'right') {
            styleStr = `float: right !important; margin: 0 0 10px 15px !important; display: inline-block !important; ${sizeStr}`;
        } else { // center
            styleStr = `float: none !important; margin: 20px auto !important; display: block !important; ${sizeStr}`;
        }

        // Apply to DOM immediately
        node.setAttribute('style', styleStr);

        // Manually trigger Quill's change detection
        setTimeout(() => {
            const html = quill.root.innerHTML;
            if (segmented) {
                handleSegmentedChange(target.section, html);
            } else {
                onChange(html);
            }
        }, 50);

        addToast(`Aligned ${direction}`, "success");
    };

    const handleIframeInsert = () => {
        const currentSelection = selectionInfoRef.current;
        setIsIframeModalOpen(segmented ? (currentSelection.section || 'content') : 'regular');
    };

    const onIframeModalSubmit = (url) => {
        const section = isIframeModalOpen;
        const ref = section === 'title' ? titleQuillRef
            : section === 'shortDescription' ? shortDescQuillRef
                : section === 'content' ? contentQuillRef
                    : regularQuillRef;

        const quill = ref.current?.getEditor();
        if (!quill || !url) return;

        const range = quill.getSelection(true);
        if (!range) return;

        quill.insertEmbed(range.index, 'video', url);
        quill.setSelection(range.index + 1);
        addToast("Video embedded successfully!", "success");
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
        if (!range && !activeMediaRef.current) {
            addToast("Please click on an image first", "warning");
            return;
        }
        if (!range) {
            addToast("Please select an image first to crop.", "warning");
            return;
        }
        const currentFormats = quill.getFormat(range);
        let imgNode = null;
        let targetBlotIndex = range.index;

        // 1. Try to find leaf at current, previous, or next index
        const checkIndices = [range.index, range.index - 1, range.index + 1];
        for (const idx of checkIndices) {
            if (idx < 0 || idx > quill.getLength()) continue;
            const [leaf] = quill.getLeaf(idx);
            if (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG') {
                imgNode = leaf.domNode;
                targetBlotIndex = quill.getIndex(leaf);
                break;
            }
        }

        // 2. Fallback to format check
        if (!imgNode && currentFormats.image) {
            imgNode = quill.container.querySelector('img:focus');
        }

        if (imgNode) {
            setCropImageSrc(imgNode.src);
            setCropTargetIndex(targetBlotIndex !== -1 ? targetBlotIndex : range.index);
            setCropSection(selectionInfo.section); // Persist section
        } else {
            addToast("Please select an image first to crop.", "warning");
        }
    };

    const handleCropComplete = (newImageSrc) => {
        const section = cropSection; // Use persisted section
        const ref = section === 'title' ? titleQuillRef
            : section === 'shortDescription' ? shortDescQuillRef
                : section === 'content' ? contentQuillRef
                    : regularQuillRef;

        const quill = ref.current?.getEditor();
        if (!quill || cropTargetIndex === null) return;

        let existingStyle = '';
        const [leaf] = quill.getLeaf(cropTargetIndex);
        if (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG') {
            existingStyle = leaf.domNode.getAttribute('style') || '';
        }

        quill.updateContents({
            ops: [
                { retain: cropTargetIndex },
                { delete: 1 },
                { insert: { image: newImageSrc }, attributes: existingStyle ? { style: existingStyle } : {} }
            ]
        }, 'user');

        quill.setSelection(cropTargetIndex + 1);
        setCropImageSrc(null);
        setCropTargetIndex(null);
        setCropSection(null);
        addToast("Image cropped successfully!", "success");
    };

    const handleResizeClick = () => {
        const target = activeMediaRef.current;
        if (!target || !target.node) return;

        // Enable resize mode
        isResizingRef.current = true;

        // Force a click on the node to wake up the resize module
        // prompting it to show handles
        target.node.click();

        addToast("Drag handles to resize. Click away to finish.", "info");
    };

    // -------------------------------------------------------------------------
    // 3. UI Components & Configuration
    // -------------------------------------------------------------------------
    const MediaOptions = ({ section }) => {
        // Show if explicitly selected
        if (selectionInfo.section !== section) return null;

        return (
            <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200 media-options-container">
                {selectionInfo.type === 'IMG' && (
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
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
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleResizeClick}
                    className="text-[10px] px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors flex items-center gap-1 font-bold border border-yellow-200 dark:border-yellow-700 shadow-sm"
                    title="Resize media"
                >
                    <Maximize size={12} />
                    Resize
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleImageFloat('left')}
                    className="text-[10px] px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-1 font-bold border border-green-200 dark:border-green-700 shadow-sm"
                    title="Float media left"
                >
                    <AlignLeft size={12} />
                    Float Left
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleImageFloat('right')}
                    className="text-[10px] px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-1 font-bold border border-green-200 dark:border-green-700 shadow-sm"
                    title="Float media right"
                >
                    <AlignRight size={12} />
                    Float Right
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleImageFloat('center')}
                    className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 font-bold border border-gray-200 dark:border-gray-600 shadow-sm"
                    title="Center media"
                >
                    <AlignCenter size={12} />
                    Center
                </button>
            </div>
        );
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
            modules: ['Resize', 'DisplaySize'], // Removed 'Toolbar' to avoid conflict
            tagName: ['img', 'iframe']
        }
    }), []); // Stable modules

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
                        setCropSection(null);
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
                    display: inline-block !important;
                    float: left; /* Default alignment */
                    margin-right: 15px !important;
                    margin-bottom: 10px !important;
                    transition: outline 0.2s;
                }

                .custom-quill-container .ql-editor img:focus,
                .custom-quill-container .ql-editor iframe:focus {
                    box-shadow: 0 0 0 2px #3b82f6 !important;
                    outline: none !important;
                }

                .custom-quill-container .ql-editor img::selection,
                .custom-quill-container .ql-editor iframe::selection {
                    background: transparent !important;
                }
                
                .custom-quill-container .ql-editor img[style*="float: left"],
                .custom-quill-container .ql-editor iframe[style*="float: left"] {
                    margin-right: 15px !important;
                    margin-bottom: 10px !important;
                }
                
                .custom-quill-container .ql-editor img[style*="float: right"],
                .custom-quill-container .ql-editor iframe[style*="float: right"] {
                    float: right !important;
                    margin-left: 15px !important;
                    margin-bottom: 10px !important;
                    margin-right: 0 !important;
                    display: inline-block !important;
                }

                .custom-quill-container .ql-editor img[style*="float: none"],
                .custom-quill-container .ql-editor iframe[style*="float: none"] {
                    float: none !important;
                    margin: 20px auto !important;
                    display: block !important;
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
