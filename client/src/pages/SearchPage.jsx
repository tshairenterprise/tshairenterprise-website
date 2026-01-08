import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowUpRight, Heart, ShoppingBag, ArrowLeft, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import SEO from '../components/SEO';

const SearchPage = () => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
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

    // Filter Logic
    useEffect(() => {
        if (query.trim() === "") {
            setFilteredProducts([]);
        } else {
            const results = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(results);
        }
    }, [query, products]);

    // Dynamic Title Logic
    const seoTitle = query
        ? `Search Results for "${query}" | TS Hair Enterprise`
        : "Search Our Inventory | TS Hair Enterprise";

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 relative overflow-hidden pt-24 pb-20 transition-colors duration-500">

            {/* Inject Search SEO */}
            <SEO
                title={seoTitle}
                description="Search through our extensive catalog of Raw Indian Hair, Bulk Hair, and Extensions. Find the perfect texture and length directly from the manufacturer."
                keywords="search hair products, raw hair inventory, find hair supplier, TS Hair catalog search"
                url={window.location.href}
            />

            {/* --- AMBIENT BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-200/50 dark:bg-purple-900/10 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-normal"></div>
                <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-normal"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- SEARCH HEADER CONTAINER --- */}
                <div className="max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-top-4 duration-700">

                    {/* Floating Back Button */}
                    <div className="flex justify-start md:-ml-20 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                        >
                            <div className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-200 dark:border-slate-800 group-hover:border-primary/30 transition-all">
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span>Back</span>
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Style</span>
                        </h1>
                        <p className="text-gray-500 dark:text-slate-400">Search for textures, lengths, or specific collections.</p>
                    </div>

                    {/* --- GLOWING SEARCH BAR --- */}
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-full blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>

                        <div className="relative bg-white dark:bg-slate-900 rounded-full shadow-2xl dark:shadow-black/50 flex items-center p-2 border border-gray-100 dark:border-slate-800 z-10">
                            <div className="pl-4 pr-3 text-gray-400 dark:text-slate-500">
                                <Search className="h-6 w-6" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What are you looking for?"
                                className="w-full h-14 text-lg text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-slate-600 font-medium outline-none"
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
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mr-2">
                            <TrendingUp className="h-4 w-4" /> Trending:
                        </div>
                        {['Raw Indian', 'Curly', 'Blonde 613', 'Wavy', 'Bulk Hair'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setQuery(tag)}
                                className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-sm font-medium text-gray-600 dark:text-slate-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary hover:shadow-md transition-all active:scale-95"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- RESULTS GRID --- */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-slate-400 font-medium">Searching Inventory...</p>
                    </div>
                ) : (
                    <div className="min-h-[400px]">
                        {query && filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95">
                                <div className="bg-gray-50 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                                    <Search className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found for "{query}"</h3>
                                <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
                                    Try checking your spelling or use different keywords like "Straight", "Weft", or "Extension".
                                </p>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                {filteredProducts.map((product) => {
                                    // Price Logic
                                    let priceDisplay = "View Price";
                                    if (product.variants?.length > 0) {
                                        const prices = product.variants.map(v => Number(v.price));
                                        priceDisplay = `Starts $${Math.min(...prices)}`;
                                    } else if (product.priceRange) priceDisplay = product.priceRange;

                                    return (
                                        <div
                                            key={product._id}
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="group relative cursor-pointer flex flex-col gap-4"
                                        >
                                            {/* Image Container */}
                                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-slate-900 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10 dark:group-hover:shadow-primary/20 border border-gray-100 dark:border-slate-800/50">

                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110"
                                                />

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                {/* Top Actions */}
                                                <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 z-20">
                                                    <button className="p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors shadow-lg border border-white/20">
                                                        <Heart className="h-5 w-5" />
                                                    </button>
                                                </div>

                                                {/* Floating Button */}
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
                            // Initial Empty State
                            <div className="flex flex-col items-center justify-center py-32 opacity-40 hover:opacity-60 transition-opacity">
                                <Sparkles className="h-16 w-16 text-gray-300 dark:text-slate-600 mb-4 animate-pulse" />
                                <p className="text-lg font-medium text-gray-400 dark:text-slate-500">Start typing to explore our collection...</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default SearchPage;