import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RelatedProducts = ({ products }) => {
    const navigate = useNavigate();

    if (!products || products.length === 0) return null;

    return (
        <div className="mt-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-3">
                        <Sparkles className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" />
                        <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Curated For You</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">You Might Also Like</h2>
                </div>
                <Button
                    variant="outline"
                    onClick={() => navigate('/shop')}
                    className="hidden md:flex rounded-full border-gray-200 dark:border-slate-800"
                >
                    View All Collection
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => {
                    let priceDisplay = "View Price";
                    if (product.variants?.length > 0) {
                        const prices = product.variants.map(v => Number(v.price));
                        priceDisplay = `$${Math.min(...prices)}`;
                    } else if (product.priceRange) {
                        priceDisplay = product.priceRange;
                    }

                    return (
                        <div
                            key={product._id}
                            onClick={() => {
                                navigate(`/product/${product._id}`);
                                window.scrollTo(0, 0);
                            }}
                            className="group relative cursor-pointer flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-700"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image Card */}
                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10">

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Trending Badge */}
                                {product.isBestSeller && (
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20 z-20">
                                        <TrendingUp className="h-3 w-3 text-green-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">Trending</span>
                                    </div>
                                )}

                                {/* Action Button (Slide Up) */}
                                <div className="absolute bottom-6 left-6 right-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 z-20">
                                    <div className="h-12 w-full rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-center gap-2 text-gray-900 dark:text-white font-bold shadow-lg">
                                        <ShoppingBag className="h-4 w-4" /> View Details
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="px-2 space-y-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                                            {product.category}
                                        </p>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">From</span>
                                        <span className="text-lg font-extrabold text-gray-900 dark:text-white">{priceDisplay}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-10 md:hidden">
                <Button onClick={() => navigate('/shop')} className="w-full h-12 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg">
                    View All Collection
                </Button>
            </div>
        </div>
    );
};

export default RelatedProducts;