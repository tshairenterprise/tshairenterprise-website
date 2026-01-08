import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, LogOut, ShoppingBag,
    FolderKanban, MessageSquareQuote, ClipboardList,
    ChevronRight, Settings, BookOpen, HelpCircle, Sparkles, Mail, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const AdminSidebar = ({ isSidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/admin/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Inventory', path: '/admin/products', icon: Package },
        { name: 'Categories', path: '/admin/categories', icon: FolderKanban },
        { name: 'Quotes', path: '/admin/quotes', icon: ClipboardList },
        { name: 'Messages', path: '/admin/messages', icon: Mail },
        { name: 'Feedback', path: '/admin/reviews', icon: MessageSquareQuote },
        { name: 'Blogs', path: '/admin/blogs', icon: BookOpen },
        { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
        { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="h-full flex flex-col text-slate-800 dark:text-slate-200">

            {/* --- LOGO SECTION --- */}
            <div className={cn("h-24 flex items-center shrink-0 transition-all duration-300", isSidebarOpen ? "px-8 justify-start" : "justify-center")}>
                <div className="relative group cursor-pointer">
                    {/* Glow Effect behind logo */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

                    {/* ✅ IMAGE LOGO */}
                    <img
                        src="/logo.webp"
                        alt="TS Hair Logo"
                        className="relative h-12 w-12 object-contain drop-shadow-md rounded-md"
                    />
                </div>

                {isSidebarOpen && (
                    <div className="ml-4 animate-in fade-in slide-in-from-left-4 duration-500">
                        <h1 className="font-extrabold text-xl text-gray-900 dark:text-white leading-none tracking-tight">
                            TS Hair
                        </h1>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Admin Panel</span>
                        </div>
                    </div>
                )}
            </div>

            {/* --- NAVIGATION MENU --- */}
            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "group flex items-center w-full p-3.5 rounded-xl transition-all duration-300 relative overflow-hidden outline-none focus:ring-2 focus:ring-primary/20",
                                isActive
                                    ? "bg-gradient-to-r from-primary/10 to-transparent text-primary dark:text-white"
                                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white",
                                !isSidebarOpen && "justify-center px-0"
                            )}
                        >
                            {/* Active Indicator Bar */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                            )}

                            <Icon className={cn(
                                "h-5 w-5 shrink-0 transition-all duration-300",
                                isActive ? "text-primary dark:text-white drop-shadow-sm" : "group-hover:scale-110"
                            )} />

                            {isSidebarOpen && (
                                <div className="flex items-center justify-between flex-1 ml-4 overflow-hidden">
                                    <span className={cn("font-semibold text-sm truncate", isActive ? "font-bold" : "font-medium")}>
                                        {item.name}
                                    </span>
                                    {isActive && <ChevronRight className="h-4 w-4 opacity-50 animate-in slide-in-from-left-2" />}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* --- LOGOUT SECTION --- */}
            <div className="p-4 mt-auto">
                <Dialog>
                    <DialogTrigger asChild>
                        <button className={cn(
                            "flex items-center w-full p-3.5 rounded-xl transition-all border border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:shadow-lg hover:-translate-y-0.5 group",
                            !isSidebarOpen && "justify-center"
                        )}>
                            <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:rotate-12" />
                            {isSidebarOpen && <span className="ml-3 font-bold text-sm">Sign Out</span>}
                        </button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md z-[150] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-white">Sign Out?</DialogTitle>
                            <DialogDescription className="text-gray-500 dark:text-slate-400">
                                You will be returned to the login screen.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-2">
                            <DialogClose asChild><Button variant="ghost" className="dark:text-slate-300 dark:hover:bg-slate-800">Cancel</Button></DialogClose>
                            <Button variant="destructive" onClick={handleLogout} className="shadow-lg shadow-red-500/20">Confirm Logout</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default AdminSidebar;