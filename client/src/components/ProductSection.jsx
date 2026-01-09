import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Heart, Sparkles, ShoppingBag, Loader2, Filter } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

// ✅ FIX: Component ko bahar define kiya (Outside main component)
const CategoryTab = ({ name, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "relative group px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out flex-shrink-0 select-none",
            isActive
                ? "text-white shadow-lg shadow-primary/25 scale-105 ring-4 ring-primary/10"
                : "bg-white/60 dark:bg-slate-900/60 text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary border border-gray-200 dark:border-slate-800"
        )}
    >
        {/* Active Background Gradient */}
        {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full -z-10 animate-in fade-in zoom-in-95 duration-300"></div>
        )}

        <span className="relative z-10 flex items-center gap-2">
            {isActive && <Sparkles className="h-3 w-3 animate-pulse" />}
            {name}
        </span>
    </button>
);

const ProductSection = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
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
        <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white dark:bg-slate-950">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Curating Collection...</p>
        </div>
    );

    return (
        <section className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">

            {/* --- ANIMATED BACKGROUND BLOBS --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[700px] h-[700px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-8">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" />
                            <span className="text-[11px] font-bold tracking-widest uppercase text-primary">New Arrivals</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1]">
                            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">Collection</span>
                        </h2>
                    </div>

                    <Button
                        onClick={() => navigate('/shop')}
                        className="hidden md:flex h-12 px-8 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all hover:scale-105"
                    >
                        View Full Catalog <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* --- MODERN STICKY CATEGORY TABS --- */}
                <div className="sticky top-20 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 pointer-events-none">
                    <div className="pointer-events-auto overflow-x-auto pb-6 pt-2 scrollbar-hide mask-image-linear-gradient">
                        <div className="flex gap-3 px-1">
                            {/* Render CategoryTab properly */}
                            <CategoryTab
                                name="All Textures"
                                isActive={selectedCategory === "All"}
                                onClick={() => setSelectedCategory("All")}
                            />
                            {categories.map((cat) => (
                                <CategoryTab
                                    key={cat._id}
                                    name={cat.name}
                                    isActive={selectedCategory === cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- PRODUCT GRID --- */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => {
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
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="group relative cursor-pointer animate-in fade-in zoom-in-95 duration-700"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10">

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Action Button */}
                                        <div className="absolute bottom-6 left-6 right-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                            <div className="h-12 w-full rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-center gap-2 text-gray-900 dark:text-white font-bold shadow-lg">
                                                <ShoppingBag className="h-4 w-4" /> View Details
                                            </div>
                                        </div>

                                        {/* Bestseller Tag */}
                                        {product.isBestSeller && (
                                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm border border-white/20">
                                                Best Seller
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="mt-5 space-y-1 px-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                                                    {product.category}
                                                </p>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
                            <Filter className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-lg font-medium">No products found in this category.</p>
                        <Button variant="outline" className="mt-6 rounded-full border-primary/20 text-primary" onClick={() => setSelectedCategory("All")}>
                            View All Products
                        </Button>
                    </div>
                )}

                <div className="mt-16 md:hidden">
                    <Button onClick={() => navigate('/shop')} className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20">
                        Explore Full Catalog
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default ProductSection;