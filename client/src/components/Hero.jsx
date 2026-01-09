import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, Globe, ShieldCheck, PlayCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-bg.webp'; // Ensure this image exists

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative bg-white dark:bg-slate-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 transition-colors duration-500">

            {/* --- ANIMATED BACKGROUND BLOBS (Subtle & Modern) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Top Right Blob - Violet/Purple */}
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>

                {/* Bottom Left Blob - Blue/Indigo */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* --- LEFT CONTENT (Text & CTA) --- */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">

                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
                            <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                #1 Rated Hair Exporter in India
                            </span>
                        </div>

                        {/* H1 SEO Title - 2 Lines */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
                            Premium Raw Indian <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                                Human Hair
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-xl leading-relaxed">
                            Source 100% unprocessed temple hair directly from the manufacturer.
                            We supply salons and distributors globally with consistent, luxury quality bundles.
                        </p>

                        {/* Trust Points */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" /> 100% Virgin Hair
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" /> Wholesale Pricing
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" /> Global Shipping
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Button
                                onClick={() => navigate('/shop')}
                                className="h-14 px-8 rounded-full bg-primary hover:bg-purple-700 text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all hover:scale-105"
                            >
                                Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>

                            <Button
                                onClick={() => navigate('/contact')}
                                variant="outline"
                                className="h-14 px-8 rounded-full border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                            >
                                <Globe className="mr-2 h-5 w-5" /> Export Inquiry
                            </Button>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT (Image & Floating Elements) --- */}
                    <div className="relative animate-in slide-in-from-right-10 duration-1000 fade-in delay-200">

                        {/* Main Image Container with Blob Mask */}
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                            {/* Overlay Gradient for Text readability if needed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>

                            <img
                                src={heroImage}
                                alt="Premium Indian Human Hair Bundles"
                                className="w-full h-[500px] lg:h-[600px] object-cover hover:scale-105 transition-transform duration-1000"
                            />
                        </div>

                        {/* Floating Card 1: Verified Quality */}
                        <div className="absolute top-10 -left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 flex items-center gap-3 animate-bounce-slow z-20">
                            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Quality Check</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">100% Verified</p>
                            </div>
                        </div>

                        {/* Floating Card 2: Global Reach */}
                        <div className="absolute bottom-10 -right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 flex items-center gap-3 animate-bounce-slow delay-700 z-20">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">We Export To</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">20+ Countries</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;