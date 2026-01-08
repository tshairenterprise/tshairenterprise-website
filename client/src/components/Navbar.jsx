import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, LogOut, User as UserIcon, Sun, Moon, Laptop, Check, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MyAccountModal from './MyAccountModal';
import { useTheme } from '../context/ThemeContext';
import { cn } from "@/lib/utils";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const { theme, setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);
    }, [location, isAccountOpen]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/admin/login');
    };

    const CurrentThemeIcon = () => {
        if (theme === 'system') return <Laptop className="h-5 w-5" />;
        return theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
    };

    const navLinks = [
        { name: 'Products', href: '/shop' },
        { name: 'Our Blogs', href: '/blogs' },
        { name: 'Review Us', href: '/review-us' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-500 ease-in-out",
                    isScrolled
                        ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 shadow-sm"
                        : "bg-transparent border-b border-transparent"
                )}
            >
                {/* Optional: Top Gradient Line for aesthetic pop */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex justify-between items-center">

                        {/* --- LEFT: LOGO --- */}
                        <Link to="/" className="flex items-center gap-3 group shrink-0">
                            <div className="relative">
                                {/* Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                                {/* Image */}
                                <img
                                    src="/logo.webp"
                                    alt="Logo"
                                    className="relative h-12 w-12 object-contain group-hover:scale-105 transition-transform duration-300 rounded-full"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl leading-none text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                                    TS Hair
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] group-hover:tracking-[0.25em] transition-all">
                                    Enterprise
                                </span>
                            </div>
                        </Link>

                        {/* --- CENTER: DESKTOP LINKS --- */}
                        <div className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 px-2 py-1.5 rounded-full border border-gray-100 dark:border-slate-800 backdrop-blur-sm shadow-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={cn(
                                        "relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 overflow-hidden group",
                                        location.pathname === link.href
                                            ? "text-gray-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm"
                                            : "text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100/50 dark:hover:bg-slate-800/50"
                                    )}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {location.pathname === link.href && (
                                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* --- RIGHT: ICONS & USER MENU --- */}
                        <div className="flex items-center gap-3">

                            {/* Theme Switcher */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2.5 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all focus:outline-none active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-slate-700">
                                        <CurrentThemeIcon />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 p-2 bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-xl rounded-2xl">
                                    <div className="px-2 py-1.5 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Sparkles className="h-3 w-3" /> Appearance
                                    </div>
                                    {[
                                        { val: 'light', label: 'Light Mode', icon: Sun },
                                        { val: 'dark', label: 'Dark Mode', icon: Moon },
                                        { val: 'system', label: 'System Sync', icon: Laptop },
                                    ].map((item) => (
                                        <DropdownMenuItem
                                            key={item.val}
                                            onClick={() => setTheme(item.val)}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all mb-1",
                                                theme === item.val
                                                    ? "bg-primary/5 dark:bg-slate-800 shadow-sm border border-primary/10 dark:border-slate-700"
                                                    : "hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={cn("h-4 w-4", theme === item.val ? "text-primary" : "text-gray-500 dark:text-slate-400")} />
                                                <span className={cn("text-sm font-medium", theme === item.val ? "text-primary font-bold" : "text-gray-700 dark:text-slate-300")}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            {theme === item.val && <Check className="h-4 w-4 text-primary" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Search Button */}
                            <button
                                onClick={() => navigate('/search')}
                                className="p-2.5 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {/* User Profile */}
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="outline-none rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all active:scale-95 ml-1">
                                            <Avatar className="h-10 w-10 cursor-pointer border-2 border-white dark:border-slate-800 shadow-md">
                                                <AvatarImage src={user.avatar} className="object-cover" />
                                                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-bold">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-60 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-2xl p-2">
                                        <div className="px-4 py-3 mb-2 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-sm font-bold leading-none dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground dark:text-slate-500 mt-1 truncate">{user.email}</p>
                                        </div>

                                        <DropdownMenuItem className="cursor-pointer gap-3 p-3 rounded-xl dark:text-slate-300 dark:focus:bg-slate-800" onClick={() => setIsAccountOpen(true)}>
                                            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                                <UserIcon className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">My Account</span>
                                        </DropdownMenuItem>

                                        {user.isAdmin && (
                                            <DropdownMenuItem className="cursor-pointer gap-3 p-3 rounded-xl dark:text-slate-300 dark:focus:bg-slate-800" onClick={() => navigate('/admin/dashboard')}>
                                                <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                                                    <ShoppingBag className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">Admin Dashboard</span>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator className="dark:bg-slate-800 my-1" />

                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-3 p-3 rounded-xl text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10">
                                            <div className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                                                <LogOut className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <button
                                    onClick={() => navigate('/admin/login')}
                                    className="ml-2 hidden sm:flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    <UserIcon className="h-4 w-4" />
                                    <span>Sign In</span>
                                </button>
                            )}

                            {/* Mobile Hamburger Menu */}
                            <div className="md:hidden ml-1">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-full">
                                            <Menu className="h-6 w-6" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[300px] bg-white dark:bg-slate-950 border-l border-gray-200 dark:border-slate-800 p-0">
                                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shadow-lg">
                                                <ShoppingBag className="h-5 w-5" />
                                            </div>
                                            <span className="font-extrabold text-xl text-gray-900 dark:text-white">TS Hair</span>
                                        </div>

                                        <div className="p-4 flex flex-col gap-2">
                                            {navLinks.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    to={link.href}
                                                    className="flex items-center justify-between p-4 rounded-2xl text-base font-semibold text-gray-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-900 transition-all"
                                                >
                                                    {link.name}
                                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-slate-700"></div>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="p-4 mt-auto border-t border-gray-100 dark:border-slate-800">
                                            {user ? (
                                                <button onClick={() => setIsAccountOpen(true)} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 text-left transition-all active:scale-95">
                                                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-slate-700">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{user.name}</p>
                                                        <p className="text-xs text-gray-500">My Settings</p>
                                                    </div>
                                                </button>
                                            ) : (
                                                <Button onClick={() => navigate('/admin/login')} className="w-full h-12 rounded-xl text-base font-bold shadow-lg">Sign In / Register</Button>
                                            )}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <MyAccountModal isOpen={isAccountOpen} onOpenChange={setIsAccountOpen} />
        </>
    );
};

export default Navbar;