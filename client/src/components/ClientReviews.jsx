import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck, MessageSquarePlus } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // ✅ Imported Avatar

const ClientReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await api.get('/reviews/website-featured');
                setReviews(data);
            } catch (error) { console.error("Error fetching reviews"); }
        };
        fetchFeatured();
    }, []);

    // Auto Slide
    useEffect(() => {
        if (reviews.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [reviews.length]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

    if (reviews.length === 0) {
        return (
            <section className="py-24 bg-white dark:bg-slate-950 text-center relative overflow-hidden transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-900 rounded-full mb-6 shadow-sm border border-gray-100 dark:border-slate-800">
                        <MessageSquarePlus className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Partners Say</h2>
                    <p className="text-lg text-gray-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
                        Be the first to share your experience with TS Hair Enterprise.
                    </p>
                    <Link to="/review-us">
                        <Button className="bg-primary text-white hover:bg-purple-700 px-8 h-12 rounded-full font-bold shadow-lg">
                            Write a Review
                        </Button>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">

            {/* Subtle Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-10 left-10 w-40 h-40 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

                {/* Header */}
                <div className="mb-14">
                    <span className="text-primary font-bold tracking-wider uppercase text-xs bg-primary/5 dark:bg-primary/10 px-4 py-1.5 rounded-full border border-primary/10 dark:border-primary/20">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-4 mb-4 tracking-tight">
                        Loved by Businesses
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">

                    {/* SLIDER CONTAINER */}
                    <div className="relative min-h-[350px] flex items-center justify-center">
                        {reviews.map((review, index) => {
                            let position = 'opacity-0 scale-95 translate-x-8 pointer-events-none absolute';

                            if (index === currentIndex) {
                                position = 'opacity-100 scale-100 translate-x-0 z-20 relative';
                            } else if (index === (currentIndex - 1 + reviews.length) % reviews.length) {
                                position = 'opacity-0 -translate-x-8 scale-95 absolute pointer-events-none';
                            }

                            return (
                                <div key={review._id} className={`transition-all duration-700 ease-out w-full max-w-3xl ${position}`}>

                                    {/* Card */}
                                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-purple-500/5 dark:shadow-none border border-white dark:border-slate-800 relative mx-4 overflow-hidden group">

                                        {/* Subtle Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-purple-50/30 dark:from-slate-900 dark:via-transparent dark:to-purple-900/10 opacity-100"></div>

                                        <Quote className="h-16 w-16 text-purple-200/50 dark:text-purple-900/30 absolute top-8 left-8 rotate-180" />

                                        <div className="relative z-10">
                                            {/* Stars */}
                                            <div className="flex justify-center mb-6 space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-slate-700"}`} />
                                                ))}
                                            </div>

                                            {/* Review Text */}
                                            <blockquote className="text-xl md:text-3xl text-gray-800 dark:text-slate-200 font-medium italic mb-8 leading-relaxed">
                                                "{review.comment}"
                                            </blockquote>

                                            {/* User Info with Avatar */}
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-4">
                                                    {/* USER AVATAR IMPLEMENTATION */}
                                                    <Avatar className="h-14 w-14 border-4 border-white dark:border-slate-800 shadow-lg">
                                                        <AvatarImage src={review.user?.avatar} className="object-cover" />
                                                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-lg">
                                                            {review.user?.name?.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="text-left">
                                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-1.5">
                                                            {review.user?.name}
                                                            <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-500/10" />
                                                        </h4>
                                                        <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">Verified Partner</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Admin Reply */}
                                            {review.adminReply && (
                                                <div className="mt-8 mx-auto max-w-lg bg-gray-50 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 px-6 py-4 rounded-2xl relative">
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-gray-50 dark:border-b-slate-900"></div>
                                                    <p className="text-sm text-gray-600 dark:text-slate-400 italic">
                                                        <span className="font-bold text-primary not-italic mr-2">TS Hair:</span>
                                                        "{review.adminReply}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Buttons */}
                    {reviews.length > 1 && (
                        <>
                            <button onClick={prevSlide} className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:scale-110 transition-all z-30">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button onClick={nextSlide} className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:scale-110 transition-all z-30">
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {reviews.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-primary shadow-lg shadow-primary/30' : 'w-2 bg-gray-300 dark:bg-slate-700 hover:bg-primary/50'}`}
                        />
                    ))}
                </div>

                <div className="mt-12">
                    <Link to="/review-us">
                        <Button variant="outline" className="text-primary dark:text-white border-primary/20 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-full px-8 h-12 text-base font-semibold bg-transparent">
                            Share Your Experience
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default ClientReviews;