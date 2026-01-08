import React, { useState } from 'react';
import { Menu, Settings, LogOut, Sun, Moon, Laptop, Check, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminSidebar from './AdminSidebar';
import AdminProfileModal from './AdminProfileModal';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { cn } from "@/lib/utils";

const AdminNavbar = ({ isSidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/admin/login');
    };

    // Helper: Current Icon Display
    const CurrentThemeIcon = () => {
        if (theme === 'system') return <Laptop className="h-5 w-5" />;
        return theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
    };

    return (
        <>
            {/* --- LEFT SIDE: TOGGLE & TITLE --- */}
            <div className="flex items-center gap-4">

                {/* Mobile Trigger */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72 border-r-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-[100]">
                            <div className="h-full"><AdminSidebar isSidebarOpen={true} /></div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Toggle */}
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="hidden lg:flex p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 dark:text-slate-400 transition-all active:scale-95"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Breadcrumb / Title */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight leading-none">
                        Dashboard
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-slate-500 font-medium mt-0.5">
                        Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋
                    </p>
                </div>
            </div>

            {/* --- RIGHT SIDE: ACTIONS --- */}
            <div className="flex items-center gap-3">

                {/* Notifications (Visual only) */}
                <button className="p-2.5 rounded-full text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-primary transition-all relative group">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-slate-800 mx-1"></div>

                {/* Theme Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2.5 rounded-full border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all focus:outline-none hover:shadow-md">
                            <CurrentThemeIcon />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-2 bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-xl rounded-2xl">
                        <div className="px-2 py-1.5 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Theme</div>
                        {[
                            { val: 'light', label: 'Light', icon: Sun },
                            { val: 'dark', label: 'Dark', icon: Moon },
                            { val: 'system', label: 'System', icon: Laptop },
                        ].map((item) => (
                            <DropdownMenuItem
                                key={item.val}
                                onClick={() => setTheme(item.val)}
                                className={cn(
                                    "flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all mb-1",
                                    theme === item.val
                                        ? "bg-primary/10 dark:bg-primary/20 text-primary font-bold"
                                        : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </div>
                                {theme === item.val && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700 group">
                            <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                                <AvatarImage src={user?.avatar} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-xs">
                                    {user?.name?.charAt(0) || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block text-left mr-1">
                                <p className="text-xs font-bold text-gray-700 dark:text-slate-200 leading-none group-hover:text-primary transition-colors">
                                    {user?.name?.split(' ')[0] || 'Admin'}
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">Administrator</p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xl p-2">
                        <DropdownMenuLabel className="px-2 py-1.5">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">My Account</p>
                            <p className="text-xs text-gray-500 dark:text-slate-500 truncate">{user?.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="dark:bg-slate-800" />

                        <div className="space-y-1">
                            <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer gap-2 p-2.5 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 focus:bg-gray-50 dark:focus:bg-slate-800">
                                <Settings className="h-4 w-4" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 p-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 focus:bg-red-50 dark:focus:bg-red-900/10">
                                <LogOut className="h-4 w-4" /> Logout
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Profile Modal */}
            <AdminProfileModal isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} />
        </>
    );
};

export default AdminNavbar;