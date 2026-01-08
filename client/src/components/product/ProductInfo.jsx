import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Globe, Clock, MessageCircle, AlertCircle, CheckCircle2, Loader2, Send, Zap } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

const ProductInfo = ({ product, siteSettings, userInfo }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- STATES ---
    const [mainImage, setMainImage] = useState("");
    const [selectedLength, setSelectedLength] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [currentPrice, setCurrentPrice] = useState("");
    const [quoteLoading, setQuoteLoading] = useState(false);

    // Derived State for Images
    const allImages = product ? [product.image, ...(product.gallery || [])].filter(Boolean) : [];

    // Initialize Defaults
    useEffect(() => {
        if (product) {
            const images = [product.image, ...(product.gallery || [])].filter(Boolean);
            if (images.length > 0) setMainImage(images[0]);

            if (product.colors?.length > 0) setSelectedColor(product.colors[0]);

            if (product.variants && product.variants.length > 0) {
                setSelectedLength(product.variants[0].length);
                setCurrentPrice(product.variants[0].price);
            } else {
                setCurrentPrice(product.priceRange || "Contact for Price");
            }
        }
    }, [product]);

    // --- HANDLERS ---
    const handleLengthSelect = (variant) => {
        setSelectedLength(variant.length);
        setCurrentPrice(variant.price);
    };

    const handleRequestQuote = async () => {
        if (!userInfo) {
            // Sooner for Login Check
            sooner.error("Login Required", "Please sign in to request a custom quote.", 4000);
            navigate("/admin/login", { state: { from: location } });
            return;
        }

        if (!selectedLength || !selectedColor || !currentPrice) {
            // Sooner for Validation Check
            sooner.error("Missing Selection", "Please select Length, Shade, and ensure a Price is set before requesting a quote.", 5000);
            return;
        }

        // 1. Loading Sooner Start (Interactive)
        const loadingSooner = sooner.loading(
            "Sending Quote Request",
            `Requesting price for ${product.name} (${selectedLength}/${selectedColor})...`
        );

        setQuoteLoading(true);
        try {
            await api.post("/quotes", {
                productId: product._id,
                selectedDetails: {
                    length: selectedLength,
                    color: selectedColor,
                    price: String(currentPrice),
                },
            });

            // 2. Success Sooner Update
            loadingSooner.update({
                title: "Quote Sent!",
                description: "Admin will reach out to you within 3-4 hours via WhatsApp/Email.",
                variant: "quote",
                duration: 8000
            });

        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Failed to send request. Check your network.";

            // 3. Error Sooner Update
            loadingSooner.update({
                title: "Request Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });

        } finally {
            setQuoteLoading(false);
        }
    };

    const handleGetQuoteWhatsApp = () => {
        if (!product) return;

        const number = siteSettings?.productWhatsapp?.number || siteSettings?.whatsapp?.number;

        if (!number) {
            sooner.error("Configuration Error", "WhatsApp number not configured in Admin Settings.", 5000); // Sooner for config error
            return;
        }

        const baseMessage = siteSettings?.productWhatsapp?.message || "Hi, I saw this hair product on your website.";

        const text =
            `${baseMessage}\n\n` +
            `🧾 *Product Details*\n` +
            `- Name: ${product.name}\n` +
            `- Category: ${product.category}\n` +
            `- Length: ${selectedLength || "Not selected"}\n` +
            `- Shade/Color: ${selectedColor || "Not selected"}\n` +
            `- Est. Price: ${currentPrice ? `$${currentPrice}` : "Contact for price"}\n\n` +
            `Please share best wholesale price and a live video of this texture. ✨`;

        const url = `https://api.whatsapp.com/send?phone=${String(number).replace(/[^\d]/g, "")}&text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");

        // Sooner for initiating external chat
        sooner.info("Opening WhatsApp", "Redirecting to WhatsApp chat. Please ensure your browser pop-ups are allowed.", 4000);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-slate-600"}`}
            />
        ));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* --- LEFT: GALLERY SECTION --- */}
            <div className="flex flex-col gap-6">
                <div className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 shadow-2xl shadow-gray-200 dark:shadow-none border-4 border-white dark:border-slate-800">
                    <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-all duration-500 hover:scale-105" />

                    {product.isBestSeller && (
                        <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-gray-900 dark:text-white text-xs font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> BEST SELLER
                        </div>
                    )}
                </div>

                {/* Thumbnail Strip */}
                {allImages.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                        {allImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(img)}
                                className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-sm
                            ${mainImage === img ? 'border-primary ring-2 ring-primary/20 scale-95 opacity-100' : 'border-transparent dark:border-slate-800 opacity-70 hover:opacity-100 hover:scale-105'}`}
                            >
                                <img src={img} alt={`thumb-${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- RIGHT: PRODUCT INFO --- */}
            <div className="flex flex-col pt-2">

                <div className="mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-3">{product.name}</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md border border-yellow-100 dark:border-yellow-900/30">
                            {renderStars(product.rating || 0)}
                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500 ml-1">{product.rating || 0}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-slate-400 font-medium hover:text-primary cursor-pointer underline decoration-dotted">
                            {product.reviewCount || 0} Verified Reviews
                        </span>
                    </div>
                </div>

                {/* Price Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-white dark:border-slate-800 shadow-lg shadow-purple-100/50 dark:shadow-none mb-8">
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">Estimated Price</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                            {typeof currentPrice === 'number' ? `$${currentPrice}` : currentPrice}
                        </p>
                        {typeof currentPrice === 'number' && <span className="text-gray-400 dark:text-slate-500 font-medium">/ bundle</span>}
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-100 dark:border-purple-900/30 w-fit">
                        <AlertCircle className="h-4 w-4" />
                        <span>Price varies based on length selection.</span>
                    </div>
                </div>

                {/* Selectors */}
                <div className="space-y-8 mb-10">
                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Select Shade</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${selectedColor === color
                                            ? 'bg-gray-900 dark:bg-primary text-white border-gray-900 dark:border-primary shadow-lg scale-105'
                                            : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lengths */}
                    {product.variants && product.variants.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Select Length (Inches)</h3>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant._id || variant.length}
                                        onClick={() => handleLengthSelect(variant)}
                                        className={`py-2.5 text-sm font-semibold rounded-xl border-2 transition-all duration-200 ${selectedLength === variant.length
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-purple-200 dark:shadow-none scale-105'
                                            : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-primary/40 hover:text-primary'
                                            }`}
                                    >
                                        {variant.length}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Highlights */}
                <div className="mb-8 p-6 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                    {product.stock < 10 && <p className="text-red-600 dark:text-red-400 font-bold text-sm animate-pulse mb-4">🔥 Hurry! Only {product.stock} units left in stock.</p>}
                    {product.highlights && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" /> Product Highlights
                            </h3>
                            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: product.highlights }} />
                        </div>
                    )}
                </div>

                {/* --- MODERN ACTION BUTTONS --- */}
                <div className="flex flex-col gap-4">

                    {/* 1. Request Quote Button (Purple Gradient with Glow) */}
                    <button
                        onClick={handleRequestQuote}
                        disabled={quoteLoading}
                        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-[2px] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 shadow-xl shadow-violet-500/30 transition-all hover:scale-[1.01] hover:shadow-violet-500/50"
                    >
                        <div className="relative flex h-14 w-full items-center justify-center rounded-2xl bg-transparent px-8 py-4 transition-all group-hover:bg-white/10">
                            {quoteLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
                            ) : (
                                <Zap className="mr-2 h-5 w-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                            )}
                            <span className="text-lg font-bold text-white tracking-wide">
                                {quoteLoading ? "Sending Request..." : "Request Custom Quote"}
                            </span>
                        </div>
                    </button>

                    {/* 2. WhatsApp Button (Emerald Gradient with Glass Effect) */}
                    <button
                        onClick={handleGetQuoteWhatsApp}
                        className="group w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-4 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-green-500 border border-emerald-400/20"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <MessageCircle className="h-6 w-6 text-white" />
                            <div className="flex flex-col items-start text-white">
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Instant Reply</span>
                                <span className="text-base font-bold leading-none">Get Video & Price on WhatsApp</span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Shipping Info */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-gray-500 dark:text-slate-400 font-medium">
                    <div className="flex flex-col items-center gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <MapPin className="h-5 w-5 text-blue-500 mb-1" /> <span>Ships from {product.shipping.from}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <Globe className="h-5 w-5 text-purple-500 mb-1" /> <span>{product.shipping.type}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <Clock className="h-5 w-5 text-green-500 mb-1" /> <span>Arrives in {product.shipping.time}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;