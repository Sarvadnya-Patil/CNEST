import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Gallery = () => {
    const [selectedSection, setSelectedSection] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const galleryData = [
        {
            title: "Innoverse - Innovation Showcase",
            description: "Innoverse brings together brilliant minds, cutting-edge ideas, and transformative solutions. This annual event showcases groundbreaking projects, fosters collaboration, and inspires the next generation of entrepreneurs and innovators.",
            images: [
                "/PICTURES/Innoverse/DSC_0118.JPG",
                "/PICTURES/Innoverse/DSC_0212.JPG",
                "/PICTURES/Innoverse/DSC_0405.JPG",
                "/PICTURES/Innoverse/DSC_0406.JPG",
                "/PICTURES/Innoverse/DSC_0433.JPG",
                "/PICTURES/Innoverse/DSC_0451.JPG",
                "/PICTURES/Innoverse/DSC_0457.JPG",
                "/PICTURES/Innoverse/DSC_0466.JPG",
                "/PICTURES/Innoverse/DSC_0489.JPG",
                "/PICTURES/Innoverse/DSC_0567.JPG",
                "/PICTURES/Innoverse/DSC_0569.JPG",
                "/PICTURES/Innoverse/DSC_0468.JPG",
                "/PICTURES/Innoverse/DSC_0472.JPG",
                "/PICTURES/Innoverse/DSC_0477.JPG",
                "/PICTURES/Innoverse/DSC_0495.JPG",
                "/PICTURES/Innoverse/DSC_0138.JPG"
            ]
        },
        {
            title: "Incubated Startups & Events",
            description: "Highlighting our vibrant ecosystem of incubated startups, ideation workshops, and entrepreneurial programs. From IPYatra expeditions to Kimi Motors' innovations, these events showcase the diverse talent and groundbreaking work happening at CNEST.",
            images: [
                "/PICTURES/Ideation.jpg",
                "/PICTURES/IPYATRA.jpg",
                "/PICTURES/Kimi Motors.jpg",
                "/PICTURES/IMG_4500.JPG"
            ]
        },
        {
            title: "CTIE Inauguration",
            description: "A historic moment marking the official launch of the Centre for Technology Innovation and Entrepreneurship (CTIE), celebrating the beginning of a new era in innovation and entrepreneurship at KLE Technological University.",
            images: [
                "/PICTURES/CTIE INNAUGRATION/CTIE news paper.jpeg",
                "/PICTURES/CTIE INNAUGRATION/DSC_6361.JPG",
                "/PICTURES/CTIE INNAUGRATION/DSC_6414.JPG",
                "/PICTURES/CTIE INNAUGRATION/DSC_6458.JPG"
            ]
        }
    ];

    const currentSection = galleryData[selectedSection];
    const totalImages = currentSection.images.length;

    // Auto-play carousel with random image selection
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(Math.floor(Math.random() * totalImages));
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, [totalImages]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    return (
        <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Gallery
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Explore the journey of innovation, collaboration, and entrepreneurship through our visual stories
                    </p>
                </div>

                {/* Current Section Description */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 mb-8 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {currentSection.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {currentSection.description}
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12">
                    <div className="relative aspect-[16/9] bg-gray-900 dark:bg-black group">
                        <img
                            src={currentSection.images[currentImageIndex]}
                            alt={`${currentSection.title} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-contain"
                        />

                        {/* Carousel Controls - Show on Hover */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm transform hover:scale-110 opacity-0 group-hover:opacity-100"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm transform hover:scale-110 opacity-0 group-hover:opacity-100"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 overflow-x-auto">
                        <div className="flex gap-3 min-w-max">
                            {currentSection.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index
                                            ? 'border-blue-600 dark:border-blue-500 shadow-lg scale-105'
                                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid View of All Images */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Photos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentSection.images.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => openLightbox(index)}
                                className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gray-100 dark:bg-gray-700 aspect-[4/3]"
                            >
                                <img
                                    src={image}
                                    alt={`${currentSection.title} - Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section Tabs - Moved to Bottom */}
                <div className="flex flex-wrap justify-center gap-4 mt-12">
                    {galleryData.map((section, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setSelectedSection(index);
                                setCurrentImageIndex(0);
                            }}
                            className={`px-8 py-4 rounded-xl font-semibold transition-all ${selectedSection === index
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                                }`}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>

                {/* Lightbox Modal */}
                {isLightboxOpen && (
                    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                            aria-label="Close lightbox"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <img
                            src={currentSection.images[currentImageIndex]}
                            alt={`${currentSection.title} - Image ${currentImageIndex + 1}`}
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                        />

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-white px-6 py-3 rounded-full backdrop-blur-md">
                            <span className="font-semibold text-lg">{currentImageIndex + 1}</span> / {totalImages}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Gallery;
