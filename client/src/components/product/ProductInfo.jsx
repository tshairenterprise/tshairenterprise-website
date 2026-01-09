import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from "@/lib/axios";
import { Star, MapPin, Globe, Clock, MessageCircle, AlertCircle, CheckCircle2, Loader2, Zap } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";
import { cn } from "@/lib/utils";

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
            sooner.error("Login Required", "Please sign in to request a custom quote.", 4000);
            navigate("/admin/login", { state: { from: location } });
            return;
        }

        if (!selectedLength || !selectedColor || !currentPrice) {
            sooner.error("Missing Selection", "Please select Length & Shade first.", 5000);
            return;
        }

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

            loadingSooner.update({
                title: "Quote Sent!",
                description: "Admin will reach out to you shortly.",
                variant: "success",
                duration: 5000
            });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send request.";
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
            sooner.error("Configuration Error", "WhatsApp number not configured.", 5000);
            return;
        }

        const baseMessage = siteSettings?.productWhatsapp?.message || "Hi, I saw this hair product on your website.";
        const text =
            `${baseMessage}\n\n` +
            `🧾 *Product Inquiry*\n` +
            `- Name: ${product.name}\n` +
            `- Category: ${product.category}\n` +
            `- Length: ${selectedLength || "N/A"}\n` +
            `- Shade: ${selectedColor || "N/A"}\n` +
            `- Est. Price: ${currentPrice ? `$${currentPrice}` : "Contact for price"}\n\n` +
            `Please share more details. ✨`;

        const url = `https://api.whatsapp.com/send?phone=${String(number).replace(/[^\d]/g, "")}&text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
        sooner.info("Opening WhatsApp", "Redirecting to chat...", 3000);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={cn("h-3.5 w-3.5", i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-slate-700")}
            />
        ));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* --- LEFT: CINEMATIC GALLERY --- */}
            <div className="flex flex-col gap-6 sticky top-24">
                <div className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-slate-900 shadow-2xl shadow-gray-200/50 dark:shadow-none border-4 border-white dark:border-slate-800">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                    />

                    {product.isBestSeller && (
                        <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-gray-900 dark:text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 uppercase tracking-widest">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> Best Seller
                        </div>
                    )}
                </div>

                {/* Thumbnail Strip */}
                {allImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {allImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(img)}
                                className={cn(
                                    "relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                                    mainImage === img
                                        ? "border-primary ring-2 ring-primary/20 scale-95 opacity-100"
                                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                                )}
                            >
                                <img src={img} alt={`thumb-${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- RIGHT: PRODUCT DETAILS & ACTIONS --- */}
            <div className="flex flex-col pt-2 animate-in slide-in-from-right-8 duration-700">

                {/* Header */}
                <div className="mb-8 border-b border-gray-100 dark:border-slate-800 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                            {product.category}
                        </span>
                        {product.stock < 10 && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-md animate-pulse">
                                Low Stock: {product.stock} Left
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-4">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-900/20">
                            {renderStars(product.rating || 0)}
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-500 ml-1">{product.rating || 4.8}</span>
                        </div>
                        <span className="text-sm text-gray-400 dark:text-slate-500 font-medium">
                            Based on {product.reviewCount || 120} reviews
                        </span>
                    </div>
                </div>

                {/* Price Box */}
                <div className="bg-gray-50/50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 mb-10">
                    <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Wholesale Price</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {typeof currentPrice === 'number' ? `$${currentPrice}` : currentPrice}
                        </p>
                        {typeof currentPrice === 'number' && <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">/ per bundle</span>}
                    </div>

                    <div className="mt-4 flex items-start gap-2 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="leading-snug">Final price may vary based on selected customization options.</span>
                    </div>
                </div>

                {/* Variants Selection */}
                <div className="space-y-8 mb-10">

                    {/* Shades */}
                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div> Select Shade
                            </h3>
                            <div className="flex flex-wrap gap-2.5">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={cn(
                                            "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border-2",
                                            selectedColor === color
                                                ? "bg-gray-900 dark:bg-white text-white dark:text-slate-900 border-gray-900 dark:border-white shadow-lg scale-105"
                                                : "bg-white dark:bg-slate-950 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
                                        )}
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
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div> Select Length (Inches)
                            </h3>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant._id || variant.length}
                                        onClick={() => handleLengthSelect(variant)}
                                        className={cn(
                                            "py-2.5 text-sm font-bold rounded-xl border-2 transition-all duration-200",
                                            selectedLength === variant.length
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                                : "bg-white dark:bg-slate-950 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-800 hover:border-primary/30 hover:text-primary"
                                        )}
                                    >
                                        {variant.length}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Highlights (HTML Content) */}
                {product.highlights && (
                    <div className="mb-10 p-6 bg-gray-50/50 dark:bg-slate-900/30 rounded-[1.5rem] border border-gray-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" /> Key Features
                        </h3>
                        <div className="rich-text-content text-sm text-gray-600 dark:text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.highlights }} />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 mt-auto">

                    {/* Primary Action */}
                    <button
                        onClick={handleRequestQuote}
                        disabled={quoteLoading}
                        className="group relative w-full overflow-hidden rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-slate-900 p-[1px] shadow-xl shadow-gray-200 dark:shadow-none transition-all hover:scale-[1.01]"
                    >
                        <div className="relative flex h-14 w-full items-center justify-center rounded-2xl bg-gray-900 dark:bg-white px-8 py-4 transition-all">
                            {quoteLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Zap className="mr-2 h-5 w-5 text-yellow-400 fill-yellow-400 group-hover:animate-pulse" />
                            )}
                            <span className="text-lg font-bold tracking-wide">
                                {quoteLoading ? "Processing..." : "Request Custom Quote"}
                            </span>
                        </div>
                    </button>

                    {/* Secondary Action */}
                    <button
                        onClick={handleGetQuoteWhatsApp}
                        className="group w-full h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-white font-bold text-lg shadow-sm hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 dark:hover:border-green-500 transition-all flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
                    </button>
                </div>

                {/* Shipping Footer */}
                <div className="mt-8 grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                    <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                        <MapPin className="h-4 w-4 text-primary" /> Ships from India
                    </div>
                    <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                        <Globe className="h-4 w-4 text-blue-500" /> {product.shipping.type}
                    </div>
                    <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                        <Clock className="h-4 w-4 text-green-500" /> {product.shipping.time}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductInfo;