import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";
import SEO from '../components/SEO';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        whatsappNumber: '',
        subject: '',
        message: ''
    });

    // Fetch Settings on Load
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSettings(data);
            } catch (error) {
                sooner.error("Configuration Error", "Failed to load site contact details.", 5000);
            }
        };
        fetchSettings();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get user info if logged in
        const userInfoRaw = localStorage.getItem('userInfo');
        const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;

        const { name, lastName, email, whatsappNumber, subject, message } = formData;

        // Final payload structure
        const payload = {
            name: `${name} ${lastName}`,
            email,
            whatsappNumber,
            subject,
            message,
            userId: userInfo?._id || null
        };

        // Basic client-side validation
        if (!name || !email || !whatsappNumber || !message) {
            sooner.error("Missing Fields", "Please ensure Name, Email, WhatsApp, and Message are filled.", 5000);
            return;
        }

        // 1. Loading Sooner Start
        const loadingSooner = sooner.loading(
            "Sending Message",
            "Your inquiry is being sent to our export team..."
        );

        setLoading(true);

        try {
            // Submit to new backend route
            await api.post('/messages', payload);

            // 2. Success Sooner Update
            loadingSooner.update({
                title: "Message Sent!",
                description: "We have received your message. We will contact you shortly.",
                variant: "success",
                duration: 4000
            });

            setLoading(false);
            setFormData({ name: '', lastName: '', email: '', whatsappNumber: '', subject: '', message: '' });

        } catch (error) {

            const errorMessage = error.response?.data?.message || "Error submitting form. Check network or server connection.";

            // 3. Error Sooner Update
            loadingSooner.update({
                title: "Submission Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });

            setLoading(false);
        }
    };

    const handleWhatsAppChat = () => {
        if (!settings?.whatsapp?.number) {
            sooner.error("Contact Error", "WhatsApp number is not configured by the admin.", 5000);
            return;
        }

        const { number, message } = settings.whatsapp;
        const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        // Info Sooner for External Chat
        sooner.info("Opening WhatsApp", "Redirecting to WhatsApp chat. Keep the pre-filled message.", 4000);
    };

    // Helper for Contact Cards
    const ContactCard = ({ icon: Icon, title, value, href, colorClass, bgClass, borderColor }) => (
        <a
            href={href}
            className={`group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block`}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${bgClass} opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500`}></div>

            <div className="flex items-start gap-5 relative z-10">
                <div className={`p-4 rounded-2xl ${bgClass} ${colorClass} group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                    <p className={`text-base font-medium mt-1 ${colorClass} group-hover:underline underline-offset-4 decoration-2`}>
                        {value || "Loading..."}
                    </p>
                </div>
            </div>
        </a>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 relative overflow-hidden pt-24 pb-20 transition-colors duration-500">

            <SEO
                title="Contact Us | TS Hair Enterprise - Beldanga, Murshidabad"
                description="Visit our factory at Begun bari, Beldanga (742133). Contact MD Sabir Ahamed for bulk hair export inquiries via WhatsApp or Email. Worldwide shipping available."
                keywords="TS Hair address Beldanga, contact hair exporter Murshidabad, MD Sabir Ahamed phone number, Begun bari Beldanga hair factory, 742133 hair supplier"
                url={window.location.href}
            />

            {/* --- ANIMATED BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-purple-200/40 dark:bg-purple-900/10 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-normal animate-pulse-slow"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-normal animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 px-4 py-1.5 rounded-full shadow-sm mb-6 backdrop-blur-md">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold tracking-wider uppercase text-gray-600 dark:text-slate-400">Response time: &lt; 2 Hours</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">Touch</span>
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                        Have a question about bulk orders, custom textures, or shipping? Our team is ready to assist you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* --- LEFT: CONTACT CARDS --- */}
                    <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">

                        <ContactCard
                            icon={Phone}
                            title="Call Us Directly"
                            value={settings?.phone}
                            href={`tel:${settings?.phone}`}
                            colorClass="text-blue-600 dark:text-blue-400 group-hover:text-blue-600"
                            bgClass="bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100"
                        />

                        <ContactCard
                            icon={Mail}
                            title="Email Support"
                            value={settings?.email}
                            href={`mailto:${settings?.email}`}
                            colorClass="text-purple-600 dark:text-purple-400 group-hover:text-purple-600"
                            bgClass="bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-100"
                        />

                        <ContactCard
                            icon={MapPin}
                            title="Visit Warehouse"
                            value={settings?.address}
                            href="#"
                            colorClass="text-orange-600 dark:text-orange-400 group-hover:text-orange-600"
                            bgClass="bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100"
                        />

                        {/* Special WhatsApp Card */}
                        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-white shadow-xl shadow-emerald-500/20 group hover:shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                                        <MessageSquare className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Chat on WhatsApp</h3>
                                </div>
                                <p className="text-emerald-50 mb-8 text-sm leading-relaxed opacity-90">
                                    Need a quick quote or want to see live video of stock? Chat with our export manager instantly.
                                </p>
                                <Button
                                    onClick={handleWhatsAppChat}
                                    className="w-full h-12 bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl shadow-lg border-0 transition-transform hover:-translate-y-0.5"
                                >
                                    Start Chat Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                    </div>

                    {/* --- RIGHT: CONTACT FORM --- */}
                    <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/50 dark:border-slate-800 shadow-2xl dark:shadow-none relative overflow-hidden">

                            {/* Form Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    Send us a Message <Sparkles className="h-5 w-5 text-primary" />
                                </h2>
                                <p className="text-gray-500 dark:text-slate-400 mt-1">We usually reply within 24 hours.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">First Name</label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John"
                                            className="h-14 rounded-2xl bg-gray-50/50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all dark:text-white" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Last Name</label>
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Doe"
                                            className="h-14 rounded-2xl bg-gray-50/50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all dark:text-white" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Email Address</label>
                                        <Input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            type="email"
                                            placeholder="john@company.com"
                                            className="h-14 rounded-2xl bg-gray-50/50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all dark:text-white" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">WhatsApp Number (with code)</label>
                                        <Input
                                            name="whatsappNumber"
                                            value={formData.whatsappNumber}
                                            onChange={handleInputChange}
                                            type="tel"
                                            placeholder="e.g. 917047163936"
                                            className="h-14 rounded-2xl bg-gray-50/50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all dark:text-white" required />
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 pl-1">Include country code, no spaces.</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Subject</label>
                                    <Input
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder="Wholesale Inquiry / Custom Order"
                                        className="h-14 rounded-2xl bg-gray-50/50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all dark:text-white" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Message</label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about your requirements (texture, length, quantity)..."
                                        className="min-h-[180px] rounded-2xl bg-gray-50/50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 resize-none transition-all p-5 text-base dark:text-white"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-primary dark:to-purple-600 text-white shadow-xl shadow-gray-200 dark:shadow-primary/20 hover:scale-[1.01] transition-all"
                                >
                                    {loading ? "Sending..." : <span className="flex items-center gap-2">Send Message <Send className="h-5 w-5" /></span>}
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>

                {/* --- MAP SECTION --- */}
                <div className="mt-24 relative group">
                    {/* Glowing border behind map */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="w-full h-[450px] bg-gray-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border-4 border-white dark:border-slate-800">
                        <iframe
                            src={settings?.mapUrl || "about:blank"}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            className="grayscale hover:grayscale-0 transition-all duration-700 opacity-90 hover:opacity-100"
                        ></iframe>

                        {/* Overlay Badge */}
                        <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-6 py-3 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700 pointer-events-none">
                            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Headquarters</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Murshidabad, West Bengal</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;