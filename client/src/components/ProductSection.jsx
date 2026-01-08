import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Heart, Sparkles, ShoppingBag, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import api from "@/lib/axios";

const ProductSection = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);
                setProducts(prodRes.data);
                setCategories(catRes.data.sort((a, b) => a.name.localeCompare(b.name)));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(product => product.category === selectedCategory);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-gray-500 dark:text-slate-400 font-medium">Curating Collection...</p>
        </div>
    );

    return (
        <section id="products" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">

            {/* --- MODERN BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-100/50 dark:bg-purple-900/10 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-normal"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-normal"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-left space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                            <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Fresh Drops</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">Collection</span>
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                            Discover the finest raw Indian hair, ethically sourced and perfectly processed for the modern stylist.
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate('/shop')}
                        variant="outline"
                        className="hidden md:flex h-12 px-8 rounded-full border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary bg-transparent transition-all hover:shadow-lg"
                    >
                        View Full Catalog
                    </Button>
                </div>

                {/* --- FLOATING CATEGORY PILLS (Fixed Clipping) --- */}
                {/* ✅ Change: 'pb-4' ko hatakar 'py-4' kiya hai taaki upar-niche dono taraf jagah mile */}
                <div className="mb-10 flex gap-3 overflow-x-auto py-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${selectedCategory === "All"
                            ? "bg-gray-900 dark:bg-white text-white dark:text-slate-900 border-gray-900 dark:border-white shadow-lg shadow-gray-900/20 dark:shadow-white/10 scale-105"
                            : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${selectedCategory === cat.name
                                ? "bg-gray-900 dark:bg-white text-white dark:text-slate-900 border-gray-900 dark:border-white shadow-lg shadow-gray-900/20 dark:shadow-white/10 scale-105"
                                : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* --- CINEMATIC PRODUCT GRID --- */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredProducts.map((product) => {
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
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-slate-900 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10 dark:group-hover:shadow-primary/20 ring-1 ring-black/5 dark:ring-white/5">

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110"
                                        />

                                        {/* Gradient Overlay (Only visible on hover) */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Top Actions */}
                                        <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 z-20">
                                            <button className="p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors shadow-lg border border-white/20">
                                                <Heart className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Floating Glassy Button */}
                                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                                            <div className="h-12 w-full rounded-2xl bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center gap-2 text-white font-bold tracking-wide hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-colors shadow-lg">
                                                <ShoppingBag className="h-4 w-4" />
                                                View Details
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-1.5 px-1">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                    {product.category}
                                                </p>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            {/* Minimal Arrow */}
                                            <div className="h-8 w-8 rounded-full border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-dashed border-gray-100 dark:border-slate-800 mt-2">
                                            <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">From</span>
                                            <span className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
                                                {priceDisplay}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-gray-50 dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
                            <Sparkles className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-lg font-medium">No products found in this category.</p>
                        <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSelectedCategory("All")}>
                            View All Products
                        </Button>
                    </div>
                )}

                {/* Mobile View All Button */}
                <div className="mt-16 md:hidden">
                    <Button onClick={() => navigate('/shop')} className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl">
                        Explore Full Catalog
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ProductSection;