import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "@/lib/axios";
import { ShoppingBag, Facebook, Instagram, Twitter, Mail, Phone, MapPin, ExternalLink, ArrowRight, Heart } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [settings, setSettings] = useState(null);

    // Fetch Site Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSettings(data);
            } catch (error) {
                console.error("Error fetching settings");
            }
        };
        fetchSettings();
    }, []);

    const getLink = (url) => url?.startsWith('http') ? url : `https://${url}`;

    return (
        <footer className="relative bg-white dark:bg-slate-950 pt-24 pb-12 overflow-hidden transition-colors duration-500 border-t border-gray-100 dark:border-slate-800">

            {/* --- AMBIENT BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute -top-[20%] left-[10%] w-[600px] h-[600px] bg-purple-100/40 dark:bg-purple-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal"></div>
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

                    {/* --- 1. BRAND COLUMN --- */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 group w-fit">
                            <div className="relative h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                {/* Glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40"></div>
                                {/* Image Logo */}
                                <img src="/logo.webp" alt="Logo" className="relative h-full w-full object-contain rounded-full" />
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

                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, link: settings?.socials?.facebook, color: "hover:bg-blue-600" },
                                { icon: Instagram, link: settings?.socials?.instagram, color: "hover:bg-pink-600" },
                                { icon: Twitter, link: settings?.socials?.twitter, color: "hover:bg-sky-500" }
                            ].map((social, idx) => (
                                social.link && (
                                    <a
                                        key={idx}
                                        href={getLink(social.link)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`h-10 w-10 rounded-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-white ${social.color} hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-sm`}
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                )
                            ))}
                        </div>
                    </div>

                    {/* --- 2. QUICK LINKS --- */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6 flex items-center gap-2">
                            Explore
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Home", path: "/" },
                                { name: "Shop Collection", path: "/shop" },
                                { name: "Client Reviews", path: "/review-us" },
                                { name: "Contact Support", path: "/contact" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="group flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-700 group-hover:bg-primary transition-colors"></span>
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- 3. POLICIES & HELP --- */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">
                            Customer Care
                        </h3>
                        <ul className="space-y-4">
                            {["Shipping Policy", "Returns & Exchanges", "FAQ", "Privacy Policy", "Terms of Service"].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="group flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0 text-primary" />
                                        <span>{item}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- 4. CONTACT INFO --- */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">
                            Contact Us
                        </h3>

                        {/* Address Card */}
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all duration-300">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {settings?.address || "Loading Address..."}
                            </span>
                        </div>

                        {/* Phone & Email */}
                        <div className="space-y-2">
                            <a href={`tel:${settings?.phone}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                                <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:shadow-none transition-all">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-semibold">{settings?.phone || "Loading..."}</span>
                            </a>

                            <a href={`mailto:${settings?.email}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group">
                                <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:shadow-none transition-all">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-semibold">{settings?.email || "Loading..."}</span>
                            </a>
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
                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-primary">dgisight</span>
                            <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;