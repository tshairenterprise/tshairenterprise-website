import React, { useState } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Star, User, Pencil, Trash2, MessageCircle, Heart, CheckCircle2, X, Loader2, MessageSquarePlus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { sooner } from "@/components/ui/use-sooner.jsx";
import { cn } from "@/lib/utils";

const ProductReviews = ({ product, userInfo }) => {
    const navigate = useNavigate();

    // Form States
    const [rating, setRating] = useState("5");
    const [comment, setComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);

    // Edit States
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(0);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} className={cn("h-3.5 w-3.5", i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-slate-700")} />
        ));
    };

    // --- ACTIONS ---
    const submitReview = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            sooner.error("Login Required", "Please sign in to share your experience.", 4000);
            navigate('/admin/login');
            return;
        }

        const loadingSooner = sooner.loading("Submitting", "Posting your feedback...");
        setReviewLoading(true);

        try {
            await api.post('/reviews', {
                rating: Number(rating),
                comment,
                productId: product._id
            });

            loadingSooner.update({
                title: "Posted!",
                description: "Thank you for your review.",
                variant: "success",
                duration: 2000
            });

            setTimeout(() => navigate(0), 1000);
        } catch (error) {
            loadingSooner.update({
                title: "Error",
                description: error.response?.data?.message || "Failed to post review.",
                variant: "destructive",
                duration: 4000
            });
        } finally {
            setReviewLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        const deleteLoading = sooner.loading("Deleting", "Removing your review...");
        try {
            await api.delete(`/reviews/${reviewId}`);
            deleteLoading.update({ title: "Deleted", description: "Review removed.", variant: "success", duration: 2000 });
            setTimeout(() => navigate(0), 1000);
        } catch (error) {
            deleteLoading.update({ title: "Error", description: "Could not delete.", variant: "destructive", duration: 4000 });
        }
    };

    const handleUpdateReview = async (reviewId) => {
        const updateLoading = sooner.loading("Updating", "Saving changes...");
        try {
            await api.put(`/reviews/${reviewId}`, { rating: editRating, comment: editComment });
            updateLoading.update({ title: "Updated", description: "Review updated successfully.", variant: "success", duration: 2000 });
            setEditingReviewId(null);
            setTimeout(() => navigate(0), 1000);
        } catch (err) {
            updateLoading.update({ title: "Error", description: "Update failed.", variant: "destructive", duration: 4000 });
        }
    };

    return (
        <div className="flex flex-col gap-10">

            {/* Header / Summary */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-8 border-b border-gray-100 dark:border-slate-800">
                <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        Client Feedback <span className="text-sm font-bold bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-gray-500">{product.reviews?.length || 0}</span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 max-w-lg">
                        Authentic reviews from verified buyers and partners.
                    </p>
                </div>

                {product.rating > 0 && (
                    <div className="text-right">
                        <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{product.rating}</div>
                        <div className="flex gap-1 justify-end my-1">{renderStars(product.rating)}</div>
                        <p className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wider">Average Rating</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* --- LEFT: REVIEWS LIST (Span 7) --- */}
                <div className="lg:col-span-7 space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review, idx) => {
                            const isOwner = userInfo && (userInfo._id === review.user?._id || userInfo._id === review.user);
                            return (
                                <div key={idx} className="group relative bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300">

                                    {/* Admin Heart Badge */}
                                    {review.isLoved && (
                                        <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border border-red-50 dark:border-red-900/30 text-red-500 transform rotate-12 z-10">
                                            <Heart className="h-4 w-4 fill-current" />
                                        </div>
                                    )}

                                    {/* Review Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-300 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-gray-600 dark:text-slate-300 font-bold shadow-inner">
                                                {review.user?.avatar ? (
                                                    <img src={review.user.avatar} alt="User" className="h-full w-full object-cover rounded-2xl" />
                                                ) : (
                                                    <User className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                                                    {review.user?.name || "Verified Customer"}
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                                                </h4>
                                                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                                                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Edit Mode Rating / Display Rating */}
                                        <div className="bg-gray-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-slate-800">
                                            {editingReviewId === review._id ? (
                                                <select
                                                    value={editRating}
                                                    onChange={e => setEditRating(Number(e.target.value))}
                                                    className="bg-transparent text-xs font-bold focus:outline-none dark:text-white"
                                                >
                                                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                                </select>
                                            ) : (
                                                <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Review Body */}
                                    <div className="pl-16">
                                        {editingReviewId === review._id ? (
                                            <div className="space-y-3">
                                                <Textarea
                                                    value={editComment}
                                                    onChange={e => setEditComment(e.target.value)}
                                                    className="bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl"
                                                />
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => handleUpdateReview(review._id)} className="rounded-lg h-8">Save</Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setEditingReviewId(null)} className="rounded-lg h-8">Cancel</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">"{review.comment}"</p>
                                        )}

                                        {/* Owner Actions */}
                                        {isOwner && !editingReviewId && (
                                            <div className="flex gap-4 mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditingReviewId(review._id); setEditComment(review.comment); setEditRating(review.rating); }} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                                    <Pencil className="h-3 w-3" /> Edit
                                                </button>
                                                <button onClick={() => handleDeleteReview(review._id)} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline">
                                                    <Trash2 className="h-3 w-3" /> Delete
                                                </button>
                                            </div>
                                        )}

                                        {/* Admin Reply */}
                                        {review.adminReply && (
                                            <div className="mt-6 bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/20 relative">
                                                <div className="absolute -left-1 top-6 w-1 h-8 bg-primary rounded-full"></div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-extrabold bg-primary text-white px-2 py-0.5 rounded-md uppercase tracking-wider">Admin Response</span>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-slate-300 italic leading-relaxed">
                                                    "{review.adminReply}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 bg-gray-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800">
                            <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <MessageCircle className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Reviews Yet</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Be the first to share your experience.</p>
                        </div>
                    )}
                </div>

                {/* --- RIGHT: STICKY FORM (Span 5) --- */}
                <div className="lg:col-span-5">
                    <div className="sticky top-32 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-xl shadow-gray-100 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                <MessageSquarePlus className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Write a Review</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Share your thoughts with the community.</p>
                            </div>
                        </div>

                        {userInfo ? (
                            <form className="space-y-6" onSubmit={submitReview}>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Rating</label>
                                    <Select onValueChange={setRating} defaultValue={rating}>
                                        <SelectTrigger className="w-full h-12 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl">
                                            <SelectValue placeholder="Select Rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">★★★★★ Excellent</SelectItem>
                                            <SelectItem value="4">★★★★☆ Good</SelectItem>
                                            <SelectItem value="3">★★★☆☆ Average</SelectItem>
                                            <SelectItem value="2">★★☆☆☆ Poor</SelectItem>
                                            <SelectItem value="1">★☆☆☆☆ Terrible</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Your Feedback</label>
                                    <Textarea
                                        rows={5}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full rounded-xl border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 p-4 focus:ring-primary/20 transition-all resize-none"
                                        placeholder="How was the quality? Texture? Delivery?"
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={reviewLoading} className="w-full h-12 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:shadow-lg transition-all">
                                    {reviewLoading ? <Loader2 className='animate-spin mr-2 h-5 w-5' /> : "Submit Review"}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-8 px-4 bg-gray-50 dark:bg-slate-950/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <p className="text-gray-500 dark:text-slate-400 text-sm mb-4 font-medium">Please sign in to write a review.</p>
                                <Button className="w-full rounded-xl" variant="outline" onClick={() => navigate('/admin/login')}>
                                    Sign In / Register
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductReviews;