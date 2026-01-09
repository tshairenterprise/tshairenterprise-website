import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, Sparkles, ShoppingBag, Crown, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import api from "@/lib/axios";

const MostSelling = () => {
    const navigate = useNavigate();
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                // Top 4 Best Sellers
                const filtered = data.filter(p => p.isBestSeller).slice(0, 4);
                setBestSellers(filtered);
                setLoading(false);
            } catch (error) { setLoading(false); }
        };
        fetchProducts();
    }, []);

    if (loading || bestSellers.length === 0) return null;

    return (
        <section className="relative py-24 bg-gray-50 dark:bg-slate-900/50 overflow-hidden transition-colors duration-500">

            {/* --- BACKGROUND BLOBS (Gold & Purple Mix) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Gold Glow for "Premium" feel */}
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-amber-200/30 dark:bg-amber-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow"></div>
                {/* Purple Glow for Brand consistency */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 dark:bg-primary/10 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 backdrop-blur-md">
                            <Crown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400 animate-pulse" />
                            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-400">Client Favorites</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1]">
                            Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Best Sellers</span>
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                            Our most demanded textures, loved by stylists and salons worldwide for their consistency and volume.
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate('/shop')}
                        className="hidden md:flex h-12 px-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg hover:scale-105 transition-all"
                    >
                        Shop All Best Sellers <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* --- GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bestSellers.map((product, index) => {
                        let priceDisplay = "View Price";
                        if (product.variants?.length > 0) {
                            const prices = product.variants.map(v => Number(v.price));
                            priceDisplay = `$${Math.min(...prices)}`;
                        } else if (product.priceRange) priceDisplay = product.priceRange;

                        return (
                            <div
                                key={product._id}
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="group relative cursor-pointer flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-700"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image Card */}
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-500/20">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                                    {/* Floating Rank Badge (Glass) */}
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/40">
                                        <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">#{index + 1} Trending</span>
                                    </div>

                                    {/* Action Button (Slide Up) */}
                                    <div className="absolute bottom-6 left-6 right-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                        <div className="h-12 w-full rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex items-center justify-center gap-2 text-gray-900 dark:text-white font-bold shadow-lg">
                                            <ShoppingBag className="h-4 w-4" /> Buy Now
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="px-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">4.9/5 Rating</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                        </div>

                                        {/* Price Circle */}
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Starts</span>
                                            <span className="text-lg font-extrabold text-gray-900 dark:text-white">{priceDisplay}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile View Button */}
                <div className="mt-12 md:hidden">
                    <Button onClick={() => navigate('/shop')} className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl">
                        Shop Best Sellers
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default MostSelling;