import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check } from 'lucide-react';

// Helper to center the crop
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [aspect, setAspect] = useState(undefined); // undefined = free aspect ratio
    const imgRef = useRef(null);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        let initialCrop;

        if (aspect) {
            initialCrop = centerAspectCrop(width, height, aspect);
        } else {
            initialCrop = centerCrop(
                makeAspectCrop(
                    {
                        unit: '%',
                        width: 90,
                    },
                    16 / 9,
                    width,
                    height,
                ),
                width,
                height,
            );
        }
        setCrop(initialCrop);
        // Initialize completedCrop with pixel values derived from the percent crop
        // We can approximate or wait for ReactCrop to trigger onComplete. 
        // Better to let ReactCrop handle it, but if it doesn't trigger on init, we might have issues.
        // Let's rely on ReactCrop for now but log it.
        console.log("Image loaded", width, height, initialCrop);
    }

    const getCroppedImg = async () => {
        console.log("getCroppedImg called. completedCrop:", completedCrop);
        if (!completedCrop || !imgRef.current) {
            console.warn("Missing completedCrop or imgRef");
            return;
        }

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const pixelRatio = window.devicePixelRatio;

        console.log("Dimensions:", {
            cropWidth: completedCrop.width,
            cropHeight: completedCrop.height,
            scaleX,
            scaleY,
            pixelRatio
        });

        canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
        canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
        );

        // Convert to blob/base64
        const base64Image = canvas.toDataURL('image/jpeg');
        onCropComplete(base64Image);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Crop Image</h3>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setAspect(undefined)}
                            className={`px-3 py-1 text-xs rounded ${!aspect ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                            Free
                        </button>
                        <button
                            type="button"
                            onClick={() => setAspect(16 / 9)}
                            className={`px-3 py-1 text-xs rounded ${aspect === 16 / 9 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                            16:9
                        </button>
                        <button
                            type="button"
                            onClick={() => setAspect(4 / 3)}
                            className={`px-3 py-1 text-xs rounded ${aspect === 4 / 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                            4:3
                        </button>
                        <button
                            type="button"
                            onClick={() => setAspect(1)}
                            className={`px-3 py-1 text-xs rounded ${aspect === 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                            1:1
                        </button>
                    </div>
                    <button onClick={onCancel} type="button" className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 flex justify-center bg-gray-100 dark:bg-gray-900">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => {
                            console.log("onChange", percentCrop);
                            setCrop(percentCrop);
                        }}
                        onComplete={(c) => {
                            console.log("onComplete", c);
                            setCompletedCrop(c);
                        }}
                        aspect={aspect}
                        className="max-h-[60vh]"
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imageSrc}
                            onLoad={onImageLoad}
                            style={{ maxHeight: '60vh', width: 'auto' }}
                        />
                    </ReactCrop>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={getCroppedImg}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Check size={18} />
                        Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
