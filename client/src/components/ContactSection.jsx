import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Phone, Globe, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ContactSection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">

            {/* --- MODERN BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
                {/* Large Center Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-200/30 to-blue-200/30 dark:from-purple-900/10 dark:to-blue-900/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- MAIN GLASS CARD --- */}
                <div className="relative rounded-[3rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl">

                    {/* Inner Gradient Mesh */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-purple-50/40 dark:from-white/5 dark:to-purple-900/5 pointer-events-none"></div>

                    <div className="px-6 py-20 md:px-20 text-center relative z-10">

                        {/* Live Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm mb-8">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-[11px] font-bold tracking-widest uppercase text-gray-500 dark:text-slate-400">
                                Support Online
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
                            Ready to Elevate <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-blue-600">
                                Your Brand?
                            </span>
                        </h2>

                        <p className="text-lg text-gray-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Whether you need a custom bulk order or just want to chat about textures, our export experts are here to help you scale.
                        </p>

                        {/* --- FEATURE GRID (Floating Chips) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                            {/* Card 1 */}
                            <div className="group flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/70 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                                    <MessageCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">24/7 Chat</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Instant responses on WhatsApp</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="group flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/70 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Global Shipping</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Fast delivery to 50+ countries</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="group flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/70 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
                                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Direct Line</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Talk to export managers</p>
                                </div>
                            </div>

                        </div>

                        {/* CTA Button */}
                        <div className="relative inline-block group">
                            {/* Glow behind button */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

                            <Button
                                onClick={() => navigate('/contact')}
                                className="relative h-14 px-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl hover:scale-[1.02] transition-all duration-300 border-0"
                            >
                                Start a Conversation <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;