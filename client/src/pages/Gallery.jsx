import React, { useEffect, useState } from 'react';
import api from "@/lib/axios";
import { Loader2, ImageOff, Sparkles, ZoomIn, Instagram } from "lucide-react";
import SEO from '../components/SEO';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data } = await api.get('/gallery');
            setImages(data);
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    // SEO: ImageGallery Schema Structure
    const gallerySchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "TS Hair Enterprise Gallery",
        "description": "Visual collection of Raw Indian Hair textures, bulk hair bundles, and client results.",
        "url": window.location.href,
        "mainEntity": {
            "@type": "ImageGallery",
            "name": "Premium Hair Textures",
            "image": images.map(img => img.imageUrl) // Dynamically adding all images to schema
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 relative overflow-hidden pt-24 pb-20 transition-colors duration-500">

            <SEO
                title="Our Gallery | Raw Hair Textures & Real Photos"
                description="Explore high-resolution photos of TS Hair Enterprise's products. See the quality of our Raw Indian Wavy, Curly, and Straight hair before you buy."
                keywords="hair gallery, raw hair photos, indian hair textures, TS Hair images, real client results, hair extension photos, bulk hair images"
                url={window.location.href}
                schema={gallerySchema} // Passing custom schema here
            />

            {/* --- 1. MODERN AMBIENT BACKGROUND (The "Vibe") --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Purple/Pink Glow Top Right */}
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow"></div>
                {/* Blue Glow Bottom Left */}
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- 2. HEADER SECTION --- */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 px-4 py-1.5 rounded-full shadow-sm mb-6 backdrop-blur-md">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span className="text-xs font-bold tracking-wider uppercase text-gray-600 dark:text-slate-400">Visual Stories</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
                        Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">Textures</span>
                    </h1>

                    <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                        A closer look at our unprocessed raw Indian hair. From temple to texture, see the quality in every strand.
                    </p>
                </div>

                {/* --- 3. CONTENT AREA --- */}
                {loading ? (
                    // Skeleton Loading Grid (Professional Feel)
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="break-inside-avoid rounded-2xl bg-gray-200 dark:bg-slate-800 animate-pulse h-64 w-full"></div>
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    // Modern Empty State
                    <div className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
                        <div className="bg-gray-100 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <ImageOff className="h-10 w-10 text-gray-400 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Gallery is Empty</h3>
                        <p className="text-gray-500 dark:text-slate-400">Our visual collection is being curated. Check back soon.</p>
                    </div>
                ) : (
                    /* --- 4. MASONRY GRID LAYOUT --- */
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {images.map((img) => (
                            <div
                                key={img._id}
                                className="break-inside-avoid relative group rounded-[1.5rem] overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-md hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 ease-out cursor-zoom-in border border-transparent hover:border-purple-500/30"
                            >
                                <img
                                    src={img.imageUrl}
                                    alt={img.altText}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Gradient Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        <div className="inline-flex items-center gap-1.5 text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1">
                                            <Sparkles className="h-3 w-3 text-yellow-400" />
                                            TS Hair Enterprise Official
                                        </div>
                                        <p className="text-white text-sm font-bold leading-snug line-clamp-2">
                                            {img.altText}
                                        </p>
                                    </div>
                                </div>

                                {/* Zoom Icon Hint */}
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    <ZoomIn className="h-4 w-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;