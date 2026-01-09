import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Phone, Globe, Sparkles, Mail, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ContactSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">

            {/* --- BACKGROUND BLOBS (Hero Consistent) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Center Glow - Adjusted Size */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* --- LEFT: TYPOGRAPHY & CTA --- */}
                    <div className="flex-1 text-center lg:text-left space-y-6 animate-in slide-in-from-bottom-10 duration-700 fade-in">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Accepting New Partners</span>
                        </div>

                        {/* Heading - FIXED SIZE (Consistent with Hero) */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                            Ready to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">
                                Scale Up?
                            </span>
                        </h2>

                        <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Join 500+ global salons and distributors sourcing premium raw Indian hair directly from our factory.
                        </p>

                        {/* Main CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                            <Button
                                onClick={() => navigate('/contact')}
                                className="h-14 px-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300"
                            >
                                Get a Quote <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>

                            <Button
                                onClick={() => window.open('https://wa.me/919733555555', '_blank')}
                                variant="outline"
                                className="h-14 px-8 rounded-full border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 font-bold text-lg hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-600 dark:hover:text-green-400 transition-all"
                            >
                                <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Us
                            </Button>
                        </div>
                    </div>

                    {/* --- RIGHT: INTERACTIVE CARDS --- */}
                    <div className="flex-1 w-full grid gap-4 animate-in slide-in-from-right-10 duration-1000 delay-200 fade-in">

                        {/* Card 1: Email */}
                        <div className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-100 dark:border-slate-800 p-5 rounded-[1.5rem] flex items-center gap-5 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-default">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Email Us</p>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">tshairenterprise@gmail.com</h3>
                            </div>
                        </div>

                        {/* Card 2: Location */}
                        <div className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-100 dark:border-slate-800 p-5 rounded-[1.5rem] flex items-center gap-5 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 cursor-default">
                            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Factory Visit</p>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Murshidabad, West Bengal</h3>
                            </div>
                        </div>

                        {/* Card 3: Global */}
                        <div className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-100 dark:border-slate-800 p-5 rounded-[1.5rem] flex items-center gap-5 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1 cursor-default">
                            <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Global Shipping</p>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Exporting to 20+ Countries</h3>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;