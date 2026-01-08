import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle, Globe, Star, ShieldCheck } from "lucide-react";
import { useNavigate } from 'react-router-dom';

import heroImage from '../assets/hero-bg.webp';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative bg-white dark:bg-slate-950 overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-32 transition-colors duration-500">

            {/* --- ANIMATED BACKGROUND BLOBS --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Top Left Blob */}
                <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-gradient-to-br from-purple-300/30 to-blue-300/30 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow"></div>

                {/* Bottom Right Blob */}
                <div className="absolute top-[20%] -right-[20%] w-[600px] h-[600px] bg-gradient-to-tl from-pink-300/30 to-orange-300/30 dark:from-pink-900/20 dark:to-orange-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* --- LEFT SIDE: CONTENT --- */}
                    <div className="flex flex-col text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                        {/* Premium Badge */}
                        <div className="inline-flex items-center justify-center lg:justify-start gap-2 mx-auto lg:mx-0">
                            <div className="px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-purple-100 dark:border-slate-700 shadow-sm flex items-center gap-2 group cursor-default transition-all hover:border-purple-300 dark:hover:border-purple-700">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                </span>
                                <span className="text-xs font-bold tracking-widest uppercase text-gray-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    Export Quality Guaranteed
                                </span>
                            </div>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                            The Ultimate <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-pink-600 dark:from-primary dark:to-blue-400">
                                Luxury Texture
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Raw, unprocessed Indian temple hair. Sourced ethically for salons and brands that demand nothing but perfection.
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            {[
                                { icon: Globe, text: "Worldwide Shipping" },
                                { icon: ShieldCheck, text: "100% Raw Human Hair" },
                                { icon: Star, text: "5-Star Rated Supplier" }
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-700 backdrop-blur-sm">
                                    <feature.icon className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Button
                                onClick={() => navigate('/shop')}
                                className="h-14 px-10 text-lg bg-gray-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-slate-200 rounded-full shadow-xl shadow-purple-900/10 transition-transform hover:-translate-y-1 font-bold"
                            >
                                Shop Collection
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/contact')}
                                className="h-14 px-10 text-lg border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary rounded-full bg-transparent transition-all"
                            >
                                Bulk Inquiry <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: IMAGE COMPOSITION --- */}
                    <div className="relative lg:h-[750px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0 perspective-1000">

                        {/* Decorative Circle Behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-purple-100 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

                        {/* Main Image Container */}
                        <div className="relative w-full max-w-lg aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl dark:shadow-black/50 border-[6px] border-white dark:border-slate-800 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out">
                            {/* Changed object-center to object-top to show head */}
                            <img
                                src={heroImage}
                                alt="Premium Raw Indian Hair model"
                                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000 ease-out"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                        </div>

                        {/* Floating Glass Card 1 (Bottom Left) */}
                        <div className="absolute bottom-20 -left-4 sm:left-0 lg:-left-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 pr-6 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 animate-bounce-slow flex items-center gap-4 max-w-[220px]">
                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Texture</p>
                                <p className="text-sm font-extrabold text-gray-900 dark:text-white">Natural Wavy</p>
                            </div>
                        </div>

                        {/* Floating Glass Card 2 (Positioned Bottom on Mobile, Top Right on Desktop) */}
                        {/* Mobile: bottom-10 right-4 | Desktop: lg:top-20 lg:bottom-auto lg:-right-8 */}
                        <div className="absolute -bottom-6 -right-2 lg:bottom-auto lg:top-20 sm:right-0 lg:-right-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 animate-bounce-slow delay-700">
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-xs font-bold text-gray-600 dark:text-slate-300">"Best quality hair I've used!"</p>
                            <p className="text-[10px] text-gray-400 mt-1">- Sarah J., UK</p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;