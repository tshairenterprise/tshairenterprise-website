import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram, Sparkles, Image as ImageIcon, ZoomIn, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const GalleryPreview = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch latest 4 images
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
        <section className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">

            {/* --- BACKGROUND BLOBS (Consistent Theme) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Top Left - Purple Blob */}
                <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                {/* Bottom Right - Blue Blob */}
                <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                            <Instagram className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" />
                            <span className="text-[11px] font-bold tracking-widest uppercase text-primary">@TSHairEnterprise</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1]">
                            Real Clients, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">Real Results</span>
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                            See how our premium raw Indian hair transforms looks. Authentic textures, unfiltered beauty.
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate('/gallery')}
                        className="hidden md:flex h-12 px-8 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all hover:scale-105"
                    >
                        View Full Gallery <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* --- STAGGERED GRID (Modern Masonry Feel) --- */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-slate-900 rounded-[2rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    // Added pb-12 to account for the translate-y offset
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pb-12">
                        {images.map((img, index) => (
                            <div
                                key={img._id}
                                onClick={() => navigate('/gallery')}
                                className={cn(
                                    "group relative aspect-[3/4] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg border border-gray-100 dark:border-slate-800 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10",
                                    // This creates the "Wave" effect (Odd items pushed down)
                                    index % 2 === 1 ? "md:translate-y-12" : ""
                                )}
                            >
                                <img
                                    src={img.imageUrl}
                                    alt={img.altText}
                                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Top Badge (Instagram Style) */}
                                <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                    <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                                        <Instagram className="h-5 w-5" />
                                    </div>
                                </div>

                                {/* Bottom Content (Slide Up) */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <Heart className="h-4 w-4 fill-white text-white" />
                                            <span>Featured</span>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                                            View Post
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mobile Button */}
                <div className="mt-16 text-center md:hidden">
                    <Button
                        onClick={() => navigate('/gallery')}
                        className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl"
                    >
                        Explore Gallery
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default GalleryPreview;