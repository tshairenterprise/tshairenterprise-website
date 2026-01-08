import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Heart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const RelatedProducts = ({ products }) => {
    const navigate = useNavigate();

    if (!products || products.length === 0) return null;

    return (
        <div className="mt-20 border-t border-gray-200 dark:border-slate-800 pt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">You Might Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => {
                    let priceDisplay = "View Price";
                    if (product.variants?.length > 0) {
                        const prices = product.variants.map(v => Number(v.price));
                        priceDisplay = `Starts $${Math.min(...prices)}`;
                    } else if (product.priceRange) priceDisplay = product.priceRange;

                    return (
                        <div
                            key={product._id}
                            onClick={() => {
                                navigate(`/product/${product._id}`);
                                window.scrollTo(0, 0);
                            }}
                            className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden relative"
                        >
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                                <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                {product.isBestSeller && (
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-gray-900 dark:text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-20">
                                        <TrendingUp className="h-3 w-3 text-green-600" /> TRENDING
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 z-20">
                                    <Button className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur text-gray-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 font-bold h-11 rounded-xl">
                                        View Details
                                    </Button>
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{product.category}</p>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800 mt-2">
                                    <span className="text-lg font-extrabold text-primary">{priceDisplay}</span>
                                    <div className="h-9 w-9 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-gray-900 dark:group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <ArrowUpRight className="h-4 w-4 dark:text-slate-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RelatedProducts;