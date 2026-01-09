import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowUpRight, Heart, ShoppingBag, ArrowLeft, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import SEO from '../components/SEO';
import { cn } from "@/lib/utils";

const SearchPage = () => {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // ✅ FIX 1: 'filteredProducts' state hata diya kyunki hum isse directly calculate karenge
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products");
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Auto-focus input on load
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // ✅ FIX 2: Filter Logic ko variable mein convert kiya (Derived State)
    // Ab ye har render par calculate hoga bina useEffect ke loop ke.
    const filteredProducts = query.trim() === ""
        ? []
        : products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );

    // Dynamic Title Logic
    const seoTitle = query
        ? `Search Results for "${query}" | TS Hair Enterprise`
        : "Search Our Inventory | TS Hair Enterprise";

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden pt-32 pb-20 transition-colors duration-500">

            {/* Inject Search SEO */}
            <SEO
                title={seoTitle}
                description="Search through our extensive catalog of Raw Indian Hair, Bulk Hair, and Extensions. Find the perfect texture and length directly from the manufacturer."
                keywords="search hair products, raw hair inventory, find hair supplier, TS Hair catalog search"
                url={window.location.href}
            />

            {/* --- AMBIENT BACKGROUND BLOBS (Consistent Theme) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- SEARCH HEADER CONTAINER --- */}
                <div className="max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-top-4 duration-700">

                    {/* Floating Back Button */}
                    <div className="flex justify-start md:-ml-20 mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 gap-2 text-gray-500 dark:text-slate-400 pl-2 pr-4 h-10"
                        >
                            <div className="p-1.5 bg-white dark:bg-slate-900 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
                                <ArrowLeft className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-bold text-sm">Back</span>
                        </Button>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">Perfect Match</span>
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">Search for textures, lengths, or specific collections.</p>
                    </div>

                    {/* --- GLOWING SEARCH BAR --- */}
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-indigo-500 rounded-full blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>

                        <div className="relative bg-white dark:bg-slate-900 rounded-full shadow-2xl shadow-gray-200/50 dark:shadow-black/20 flex items-center p-2 border border-gray-100 dark:border-slate-800 z-10">
                            <div className="pl-4 pr-3 text-gray-400 dark:text-slate-500">
                                <Search className="h-6 w-6" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What are you looking for?"
                                className="w-full h-14 text-xl text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-slate-600 font-medium outline-none"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className="p-2 mr-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full text-gray-500 dark:text-slate-400 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* --- QUICK TAGS --- */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mr-2">
                            <TrendingUp className="h-3.5 w-3.5" /> Trending:
                        </div>
                        {['Raw Indian', 'Curly', 'Blonde 613', 'Wavy', 'Bulk Hair'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setQuery(tag)}
                                className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-sm font-bold text-gray-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary dark:hover:text-primary hover:shadow-md transition-all active:scale-95"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- RESULTS GRID --- */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 opacity-50">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Searching Inventory...</p>
                    </div>
                ) : (
                    <div className="min-h-[400px]">
                        {query && filteredProducts.length === 0 ? (
                            <div className="text-center py-32 bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
                                <div className="bg-white dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Search className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found for "{query}"</h3>
                                <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
                                    Try checking your spelling or use different keywords like "Straight", "Weft", or "Extension".
                                </p>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                {filteredProducts.map((product, index) => {
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
                                            className="group relative cursor-pointer flex flex-col gap-4"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            {/* Image Card */}
                                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-slate-900 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10 border border-gray-100 dark:border-slate-800">

                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                />

                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                {/* Trending Badge */}
                                                {product.isBestSeller && (
                                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20 z-20">
                                                        <TrendingUp className="h-3 w-3 text-green-500" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">Trending</span>
                                                    </div>
                                                )}

                                                {/* Action Button */}
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
                        ) : (
                            // Initial Empty State
                            <div className="flex flex-col items-center justify-center py-32 opacity-40 hover:opacity-60 transition-opacity">
                                <Sparkles className="h-16 w-16 text-gray-300 dark:text-slate-600 mb-4 animate-pulse" />
                                <p className="text-xl font-bold text-gray-400 dark:text-slate-500">Start typing to explore our collection...</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default SearchPage;