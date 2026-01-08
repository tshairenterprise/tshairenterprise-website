import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Heart, Star, TrendingUp, Sparkles, ShoppingBag } from "lucide-react";
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
                // Filter best sellers and take top 4
                const filtered = data.filter(p => p.isBestSeller).slice(0, 4);
                setBestSellers(filtered);
                setLoading(false);
            } catch (error) { setLoading(false); }
        };
        fetchProducts();
    }, []);

    if (loading || bestSellers.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50/50 dark:bg-slate-950/50 relative overflow-hidden transition-colors duration-500">

            {/* --- GOLDEN GLOW BACKGROUND --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-100/40 dark:bg-amber-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8 text-center lg:text-left">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 backdrop-blur-sm mx-auto lg:mx-0">
                            <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400 animate-pulse" />
                            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300">Customer Favorites</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                            Our Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Coveted</span>
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 font-medium text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            These styles are flying off the shelves. Validated by professionals worldwide for their unmatched quality.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/shop')}
                        className="hidden lg:flex h-12 px-8 rounded-full border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 bg-transparent transition-all hover:shadow-lg"
                    >
                        View Full Collection
                    </Button>
                </div>

                {/* --- PRODUCT GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {bestSellers.map((product) => {
                        let priceDisplay = "View Price";
                        if (product.variants && product.variants.length > 0) {
                            const prices = product.variants.map(v => Number(v.price));
                            priceDisplay = `$${Math.min(...prices)}`;
                        } else if (product.priceRange) priceDisplay = product.priceRange;

                        return (
                            <div
                                key={product._id}
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="group relative cursor-pointer flex flex-col gap-4"
                            >
                                {/* Image Container - Tall & Elegant */}
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 shadow-lg shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-slate-800 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-500/10 dark:group-hover:shadow-amber-500/10 group-hover:-translate-y-2">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Trending Badge */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-amber-700 dark:text-amber-400 text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                                            <TrendingUp className="h-3 w-3" /> #1 SELLER
                                        </div>
                                    </div>

                                    {/* Heart Button */}
                                    <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 z-20">
                                        <button className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors shadow-lg">
                                            <Heart className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Bottom Floating Action */}
                                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                                        <div className="h-12 w-full rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 font-bold tracking-wide hover:bg-amber-400 transition-colors">
                                            <ShoppingBag className="h-4 w-4" />
                                            Quick View
                                        </div>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="px-2 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
                                                {product.category}
                                            </p>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300 line-clamp-1">
                                                {product.name}
                                            </h3>
                                        </div>

                                        {/* Minimal Arrow */}
                                        <div className="h-8 w-8 rounded-full border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:border-amber-500 group-hover:text-amber-500 transition-all duration-300">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1 border-t border-dashed border-gray-200 dark:border-slate-800 mt-3">
                                        <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">Starting at</span>
                                        <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                                            {priceDisplay}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Button */}
                <div className="mt-12 lg:hidden">
                    <Button onClick={() => navigate('/shop')} className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl">
                        Shop Best Sellers
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default MostSelling;