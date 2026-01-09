import React, { useState } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, ShieldCheck, Loader2, Save } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

const ProfileTab = ({ user, setUser }) => {
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(user.avatar);
    const [whatsappNumber, setWhatsappNumber] = useState(user.whatsappNumber || "");
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            sooner.error("Password Mismatch", "Passwords do not match.");
            return;
        }

        const loadingSooner = sooner.loading("Updating Profile", "Syncing your data...");
        setUpdateLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            if (password.trim() !== "") formData.append('password', password);
            if (avatarFile) formData.append('avatar', avatarFile);
            formData.append('whatsappNumber', whatsappNumber);

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.put('/users/profile', formData, config);

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);

            loadingSooner.update({
                title: "Success",
                description: "Profile updated successfully.",
                variant: "success",
                duration: 3000
            });

            setPassword("");
            setConfirmPassword("");
            setTimeout(() => window.location.reload(), 1000);

        } catch (error) {
            loadingSooner.update({
                title: "Error",
                description: error.response?.data?.message || "Update failed.",
                variant: "destructive",
                duration: 5000
            });
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Profile Settings</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Manage your personal information and security.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">

                {/* 1. Avatar Section (Floating Card) */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2rem] bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800">
                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                        <Avatar className="h-28 w-28 border-4 border-white dark:border-slate-950 relative shadow-xl">
                            <AvatarImage src={previewAvatar} className="object-cover" />
                            <AvatarFallback className="bg-slate-900 text-white text-3xl font-bold">{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Upload className="h-6 w-6 text-white" />
                        </div>
                        <input type="file" className="absolute inset-0 cursor-pointer opacity-0 z-20" onChange={handleFileChange} accept="image/*" />
                    </div>

                    <div className="text-center sm:text-left space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
                            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{user.isAdmin ? 'Admin' : 'Verified User'}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 max-w-[200px]">
                            Tap the image to upload a new photo. <br />JPG, PNG or WEBP.
                        </p>
                    </div>
                </div>

                {/* 2. Form Fields */}
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 ml-1">Display Name</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl bg-white dark:bg-slate-900/80 border-gray-200 dark:border-slate-800 focus:border-primary focus:ring-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 ml-1">WhatsApp</label>
                            <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="h-12 rounded-xl bg-white dark:bg-slate-900/80 border-gray-200 dark:border-slate-800 focus:border-primary focus:ring-primary/20" placeholder="+91..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 ml-1">Email (Read Only)</label>
                        <Input value={user.email} disabled className="h-12 rounded-xl bg-gray-100 dark:bg-slate-900 border-transparent text-gray-500 cursor-not-allowed" />
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Change Password</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="h-12 rounded-xl bg-white dark:bg-slate-900/80 border-gray-200 dark:border-slate-800" />
                            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="h-12 rounded-xl bg-white dark:bg-slate-900/80 border-gray-200 dark:border-slate-800" />
                        </div>
                    </div>
                </div>

                {/* 3. Action */}
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={updateLoading} className="h-12 px-8 rounded-xl bg-primary hover:bg-purple-700 text-white font-bold shadow-lg shadow-primary/25 transition-all">
                        {updateLoading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2"><Save className="h-4 w-4" /> Save Changes</span>}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;