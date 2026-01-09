import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck, MessageSquarePlus, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const ClientReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await api.get('/reviews/website-featured');
                setReviews(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching reviews");
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    // Auto Slide Logic
    useEffect(() => {
        if (reviews.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 6000); // 6 Seconds per slide
        return () => clearInterval(interval);
    }, [reviews.length]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

    if (loading || reviews.length === 0) return null;

    const currentReview = reviews[currentIndex];

    return (
        <section className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">

            {/* --- BACKGROUND BLOBS (Hero Sync) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Purple Blob (Top Left) */}
                <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                {/* Blue Blob (Bottom Right) */}
                <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="text-center mb-16 animate-in slide-in-from-bottom-10 duration-700 fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
                        <BadgeCheck className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" />
                        <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Client Love</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6">
                        Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">Satisfaction</span>
                    </h2>
                </div>

                {/* --- MAIN CAROUSEL CARD --- */}
                <div className="relative max-w-4xl mx-auto">

                    {/* Decorative Quote Icon (Background) */}
                    <div className="absolute -top-12 -left-4 md:-left-12 text-primary/10 dark:text-primary/20 pointer-events-none">
                        <Quote className="h-32 w-32 md:h-48 md:w-48 fill-current transform -scale-x-100" />
                    </div>

                    <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-purple-500/5 transition-all duration-500">

                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">

                            {/* User Avatar & Info */}
                            <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur opacity-50"></div>
                                    <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-xl">
                                        <AvatarImage src={currentReview.user?.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                            {currentReview.user?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white dark:border-slate-800">
                                        <BadgeCheck className="h-4 w-4" />
                                    </div>
                                </div>

                                <div className="text-center md:text-left">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{currentReview.user?.name}</h3>
                                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Verified Buyer</p>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="flex-1 text-center md:text-left space-y-6">
                                {/* Stars */}
                                <div className="flex items-center justify-center md:justify-start gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "h-5 w-5",
                                                i < currentReview.rating
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-gray-200 dark:text-slate-700"
                                            )}
                                        />
                                    ))}
                                </div>

                                <blockquote className="text-xl md:text-2xl font-medium text-gray-800 dark:text-slate-200 leading-relaxed italic">
                                    "{currentReview.comment}"
                                </blockquote>

                                {/* Product Tag if available */}
                                {currentReview.product && (
                                    <Link to={`/product/${currentReview.product._id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-colors text-sm font-semibold text-gray-600 dark:text-slate-400">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Review for: {currentReview.product.name}
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons (Absolute) */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 h-12 w-12 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:scale-110 transition-all z-20"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 h-12 w-12 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:scale-110 transition-all z-20"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-3 mt-10">
                        {reviews.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-500",
                                    i === currentIndex
                                        ? "w-8 bg-primary shadow-lg shadow-primary/30"
                                        : "w-2 bg-gray-300 dark:bg-slate-700 hover:bg-primary/50"
                                )}
                            />
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-500 dark:text-slate-400 mb-6 font-medium">Have you purchased from us?</p>
                        <Link to="/review-us">
                            <Button className="h-14 px-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl hover:scale-105 transition-all">
                                Share Your Experience <MessageSquarePlus className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ClientReviews;