import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageCircle, Heart, User, ShoppingBag, Globe, Filter, Eye, Quote, CheckCircle2 } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('all');
    const [replyText, setReplyText] = useState({});

    const fetchReviews = async () => {
        try {
            const { data } = await api.get('/reviews/admin');
            setReviews(data);
        } catch (error) {
            sooner.error("Fetch Error", "Failed to load reviews list. Check admin authentication.");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleAction = async (id, field, value, reviewName) => {

        const loadingSooner = sooner.loading(
            "Updating Review",
            `Setting ${field} for review by ${reviewName}...`
        );

        try {
            const payload = { [field]: value };

            await api.put(`/reviews/${id}`, payload);

            // Success update
            loadingSooner.update({
                title: "Updated!",
                description: `${field} status changed successfully.`,
                variant: "success",
                duration: 3000
            });

            // Update local state directly for fast UI feedback
            setReviews(prev => prev.map(r => r._id === id ? { ...r, ...payload } : r));

        } catch (error) {
            // Error update
            loadingSooner.update({
                title: "Action Failed",
                description: error.response?.data?.message || `Could not update ${field}.`,
                variant: "destructive",
                duration: 5000
            });
        }
    };

    // Custom handler for submitting the admin reply from the textarea
    const handleReplySubmit = async (reviewId, reply, reviewName) => {
        if (!reply || reply.trim() === "") return;

        const loadingSooner = sooner.loading(
            "Sending Reply",
            `Replying to ${reviewName} now...`
        );

        try {
            const payload = { adminReply: reply };

            await api.put(`/reviews/${reviewId}`, payload);

            // Success update
            loadingSooner.update({
                title: "Reply Posted!",
                description: `Your response was posted publicly on the review.`,
                variant: "success",
                duration: 3000
            });

            // Update local state and clear temporary reply text
            setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, ...payload } : r));
            setReplyText(prev => ({ ...prev, [reviewId]: "" }));

        } catch (error) {
            // Error update
            loadingSooner.update({
                title: "Reply Failed",
                description: error.response?.data?.message || `Could not post reply.`,
                variant: "destructive",
                duration: 5000
            });
        }
    };


    const filteredReviews = reviews.filter(review => {
        if (filter === 'all') return true;
        const isWebsite = !review.product;
        return filter === 'website' ? isWebsite : !isWebsite;
    });

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-slate-700"}`} />
        ));
    };

    return (
        <div className="space-y-8 relative">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Feedback</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Monitor and respond to customer reviews.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    {['all', 'product', 'website'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${filter === f
                                ? 'bg-gray-900 dark:bg-primary text-white shadow-md'
                                : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- REVIEWS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReviews.map((review) => {
                    const isWebsiteReview = !review.product;
                    const reviewName = review.user?.name || "Guest";

                    return (
                        <div
                            key={review._id}
                            className={`group relative p-6 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full
                            ${isWebsiteReview
                                    ? 'bg-gradient-to-b from-purple-50/50 to-white border-purple-100 dark:from-purple-900/10 dark:to-slate-900 dark:border-purple-900/30'
                                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800'
                                }`}
                        >
                            <Quote className={`absolute top-6 right-6 h-10 w-10 opacity-10 rotate-180 ${isWebsiteReview ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-slate-600'}`} />

                            {/* Header: User & Rating */}
                            <div className="flex items-start gap-4 mb-5 relative z-10">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm border border-white dark:border-slate-700 ${isWebsiteReview ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
                                    <span className="text-lg font-bold">{reviewName.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{reviewName}</h4>
                                    <div className="flex items-center gap-1 mt-1">{renderStars(review.rating)}</div>
                                </div>
                            </div>

                            {/* Product Context Badge */}
                            {!isWebsiteReview && review.product && (
                                <div className="mb-4 flex items-center gap-3 bg-gray-50 dark:bg-slate-800 p-2 rounded-xl border border-gray-100 dark:border-slate-700 w-fit pr-4">
                                    {review.product.image && (
                                        <img src={review.product.image} alt="prod" className="h-8 w-8 rounded-lg object-cover" />
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Product</span>
                                        <span className="text-xs font-bold text-gray-700 dark:text-slate-300 line-clamp-1 max-w-[150px]">
                                            {review.product.name}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Review Content */}
                            <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed italic mb-6 flex-grow">
                                "{review.comment}"
                            </p>

                            {/* --- ADMIN CONTROLS --- */}
                            <div className="pt-5 border-t border-gray-100/80 dark:border-slate-800 space-y-4 mt-auto">

                                <div className="flex items-center justify-between">
                                    {isWebsiteReview ? (
                                        <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-full border border-gray-100 dark:border-slate-800 shadow-sm">
                                            <Switch
                                                checked={review.isFeatured}
                                                onCheckedChange={(val) => handleAction(review._id, 'isFeatured', val, reviewName)} // ✅ Sooner Toggle Action
                                                className="data-[state=checked]:bg-green-500 scale-75"
                                            />
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${review.isFeatured ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-slate-500'}`}>
                                                {review.isFeatured ? "Featured" : "Hidden"}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-slate-700">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Public</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleAction(review._id, 'isLoved', !review.isLoved, reviewName)} // ✅ Sooner Toggle Action
                                        className={`p-2 rounded-full transition-all ${review.isLoved ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-gray-50 dark:bg-slate-800 text-gray-300 dark:text-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-red-400'}`}
                                    >
                                        <Heart className={`h-4 w-4 ${review.isLoved ? 'fill-red-500' : ''}`} />
                                    </button>
                                </div>

                                {/* Reply Area */}
                                <div className={`rounded-2xl p-1 transition-all ${review.adminReply ? 'bg-primary/5 border border-primary/10 dark:bg-primary/10 dark:border-primary/20' : 'bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700'}`}>
                                    {review.adminReply ? (
                                        <div className="p-3 relative">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">J</div>
                                                <span className="text-xs font-bold text-primary">You Replied:</span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-slate-300 pl-7">{review.adminReply}</p>
                                            <button
                                                onClick={() => handleAction(review._id, 'adminReply', "", reviewName)} // Sooner Action (Delete Reply)
                                                className="absolute top-3 right-3 text-[10px] font-bold text-red-400 hover:text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 p-1">
                                            <Textarea
                                                placeholder="Write a public reply..."
                                                className="min-h-[38px] h-[38px] text-xs bg-white dark:bg-slate-900 border-0 shadow-none resize-none focus-visible:ring-0 dark:text-white"
                                                value={replyText[review._id] || ""}
                                                onChange={(e) => setReplyText({ ...replyText, [review._id]: e.target.value })}
                                            />
                                            <Button
                                                size="icon"
                                                className="h-8 w-8 shrink-0 bg-gray-900 dark:bg-primary hover:bg-primary rounded-lg shadow-sm"
                                                onClick={() => handleReplySubmit(review._id, replyText[review._id], reviewName)} // Sooner Reply Submit
                                                disabled={!replyText[review._id]}
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {filteredReviews.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800">
                        <div className="bg-gray-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Reviews Found</h3>
                        <p className="text-gray-500 dark:text-slate-400 mt-2">Try changing the filter tab.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;