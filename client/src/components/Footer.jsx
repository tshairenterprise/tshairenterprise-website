import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "@/lib/axios";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Send,
    MessageCircle,
    MessageSquare,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    ArrowRight,
    Heart,
    ShieldCheck
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [settings, setSettings] = useState(null);

    // Fetch Site Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSettings(Array.isArray(data) ? data[0] : data);
            } catch (error) {
                console.error("Error fetching settings");
            }
        };
        fetchSettings();
    }, []);

    // Helper for URLs
    const getLink = (url) => url?.startsWith('http') ? url : `https://${url}`;

    return (
        <footer className="relative bg-white dark:bg-slate-950 pt-24 pb-10 overflow-hidden transition-colors duration-500 border-t border-gray-100 dark:border-slate-800">

            {/* --- AMBIENT BACKGROUND BLOBS (Hero Sync) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Bottom Left - Purple Blob */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                {/* Top Right - Blue Blob */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

                    {/* --- 1. BRAND COLUMN (Span 4) --- */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center gap-3 group w-fit">
                            <div className="relative h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                {/* Glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40"></div>
                                {/* Image Logo */}
                                <img src="/logo.webp" alt="TS Hair Logo" className="relative h-full w-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-2xl leading-none text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                                    TS Hair
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                    Enterprise
                                </span>
                            </div>
                        </Link>

                        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                            Exporting premium raw Indian temple hair globally. Ethically sourced, unprocessed, and delivered with love.
                        </p>

                        <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full w-fit">
                            <ShieldCheck className="h-4 w-4" />
                            100% Verified Manufacturer
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-3 pt-2 flex-wrap">
                            {[
                                { icon: Facebook, link: settings?.socials?.facebook, color: "hover:bg-blue-600 hover:border-blue-600" },
                                { icon: Instagram, link: settings?.socials?.instagram, color: "hover:bg-pink-600 hover:border-pink-600" },
                                { icon: Twitter, link: settings?.socials?.twitter, color: "hover:bg-sky-500 hover:border-sky-500" },

                                { icon: Youtube, link: settings?.socials?.youtube, color: "hover:bg-red-600 hover:border-red-600" },
                                { icon: Send, link: settings?.socials?.telegram, color: "hover:bg-sky-600 hover:border-sky-600" },
                                { icon: MessageCircle, link: settings?.socials?.wechat, color: "hover:bg-emerald-600 hover:border-emerald-600" },
                                { icon: MessageSquare, link: settings?.socials?.zalo, color: "hover:bg-indigo-600 hover:border-indigo-600" },
                            ].map((social, idx) => (
                                social.link && social.link.trim() !== "#" && (
                                    <a
                                        key={idx}
                                        href={getLink(social.link)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-white ${social.color} transition-all duration-300 hover:-translate-y-1 shadow-sm`}
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                )
                            ))}
                        </div>
                    </div>

                    {/* --- 2. LINKS (Span 2) --- */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6 flex items-center gap-2">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Home", path: "/" },
                                { name: "Shop Collection", path: "/shop" },
                                { name: "Our Gallery", path: "/gallery" },
                                { name: "Blog Journal", path: "/blogs" },
                                { name: "Client Reviews", path: "/review-us" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="group flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        <ArrowRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- 3. POLICIES (Span 2) --- */}
                    <div className="lg:col-span-2">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            {["Contact Us", "Shipping Policy", "Returns", "Privacy Policy", "Terms of Service"].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === "Contact Us" ? "/contact" : "#"}
                                        className="group flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        <ArrowRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                                        <span>{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- 4. CONTACT INFO CARD (Span 3) --- */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-gray-100 dark:border-slate-800">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">
                                Contact Info
                            </h3>

                            <div className="space-y-4">
                                {/* Address */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 h-8 w-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                                        {settings?.address || "Murshidabad, West Bengal, India"}
                                    </p>
                                </div>

                                {/* Phone */}
                                <a href={`tel:${settings?.phone}`} className="flex items-center gap-3 group">
                                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-blue-500 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors">
                                        {settings?.phone || "Loading..."}
                                    </span>
                                </a>

                                {/* Email */}
                                <a href={`mailto:${settings?.email}`} className="flex items-center gap-3 group">
                                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-purple-500 shadow-sm group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-purple-500 transition-colors">
                                        {settings?.email || "Loading..."}
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- BOTTOM BAR --- */}
                <div className="pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-xs text-gray-500 dark:text-slate-500 font-medium">
                        &copy; {currentYear} TS Hair Enterprise. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-slate-600">Built with</span>
                        <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
                        <span className="text-xs text-gray-400 dark:text-slate-600">by</span>
                        <a
                            href="https://dgisight.oxzeen.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-colors group"
                        >
                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">dgisight</span>
                            <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;