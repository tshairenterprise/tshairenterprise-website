import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send, Loader2, ArrowLeft, MessageSquareHeart, Sparkles } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";
import SEO from '../components/SEO';

const ReviewUs = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ FIX: Lazy Initialization (State mein direct value daali)
    // Ab ye useEffect ke andar set hone ka wait nahi karega.
    const [userInfo, setUserInfo] = useState(() => {
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // ✅ FIX: UseEffect sirf Redirect ke liye use hoga (Side Effect)
    useEffect(() => {
        if (!userInfo) {
            sooner.info("Sign In Required", "Please sign in to share your feedback.", 4000);
            navigate('/admin/login');
        }
    }, [userInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            sooner.error("Missing Rating", "Please select a star rating.", 3000);
            return;
        }

        const loadingSooner = sooner.loading("Submitting", "Recording your feedback...");
        setLoading(true);

        try {
            await api.post('/reviews', { rating, comment });

            loadingSooner.update({
                title: "Received!",
                description: "Thank you for your review.",
                variant: "success",
                duration: 3000
            });

            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error submitting review.";
            loadingSooner.update({
                title: "Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });
            setLoading(false);
        }
    };

    // Agar user redirect ho raha hai toh UI render mat karo (Optional safety)
    if (!userInfo) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden flex items-center justify-center py-24 px-4 transition-colors duration-500">

            <SEO
                title="Write a Review | Customer Feedback for TS Hair Enterprise"
                description="Share your experience with TS Hair Enterprise."
                keywords="TS Hair reviews, customer feedback"
                url={window.location.href}
            />

            {/* --- AMBIENT BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-xl w-full relative z-10 animate-in fade-in zoom-in-95 duration-700">

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary mb-8 transition-all font-medium group"
                >
                    <div className="p-2 rounded-full bg-gray-50 dark:bg-slate-900 mr-3 border border-gray-200 dark:border-slate-800 group-hover:border-primary/30 transition-colors">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    Back to Home
                </button>

                {/* --- MAIN GLASS CARD --- */}
                <div className="relative group">
                    {/* Glowing Border Gradient */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-[2.5rem] opacity-30 group-hover:opacity-50 blur transition duration-500"></div>

                    <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl dark:shadow-black/50 border border-white/50 dark:border-slate-800 overflow-hidden p-8 md:p-12">

                        {/* Top Decoration */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 pointer-events-none">
                            <Sparkles className="h-24 w-24 text-primary rotate-12" />
                        </div>

                        {/* Header */}
                        <div className="text-center mb-10 relative z-10">
                            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-5 shadow-inner border border-primary/10">
                                <MessageSquareHeart className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
                                Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Experience</span>
                            </h1>
                            <p className="text-gray-500 dark:text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
                                We'd love to hear your thoughts! Your feedback helps us improve.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                            {/* --- STAR RATING --- */}
                            <div className="flex flex-col items-center gap-4 bg-gray-50/50 dark:bg-slate-950/50 p-6 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                                <div className="flex gap-2 sm:gap-4">
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <button
                                                type="button"
                                                key={index}
                                                className="group/star focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95"
                                                onClick={() => setRating(ratingValue)}
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(rating)}
                                            >
                                                <Star
                                                    className={`h-10 w-10 sm:h-12 sm:w-12 transition-all duration-300 ${ratingValue <= (hover || rating)
                                                            ? "fill-amber-400 text-amber-400 drop-shadow-md"
                                                            : "text-gray-200 dark:text-slate-700"
                                                        }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Dynamic Emoji Feedback */}
                                <div className="h-6">
                                    <span className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 ${hover || rating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${(hover || rating) >= 4 ? 'text-green-600 dark:text-green-400' : (hover || rating) === 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}`}>
                                        {(hover || rating) === 5 && "Absolutely Amazing! 🎉"}
                                        {(hover || rating) === 4 && "Great Experience! 😃"}
                                        {(hover || rating) === 3 && "It was Okay 😐"}
                                        {(hover || rating) === 2 && "Needs Improvement 😕"}
                                        {(hover || rating) === 1 && "Very Disappointed 😞"}
                                    </span>
                                </div>
                            </div>

                            {/* --- COMMENT BOX --- */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    Tell us more
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-2xl blur opacity-0 group-focus-within/input:opacity-50 transition duration-500"></div>
                                    <Textarea
                                        rows={5}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="What did you like? Is there anything we can do better?"
                                        className="relative resize-none bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 focus:border-transparent rounded-2xl p-5 text-base shadow-sm dark:text-white dark:placeholder:text-slate-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* --- SUBMIT BUTTON --- */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 dark:shadow-none bg-gray-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin mr-2" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Send Feedback <Send className="h-5 w-5" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReviewUs;