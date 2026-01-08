import React, { useState } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, ShieldCheck, Loader2, LogOut } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

const ProfileTab = ({ user, setUser, handleLogout }) => {
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
            sooner.error("Password Mismatch", "Naya password aur confirmation password match nahi kar rahe hain.");
            return;
        }

        // 1. Loading Sooner Start
        const loadingSooner = sooner.loading("Updating Profile", "Aapka profile data server par save ho raha hai...");

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
                title: "Profile Updated!",
                description: "Aapka account safaltapoorvak update ho gaya hai.",
                variant: "success",
                duration: 3000
            });

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => window.location.reload(), 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Profile update mein gadbadi hui.";

            loadingSooner.update({
                title: "Update Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });

        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 md:space-y-8">
            <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Profile Settings</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Update your personal information.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6 md:space-y-8">
                {/* Avatar Section */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-100/50 dark:shadow-none flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                    <div className="relative group cursor-pointer shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-br from-primary to-purple-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-white dark:border-slate-800 shadow-sm relative z-10">
                            <AvatarImage src={previewAvatar} className="object-cover" />
                            <AvatarFallback className="bg-gray-900 dark:bg-slate-700 text-white text-3xl font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                            <Upload className="h-6 w-6 text-white mb-1" />
                            <span className="text-[8px] md:text-[10px] text-white font-bold uppercase tracking-wide">Upload</span>
                        </div>
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" onChange={handleFileChange} accept="image/*" />
                    </div>
                    <div className="text-center sm:text-left space-y-2">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Profile Picture</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 max-w-[200px] mx-auto sm:mx-0">Click image to upload. <br className="hidden sm:block" />Recommended size: 500x500px.</p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-[10px] font-bold rounded-full border border-purple-100 dark:border-purple-800 uppercase tracking-wider">
                            <ShieldCheck className="h-3 w-3" />
                            {user.isAdmin ? 'Administrator' : 'Verified Customer'}
                        </div>
                    </div>
                </div>

                {/* Details Form */}
                <div className="bg-gray-50/50 dark:bg-slate-900/50 p-5 md:p-8 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 md:h-14 bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl md:rounded-2xl px-4 shadow-sm dark:text-white" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase">WhatsApp Number</label>
                        <Input type="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="e.g. 917047163936" className="mt-1 h-12 md:h-14 bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl md:rounded-2xl dark:text-white" />
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">Country code ke saath number rakho.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                        <Input value={user.email} disabled className="h-12 md:h-14 bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-transparent rounded-xl md:rounded-2xl px-4 cursor-not-allowed font-medium" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">New Password</label>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12 md:h-14 bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl md:rounded-2xl px-4 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
                            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="h-12 md:h-14 bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl md:rounded-2xl px-4 dark:text-white" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row justify-end gap-4">
                    <Button type="button" onClick={handleLogout} variant="ghost" className="md:hidden h-12 text-red-500 font-bold">Log Out</Button>
                    <Button type="submit" disabled={updateLoading} className="h-12 md:h-14 px-10 rounded-xl md:rounded-2xl bg-gray-900 dark:bg-primary hover:bg-primary text-white font-bold text-base md:text-lg shadow-xl shadow-gray-200 dark:shadow-none hover:shadow-purple-200 transition-all w-full md:w-auto">
                        {updateLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;