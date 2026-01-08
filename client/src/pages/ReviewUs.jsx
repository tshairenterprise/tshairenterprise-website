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
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (!user) {
            // Sooner notification for login requirement
            sooner.info("Sign In Required", "Please sign in to share your feedback. Redirecting to login page.", 4000);
            navigate('/admin/login');
        } else {
            setUserInfo(user);
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            sooner.error("Missing Rating", "Please select a star rating before submitting."); // Sooner for missing rating
            return;
        }

        // 1. Loading Sooner Start
        const loadingSooner = sooner.loading(
            "Submitting Feedback",
            "Your experience is being recorded. Please wait..."
        );

        setLoading(true);
        try {

            await api.post('/reviews', {
                rating,
                comment
            });

            // 2. Success Sooner Update
            loadingSooner.update({
                title: "Feedback Received!",
                description: "Thank you for your valuable review! Redirecting to home.",
                variant: "success",
                duration: 3000
            });

            navigate('/');
        } catch (error) {

            const errorMessage = error.response?.data?.message || "Error submitting review. Check network.";

            // 3. Error Sooner Update
            loadingSooner.update({
                title: "Submission Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });

            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center py-12 px-4 transition-colors duration-500">

            {/* Inject Review Page SEO */}
            <SEO
                title="Write a Review | Customer Feedback for TS Hair Enterprise"
                description="Share your experience with TS Hair Enterprise. Read authentic reviews from international salon owners and distributors about our Raw Indian Hair quality."
                keywords="TS Hair Enterprise reviews, TS Hair feedback, is TS Hair legit, hair factory testimonials Beldanga, customer reviews India"
                url={window.location.href}
            />

            {/* --- ANIMATED BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-300/30 dark:bg-purple-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/40 dark:bg-blue-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow delay-1000"></div>
                <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-pink-200/30 dark:bg-pink-900/10 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow delay-2000"></div>
            </div>

            <div className="max-w-xl w-full relative z-10">

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary mb-8 transition-all font-medium group"
                >
                    <div className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 mr-3 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    Back to Home
                </button>

                {/* --- MAIN GLASS CARD --- */}
                <div className="relative group">

                    {/* Glowing Border Gradient */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-[2.5rem] opacity-30 group-hover:opacity-50 blur transition duration-500"></div>

                    <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl dark:shadow-black/50 border border-white/50 dark:border-slate-800 overflow-hidden p-8 md:p-12">

                        {/* Top Decoration */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 pointer-events-none">
                            <Sparkles className="h-24 w-24 text-primary rotate-12" />
                        </div>

                        {/* Header */}
                        <div className="text-center mb-10 relative z-10">
                            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 rounded-2xl mb-5 shadow-inner border border-primary/10">
                                <MessageSquareHeart className="h-8 w-8 text-primary drop-shadow-sm" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
                                Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Experience</span>
                            </h1>
                            <p className="text-gray-500 dark:text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
                                We'd love to hear your thoughts! Your feedback helps us improve and serve you better.
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
                                                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                                                            : "text-gray-200 dark:text-slate-700 group-hover/star:text-gray-300 dark:group-hover/star:text-slate-600"
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
                                className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 dark:shadow-none bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-transparent dark:border-white/50"
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