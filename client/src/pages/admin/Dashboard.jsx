import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import {
    LayoutDashboard, Package, Users, MessageSquareQuote,
    TrendingUp, ArrowUpRight, Clock, AlertCircle,
    Plus, ExternalLink, Sparkles, ShoppingBag
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        products: 0,
        users: 0, // Assuming we might track users later
        reviews: 0,
        quotes: 0,
        recentQuotes: []
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ name: 'Admin' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo) setUser(userInfo);

                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                const [prodRes, quoteRes, reviewRes, msgRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/quotes/admin'),
                    api.get('/reviews/admin'),
                    api.get('/messages') // Messages count bhi add kar diya
                ]);

                setStats({
                    products: prodRes.data.length,
                    quotes: quoteRes.data.length,
                    reviews: reviewRes.data.length,
                    messages: msgRes.data.length,
                    recentQuotes: quoteRes.data.slice(0, 5)
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // --- SUB-COMPONENTS ---

    const StatCard = ({ title, value, icon: Icon, gradient, delay }) => (
        <div className={`relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom-4 ${delay}`}>
            {/* Background Blob */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                    <span>Live</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">{value}</h3>
                <p className="text-gray-500 dark:text-slate-400 font-medium text-sm">{title}</p>
            </div>
        </div>
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-primary blur-xl opacity-20 animate-pulse"></div>
                <LayoutDashboard className="h-12 w-12 text-primary animate-bounce-slow relative z-10" />
            </div>
            <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Syncing Dashboard...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">

            {/* --- 1. WELCOME BANNER --- */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 dark:bg-slate-900 text-white p-8 md:p-12 shadow-2xl">
                {/* Decorative Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-purple-300">
                            <Sparkles className="h-5 w-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Admin Control Center</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight">
                            Welcome back, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="text-gray-400 max-w-lg text-sm md:text-base">
                            Here's what's happening with your store today. You have {stats.quotes} active quotes pending review.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => window.open('/', '_blank')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 rounded-xl h-12 px-6"
                        >
                            View Live Site <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => navigate('/admin/products')}
                            className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl h-12 px-6 font-bold shadow-xl shadow-white/10"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- 2. STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Inventory"
                    value={stats.products}
                    icon={Package}
                    gradient="from-blue-500 to-cyan-500"
                    delay="delay-100"
                />
                <StatCard
                    title="Quote Requests"
                    value={stats.quotes}
                    icon={MessageSquareQuote}
                    gradient="from-orange-500 to-amber-500"
                    delay="delay-200"
                />
                <StatCard
                    title="Customer Reviews"
                    value={stats.reviews}
                    icon={TrendingUp}
                    gradient="from-green-500 to-emerald-500"
                    delay="delay-300"
                />
            </div>

            {/* --- 3. MAIN CONTENT SPLIT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Recent Activity (2/3 Width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                        <Button variant="ghost" onClick={() => navigate('/admin/quotes')} className="text-primary hover:text-primary hover:bg-primary/5">
                            View All Requests
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        {stats.recentQuotes.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                                {stats.recentQuotes.map((quote) => (
                                    <div
                                        key={quote._id}
                                        className="p-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group cursor-pointer"
                                        onClick={() => navigate('/admin/quotes')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm ${quote.status === 'Pending'
                                                    ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                                                    : 'bg-green-100 dark:bg-green-900/20 text-green-600'
                                                }`}>
                                                {quote.user?.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-primary transition-colors">
                                                    {quote.product?.name || "Product Inquiry"}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                        {quote.selectedDetails?.length}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-slate-500">•</span>
                                                    <span className="text-xs text-gray-500 dark:text-slate-400">
                                                        {new Date(quote.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${quote.status === 'Pending'
                                                    ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 border border-orange-100 dark:border-orange-900/30'
                                                    : 'bg-green-50 dark:bg-green-900/10 text-green-600 border border-green-100 dark:border-green-900/30'
                                                }`}>
                                                {quote.status}
                                            </span>
                                            <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="bg-gray-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                                </div>
                                <p className="text-gray-500 dark:text-slate-400 font-medium">No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Quick Actions (1/3 Width) */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>

                    <div className="bg-gradient-to-br from-primary/5 to-purple-50 dark:from-slate-900 dark:to-slate-800/50 p-6 rounded-[2rem] border border-primary/10 dark:border-slate-800 relative overflow-hidden">
                        {/* Blob */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                        <div className="space-y-3 relative z-10">
                            <Button
                                onClick={() => navigate('/admin/products')}
                                className="w-full justify-start h-14 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-700 shadow-sm rounded-xl text-base font-medium group"
                            >
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Manage Inventory
                            </Button>

                            <Button
                                onClick={() => navigate('/admin/settings')}
                                className="w-full justify-start h-14 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-700 shadow-sm rounded-xl text-base font-medium group"
                            >
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                Store Settings
                            </Button>

                            <div className="pt-4 mt-4 border-t border-gray-200/50 dark:border-slate-700/50">
                                <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/20">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">System Tip</p>
                                        <p className="text-xs text-yellow-600 dark:text-yellow-400/80 mt-0.5">Check Telegram alerts regularly for instant quote notifications.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;