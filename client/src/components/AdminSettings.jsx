import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Save,
    Globe,
    Phone,
    MessageCircle,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Settings,
    Loader2,
    Send,
    MessageSquare
} from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

// Helper Component for Section Card
const SettingsCard = ({ title, icon: Icon, colorClass, bgClass, blobColor, children }) => (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group">
        {/* Decorative Gradient Blob */}
        <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none ${blobColor}`}></div>

        <div className="p-8 relative z-10">
            <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-2xl ${bgClass} ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

const AdminSettings = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        socials: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            telegram: '',
            wechat: '',
            zalo: ''
        },
        whatsapp: { number: '', message: '' },
        productWhatsapp: { number: '', message: '' },
        telegram: { enabled: false, botToken: "", chatId: "" },
        mapUrl: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get("/settings");
                if (data) {
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        socials: { ...prev.socials, ...(data.socials || {}) },
                        whatsapp: { ...prev.whatsapp, ...(data.whatsapp || {}) },
                        productWhatsapp: { ...prev.productWhatsapp, ...(data.productWhatsapp || {}) },
                        telegram: { ...prev.telegram, ...(data.telegram || {}) },
                    }));
                }
            } catch (error) {
                sooner.error("Fetch Error", "Failed to load current site configurations."); // Fetch Error
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (section, field, value) => {
        if (section) {
            setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Loading Sooner Start
        const loadingSooner = sooner.loading(
            "Saving Configuration",
            "Applying global settings to the database..."
        );

        setLoading(true);
        try {
            await api.put('/settings', formData);

            // 2. Success Sooner Update
            loadingSooner.update({
                title: "Settings Saved!",
                description: "Configuration updated successfully. Live site changes will reflect shortly.",
                variant: "success",
                duration: 3000
            });

        } catch (error) {

            // 3. Error Sooner Update
            loadingSooner.update({
                title: "Update Failed",
                description: error.response?.data?.message || "Error saving settings. Check network or API keys.",
                variant: "destructive",
                duration: 5000
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen pb-32">

            {/* --- HEADER --- */}
            <div className="flex items-center gap-5 mb-12">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900 shadow-inner flex items-center justify-center border border-white/50 dark:border-slate-700">
                    <Settings className="h-8 w-8 text-gray-700 dark:text-white animate-spin-slow" />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Configuration</span>
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 font-medium mt-1">
                        Manage contact info, social links, and integrations from one place.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* --- 1. CONTACT DETAILS (Blue Theme) --- */}
                <SettingsCard
                    title="Contact Information"
                    icon={Phone}
                    colorClass="text-blue-600 dark:text-blue-400"
                    bgClass="bg-blue-50 dark:bg-blue-900/20"
                    blobColor="bg-blue-500"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest ml-1">Support Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    value={formData.email}
                                    onChange={(e) => handleChange(null, 'email', e.target.value)}
                                    className="pl-11 h-12 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all"
                                    placeholder="contact@domain.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest ml-1">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => handleChange(null, 'phone', e.target.value)}
                                    className="pl-11 h-12 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all"
                                    placeholder="+91 00000 00000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest ml-1">Warehouse Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                                <Textarea
                                    value={formData.address}
                                    onChange={(e) => handleChange(null, 'address', e.target.value)}
                                    className="pl-11 py-3 min-h-[100px] bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl dark:text-white resize-none focus:bg-white dark:focus:bg-slate-900 transition-all"
                                    placeholder="Full address here..."
                                />
                            </div>
                        </div>
                    </div>
                </SettingsCard>

                {/* --- 2. SOCIAL MEDIA (Pink/Purple Theme) --- */}
                <SettingsCard
                    title="Social Media Links"
                    icon={Globe}
                    colorClass="text-pink-600 dark:text-pink-400"
                    bgClass="bg-pink-50 dark:bg-pink-900/20"
                    blobColor="bg-pink-500"
                >
                    <div className="grid grid-cols-1 gap-5">
                        {['facebook', 'instagram', 'twitter', 'youtube', 'telegram', 'wechat', 'zalo'].map((platform) => (
                            <div key={platform} className="flex items-center gap-4 group/item">
                                <div
                                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 ${platform === 'facebook'
                                            ? 'bg-blue-100 text-blue-600'
                                            : platform === 'instagram'
                                                ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white'
                                                : platform === 'twitter'
                                                    ? 'bg-sky-100 text-sky-500'
                                                    : platform === 'youtube'
                                                        ? 'bg-red-100 text-red-600'
                                                        : platform === 'telegram'
                                                            ? 'bg-sky-100 text-sky-600'
                                                            : platform === 'wechat'
                                                                ? 'bg-emerald-100 text-emerald-600'
                                                                : 'bg-indigo-100 text-indigo-600'
                                        }`}
                                >
                                    {platform === 'facebook' && <Facebook className="h-5 w-5" />}
                                    {platform === 'instagram' && <Instagram className="h-5 w-5" />}
                                    {platform === 'twitter' && <Twitter className="h-5 w-5" />}
                                    {platform === 'youtube' && <Youtube className="h-5 w-5" />}
                                    {platform === 'telegram' && <Send className="h-5 w-5" />}
                                    {platform === 'wechat' && <MessageCircle className="h-5 w-5" />}
                                    {platform === 'zalo' && <MessageSquare className="h-5 w-5" />}
                                </div>
                                <Input
                                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                                    value={formData.socials[platform] || ""}
                                    onChange={(e) => handleChange('socials', platform, e.target.value)}
                                    className="h-12 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl dark:text-white focus:bg-white dark:focus:bg-slate-900"
                                />
                            </div>
                        ))}
                    </div>
                </SettingsCard>

                {/* --- 3. INTEGRATIONS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* General WhatsApp (Green) */}
                    <SettingsCard
                        title="General WhatsApp"
                        icon={MessageCircle}
                        colorClass="text-green-600 dark:text-green-400"
                        bgClass="bg-green-50 dark:bg-green-900/20"
                        blobColor="bg-green-500"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 dark:text-slate-400">WhatsApp Number</Label>
                                <Input value={formData.whatsapp.number} onChange={(e) => handleChange('whatsapp', 'number', e.target.value)} className="bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl h-11" placeholder="e.g. 917047163936" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 dark:text-slate-400">Welcome Message</Label>
                                <Input value={formData.whatsapp.message} onChange={(e) => handleChange('whatsapp', 'message', e.target.value)} className="bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl h-11" />
                            </div>
                        </div>
                    </SettingsCard>

                    {/* Telegram (Sky Blue) */}
                    <SettingsCard
                        title="Telegram Alerts"
                        icon={Send}
                        colorClass="text-sky-600 dark:text-sky-400"
                        bgClass="bg-sky-50 dark:bg-sky-900/20"
                        blobColor="bg-sky-500"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 dark:text-slate-400">Bot Token</Label>
                                <Input type="password" value={formData.telegram.botToken} onChange={(e) => handleChange('telegram', 'botToken', e.target.value)} className="bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 dark:text-slate-400">Chat ID</Label>
                                <Input value={formData.telegram.chatId} onChange={(e) => handleChange('telegram', 'chatId', e.target.value)} className="bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl h-11" />
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <input type="checkbox" checked={!!formData.telegram.enabled} onChange={(e) => handleChange("telegram", "enabled", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                                <span className="text-sm font-semibold text-gray-600 dark:text-slate-300">Enable Bot Notifications</span>
                            </div>
                        </div>
                    </SettingsCard>
                </div>

                {/* --- 4. PRODUCT & MAP GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Product WhatsApp (Emerald) */}
                    <SettingsCard
                        title="Product Inquiries"
                        icon={MessageSquare}
                        colorClass="text-emerald-600 dark:text-emerald-400"
                        bgClass="bg-emerald-50 dark:bg-emerald-900/20"
                        blobColor="bg-emerald-500"
                    >
                        <div className="space-y-4">
                            <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">
                                Used for the "Get Quote on WhatsApp" button on product pages.
                            </p>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 dark:text-slate-400">Product Number</Label>
                                <Input value={formData.productWhatsapp?.number || ''} onChange={(e) => handleChange('productWhatsapp', 'number', e.target.value)} className="bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 dark:text-slate-400">Default Text</Label>
                                <Input value={formData.productWhatsapp?.message || ''} onChange={(e) => handleChange('productWhatsapp', 'message', e.target.value)} className="bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl h-11" />
                            </div>
                        </div>
                    </SettingsCard>

                    {/* Google Map (Orange/Red) */}
                    <SettingsCard
                        title="Map Integration"
                        icon={MapPin}
                        colorClass="text-orange-600 dark:text-orange-400"
                        bgClass="bg-orange-50 dark:bg-orange-900/20"
                        blobColor="bg-orange-500"
                    >
                        <div className="space-y-4">
                            <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">
                                Paste the 'src' link from Google Maps Embed HTML.
                            </p>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 dark:text-slate-400">Embed URL</Label>
                                <Textarea
                                    rows={4}
                                    value={formData.mapUrl}
                                    onChange={(e) => handleChange(null, 'mapUrl', e.target.value)}
                                    className="bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl font-mono text-xs resize-none"
                                />
                            </div>
                        </div>
                    </SettingsCard>
                </div>

                {/* --- STICKY SAVE BUTTON --- */}
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-2 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 shadow-2xl">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-14 px-10 bg-gray-900 dark:bg-primary hover:bg-primary hover:scale-105 text-white font-bold text-lg rounded-xl shadow-lg transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <span className="flex items-center gap-2"><Save className="h-5 w-5" /> Save Changes</span>}
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default AdminSettings;