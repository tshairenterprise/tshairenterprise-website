import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram, Sparkles, Image as ImageIcon } from "lucide-react";

const GalleryPreview = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Latest 4 images fetch karenge
                const { data } = await api.get('/gallery');
                setImages(data.slice(0, 4));
            } catch (error) {
                console.error("Gallery fetch error");
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (!loading && images.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden transition-colors duration-500">

            {/* --- AMBIENT GLOW --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-pink-500/10 dark:bg-pink-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold uppercase tracking-widest text-xs mb-2">
                            <Instagram className="h-4 w-4" /> Follow the journey
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                            Real Clients, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Real Results</span>
                        </h2>
                    </div>

                    <Button
                        onClick={() => navigate('/gallery')}
                        variant="outline"
                        className="hidden md:flex rounded-full border-gray-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 gap-2 group"
                    >
                        View Full Gallery <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                {/* --- IMAGE ROW (Grid) --- */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {images.map((img, index) => (
                            <div
                                key={img._id}
                                className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-500 ${index % 2 === 1 ? 'md:translate-y-4' : ''}`} // Staggered look on desktop
                                onClick={() => navigate('/gallery')}
                            >
                                <img
                                    src={img.imageUrl}
                                    alt={img.altText}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                                        <ImageIcon className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mobile Button */}
                <div className="mt-10 text-center md:hidden">
                    <Button
                        onClick={() => navigate('/gallery')}
                        className="rounded-full w-full h-12 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 shadow-sm font-bold"
                    >
                        Explore Gallery
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default GalleryPreview;