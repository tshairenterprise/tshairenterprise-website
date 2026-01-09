import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User, FileText, Settings, LogOut, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import ProfileTab from './account/ProfileTab';
import ReviewsTab from './account/ReviewsTab';
import SettingsTab from './account/SettingsTab';
import { cn } from "@/lib/utils";

// ✅ FIX: Component Extracted Outside
const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={cn(
            "flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 w-full",
            isActive
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
        )}
    >
        <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400 dark:text-slate-500")} />
        {label}
        {isActive && <Sparkles className="ml-auto h-4 w-4 opacity-50 animate-pulse" />}
    </button>
);

const MyAccountModal = ({ isOpen, onOpenChange }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            setUser(userInfo);
        }
    }, [isOpen]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        onOpenChange(false);
        navigate('/admin/login');
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-5xl p-0 overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl rounded-[2.5rem] h-[85vh] flex flex-col md:flex-row gap-0 outline-none">

                {/* --- BACKGROUND BLOBS (Internal) --- */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]"></div>
                </div>

                {/* --- SIDEBAR --- */}
                <div className="w-full md:w-80 bg-gray-50/50 dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800 flex flex-col p-6 md:p-8 shrink-0">

                    {/* User Mini Profile */}
                    <div className="flex items-center gap-4 mb-8 p-4 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-blue-500 rounded-full blur opacity-30"></div>
                            <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 relative">
                                <AvatarImage src={user.avatar} className="object-cover" />
                                <AvatarFallback className="bg-primary text-white font-bold">{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">{user.name}</h2>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Nav Items (Using Extracted Component) */}
                    <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide -mx-2 px-2 md:mx-0 md:px-0">
                        <TabButton
                            id="profile"
                            label="Profile Details"
                            icon={User}
                            isActive={activeTab === 'profile'}
                            onClick={setActiveTab}
                        />
                        <TabButton
                            id="reviews"
                            label="My Reviews"
                            icon={FileText}
                            isActive={activeTab === 'reviews'}
                            onClick={setActiveTab}
                        />
                        <TabButton
                            id="preferences"
                            label="Appearance"
                            icon={Settings}
                            isActive={activeTab === 'preferences'}
                            onClick={setActiveTab}
                        />
                    </nav>

                    {/* Logout */}
                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all w-full group"
                        >
                            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* --- CONTENT AREA --- */}
                <div className="flex-1 overflow-y-auto scrollbar-hide relative p-6 md:p-10 lg:p-12">
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'profile' && <ProfileTab user={user} setUser={setUser} handleLogout={handleLogout} />}
                        {activeTab === 'reviews' && <ReviewsTab user={user} />}
                        {activeTab === 'preferences' && <SettingsTab />}
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default MyAccountModal;