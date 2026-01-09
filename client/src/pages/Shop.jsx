import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Heart, Search, Filter, ShoppingBag, TrendingUp, Sparkles, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import SEO from '../components/SEO';
import { cn } from "@/lib/utils";

const Shop = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                window.scrollTo(0, 0);

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

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">

            <SEO
                title="Shop Premium Indian Human Hair | Wholesale Price List Beldanga"
                description="Browse the complete catalog of TS Hair Enterprise. We stock Bulk Hair, Remy Single Donor, and Curly textures directly from our Beldanga factory. Export quality guaranteed."
                keywords="Buy human hair online India, Bulk hair price Beldanga, Murshidabad hair supplier catalog, Raw hair inventory, Wholesale hair extensions West Bengal"
                url={window.location.href}
            />

            {/* --- AMBIENT BACKGROUND BLOBS (Consistent Theme) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute top-[40%] left-[-20%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">

                {/* --- HEADER SECTION --- */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
                        <Sparkles className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" />
                        <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Official Store</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
                        Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">Perfect Texture</span>
                    </h1>

                    <p className="text-lg text-gray-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                        Explore our curated inventory of raw, unprocessed Indian hair. Filter by texture, length, or search for your specific style.
                    </p>
                </div>

                {/* --- STICKY CONTROL BAR (Glass Capsule) --- */}
                <div className="sticky top-24 z-40 mb-12 animate-in fade-in zoom-in-95 duration-500 delay-100">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-black/20 border border-white/50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-2 transition-all">

                        {/* Category Tabs (Scrollable) */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide items-center px-2 py-1">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={cn(
                                    "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border",
                                    selectedCategory === "All"
                                        ? "bg-gray-900 dark:bg-white text-white dark:text-slate-900 border-gray-900 dark:border-white shadow-lg scale-105"
                                        : "bg-transparent border-transparent text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                                )}
                            >
                                All Items
                            </button>

                            {categories.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={cn(
                                        "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border",
                                        selectedCategory === cat.name
                                            ? "bg-gray-900 dark:bg-white text-white dark:text-slate-900 border-gray-900 dark:border-white shadow-lg scale-105"
                                            : "bg-transparent border-transparent text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-80 group pr-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search collection..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-12 rounded-full bg-gray-50 dark:bg-slate-800 border-transparent dark:border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all dark:text-white dark:placeholder:text-slate-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- PRODUCT GRID --- */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-[450px] bg-gray-100 dark:bg-slate-900 rounded-[2rem] animate-pulse border border-gray-200 dark:border-slate-800"></div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredProducts.map((product) => {
                            let priceDisplay = "View Price";
                            if (product.variants?.length > 0) {
                                const prices = product.variants.map(v => Number(v.price));
                                priceDisplay = `Starts $${Math.min(...prices)}`;
                            } else if (product.priceRange) priceDisplay = product.priceRange;

                            return (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="group relative cursor-pointer flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-slate-900 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10 dark:group-hover:shadow-primary/20 border border-gray-100 dark:border-slate-800">

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110"
                                        />

                                        {/* Trending Badge */}
                                        {product.isBestSeller && (
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-green-700 dark:text-green-400 text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                                                    <TrendingUp className="h-3 w-3 text-green-600" /> TRENDING
                                                </div>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Floating Button */}
                                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                                            <div className="h-12 w-full rounded-xl bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center gap-2 text-white font-bold tracking-wide hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-colors shadow-lg">
                                                <ShoppingBag className="h-4 w-4" />
                                                View Details
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-1 px-1">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                                                    {product.category}
                                                </p>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="h-8 w-8 rounded-full border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100 dark:border-slate-800 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Starting at</span>
                                                <span className="text-lg font-extrabold text-primary">{priceDisplay}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-gray-100 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                            <Search className="h-10 w-10 text-gray-400 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                        <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                            We couldn't find what you're looking for. Try adjusting your filters or search terms.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                            className="rounded-full px-8 h-12 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                        >
                            Clear All Filters
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Shop;