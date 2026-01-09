import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon, Sun, Moon, Laptop, ShoppingBag, Search, Sparkles } from 'lucide-react';
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

const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={cn(
                "relative text-sm font-semibold transition-colors duration-300 hover:text-primary",
                isActive ? "text-primary font-bold" : "text-gray-600 dark:text-gray-300"
            )}
        >
            {children}
            {/* Active Indicator Dot */}
            {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
            )}
        </Link>
    );
};

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const { theme, setTheme } = useTheme();

    // ✅ FIX 2: Lazy Initialization for User State
    // Yeh initial render par hi localStorage check kar lega, useEffect ki zarurat nahi padegi initial load ke liye.
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Scroll Detection
    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ✅ FIX 3: Re-check User ONLY when location changes (Safe update)
    // Yeh ensure karega ki agar user login/logout kare toh UI update ho, bina infinite loop ke.
    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        // Sirf tab update karein jab data actually change hua ho
        if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
            setUser(parsedUser);
        }
    }, [location.pathname, user]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/admin/login');
    };

    return (
        <>
            {/* --- FLOATING NAVBAR CONTAINER --- */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ease-in-out",
                isScrolled ? "pt-2" : "pt-4 md:pt-6"
            )}>
                <nav className={cn(
                    "w-full max-w-7xl rounded-full transition-all duration-500 border relative overflow-hidden",
                    // Glassmorphism Styles
                    "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800 shadow-xl shadow-purple-900/5",
                    isScrolled ? "py-2 px-4 md:px-6" : "py-3 px-6 md:px-8"
                )}>

                    {/* Background Subtle Gradient Blob inside Nav */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                    <div className="flex items-center justify-between">

                        {/* 1. LOGO */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="/logo.webp" alt="TS Hair Logo" className="h-8 md:h-10 w-auto relative z-10 transition-transform group-hover:scale-105 rounded-full" />
                            </div>
                            <div className="">
                                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-none">TS Hair</span>
                                <span className="text-[10px] font-medium text-primary block tracking-widest uppercase">Enterprise</span>
                            </div>
                        </Link>

                        {/* 2. DESKTOP NAV LINKS (Uses extracted component) */}
                        <div className="hidden md:flex items-center gap-8 bg-gray-50/50 dark:bg-slate-800/50 px-8 py-2.5 rounded-full border border-gray-100 dark:border-slate-700/50">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/shop">Products</NavLink>
                            <NavLink to="/gallery">Gallery</NavLink>
                            <NavLink to="/blogs">Blogs</NavLink>
                            <NavLink to="/review-us">Review Us</NavLink>
                            <NavLink to="/contact">Contact</NavLink>
                        </div>

                        {/* 3. RIGHT ACTIONS */}
                        <div className="flex items-center gap-2 md:gap-4">

                            {/* Theme Toggle */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary">
                                        {theme === 'light' ? <Sun className="h-5 w-5" /> : theme === 'dark' ? <Moon className="h-5 w-5" /> : <Laptop className="h-5 w-5" />}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-gray-100 dark:border-slate-800">
                                    <DropdownMenuItem onClick={() => setTheme("light")}><Sun className="mr-2 h-4 w-4" /> Light</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}><Moon className="mr-2 h-4 w-4" /> Dark</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}><Laptop className="mr-2 h-4 w-4" /> System</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Search Icon */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/search')}
                                className="hidden sm:flex rounded-full h-9 w-9 text-gray-500 hover:text-primary hover:bg-primary/10"
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* User Profile / Login */}
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage src={user.avatar} className="object-cover" />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {user.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-gray-100 dark:border-slate-800 shadow-xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
                                        <DropdownMenuLabel>
                                            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-gray-500 font-normal truncate">{user.email}</p>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-gray-100 dark:bg-slate-800" />

                                        {user.isAdmin && (
                                            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')} className="cursor-pointer rounded-lg hover:bg-primary/10 hover:text-primary">
                                                <Sparkles className="mr-2 h-4 w-4" /> Admin Dashboard
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuItem onClick={() => setIsAccountOpen(true)} className="cursor-pointer rounded-lg hover:bg-primary/10 hover:text-primary">
                                            <UserIcon className="mr-2 h-4 w-4" /> My Account
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="bg-gray-100 dark:bg-slate-800" />
                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    onClick={() => navigate('/admin/login')}
                                    className="hidden sm:flex rounded-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-primary hover:text-white border-0 shadow-lg shadow-purple-500/10 font-bold px-6"
                                >
                                    Sign In
                                </Button>
                            )}

                            {/* 4. MOBILE MENU (Hamburger) */}
                            <div className="md:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full text-gray-700 dark:text-white">
                                            <Menu className="h-6 w-6" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[300px] border-l border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-0">
                                        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                                        <SheetDescription className="sr-only">Navigation links</SheetDescription>

                                        <div className="flex flex-col h-full">
                                            {/* Mobile Header */}
                                            <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-primary font-bold text-xl">
                                                        TS
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">TS Hair Enterprise</p>
                                                        <p className="text-xs text-gray-500">Premium Quality Exports</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile Links */}
                                            <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                                                {[
                                                    { name: 'Home', path: '/' },
                                                    { name: 'Our Products', path: '/shop' },
                                                    { name: 'Our Gallery', path: '/gallery' },
                                                    { name: 'Latest Blogs', path: '/blogs' },
                                                    { name: 'Review Us', path: '/review-us' },
                                                    { name: 'Contact Us', path: '/contact' },
                                                    { name: 'Search', path: '/search' }
                                                ].map((item) => (
                                                    <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        className={cn(
                                                            "flex items-center p-3 rounded-xl transition-all font-medium",
                                                            location.pathname === item.path
                                                                ? "bg-primary/10 text-primary font-bold"
                                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                                                        )}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Mobile Footer (User) */}
                                            <div className="p-6 border-t border-gray-100 dark:border-slate-800">
                                                {user ? (
                                                    <button
                                                        onClick={() => setIsAccountOpen(true)}
                                                        className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800"
                                                    >
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={user.avatar} />
                                                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="text-left">
                                                            <p className="font-bold text-sm text-gray-900 dark:text-white">{user.name}</p>
                                                            <p className="text-xs text-gray-500">Manage Account</p>
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <Button onClick={() => navigate('/admin/login')} className="w-full h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-purple-500/20">
                                                        Sign In / Register
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                        </div>
                    </div>
                </nav>
            </div>

            {/* Account Modal (Hidden) */}
            <MyAccountModal isOpen={isAccountOpen} onOpenChange={setIsAccountOpen} />
        </>
    );
};

export default Navbar;