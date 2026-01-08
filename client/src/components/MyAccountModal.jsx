import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User, FileText, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import ProfileTab from './account/ProfileTab';
import ReviewsTab from './account/ReviewsTab';
import SettingsTab from './account/SettingsTab';

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
            <DialogContent className="w-[95vw] max-w-5xl p-0 overflow-hidden bg-white dark:bg-slate-950 border-0 shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem] h-[90vh] md:h-[85vh] flex flex-col md:flex-row gap-0 transition-colors duration-300">

                {/* --- SIDEBAR --- */}
                <div className="w-full md:w-72 bg-gray-50/80 dark:bg-slate-900/50 backdrop-blur-md border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-800 flex flex-col p-5 md:p-8 relative shrink-0">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-white dark:border-slate-700 shadow-sm">
                                <AvatarImage src={user.avatar} className="object-cover" />
                                <AvatarFallback className="bg-primary text-white font-bold">{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight truncate max-w-[150px]">{user.name}</h2>
                                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">My Account</p>
                            </div>
                        </div>

                        <nav className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0">
                            {[
                                { id: 'profile', label: 'Profile', icon: User },
                                { id: 'reviews', label: 'Reviews', icon: FileText },
                                { id: 'preferences', label: 'Settings', icon: Settings },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-4 rounded-full md:rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 ${activeTab === item.id
                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-none scale-105'
                                        : 'text-gray-500 dark:text-slate-400 bg-white dark:bg-transparent border md:border-0 border-gray-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:text-primary dark:hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`h-4 w-4 md:h-5 md:w-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400 dark:text-slate-500 group-hover:text-primary'}`} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <button onClick={handleLogout} className="hidden md:flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:shadow-sm transition-all mt-auto">
                            <LogOut className="h-5 w-5" /> Log Out
                        </button>
                    </div>
                </div>

                {/* --- CONTENT AREA --- */}
                <div className="flex-1 p-5 md:p-12 overflow-y-auto relative bg-white dark:bg-slate-950 scrollbar-hide text-gray-900 dark:text-gray-100">
                    <div className="relative z-10 max-w-2xl mx-auto pb-10">
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