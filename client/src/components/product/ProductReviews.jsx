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
import { Star, User, Pencil, Trash2, MessageCircle, Heart, CheckCircle2, X, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { sooner } from "@/components/ui/use-sooner.jsx";

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
            <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-slate-600"}`} />
        ));
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            sooner.error("Login Required", "You must be logged in to submit a review.", 4000);
            navigate('/admin/login');
            return;
        }

        // 1. Loading Sooner Start
        const loadingSooner = sooner.loading(
            "Submitting Review",
            "Recording your feedback and recalculating product rating..."
        );

        setReviewLoading(true);
        try {

            await api.post('/reviews', {
                rating: Number(rating),
                comment,
                productId: product._id
            });

            // 2. Success Sooner Update
            loadingSooner.update({
                title: "Review Submitted!",
                description: "Thank you! Your review is now live.",
                variant: "success",
                duration: 3000
            });

            // Reload to show the new review and updated average rating
            setTimeout(() => {
                navigate(0); // This reloads the current route safely
            }, 1000);

        } catch (error) {

            const errorMessage = error.response?.data?.message || "Error submitting review.";

            // 3. Error Sooner Update
            loadingSooner.update({
                title: "Submission Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });

        } finally {
            setReviewLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {

        // 1. Interactive Confirmation Sooner
        const confirmationSooner = sooner.error(
            "Confirm Deletion",
            "Are you sure you want to delete this review? This will affect the product's rating.",
            Infinity // Persistent
        );

        confirmationSooner.update({
            action: (
                // Added flex-col on mobile, flex-row on small screens and gap-4
                <div className='flex flex-col sm:flex-row gap-4 p-2'>
                    <Button
                        size="sm"
                        variant="destructive"
                        // Added w-full for better stacking on mobile
                        className='w-full sm:w-auto'
                        onClick={async () => {
                            confirmationSooner.dismiss();
                            const deleteLoading = sooner.loading("Deleting Review", "Removing review and recalculating rating...");

                            try {
                                await api.delete(`/reviews/${reviewId}`);

                                deleteLoading.update({
                                    title: "Deleted!",
                                    description: `Review successfully removed. Page will refresh.`,
                                    variant: "success",
                                    duration: 3000
                                });

                                setTimeout(() => window.location.reload(), 1000);
                            } catch (error) {
                                deleteLoading.update({
                                    title: "Deletion Failed",
                                    description: error.response?.data?.message || "Error deleting review.",
                                    variant: "destructive",
                                    duration: 5000
                                });
                            }
                        }}
                    >
                        Yes, Delete
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className='w-full sm:w-auto text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/10'
                        onClick={() => confirmationSooner.dismiss()}
                    >
                        <X className='h-4 w-4 mr-1' /> Cancel
                    </Button>
                </div>
            ),
            variant: "interactive",
            duration: Infinity
        });
    };

    const handleUpdateReview = async (reviewId) => {

        // 1. Loading Sooner Start
        const loadingSooner = sooner.loading(
            "Updating Review",
            "Saving review changes and updating product rating..."
        );

        try {
            await api.put(`/reviews/${reviewId}`, {
                rating: editRating,
                comment: editComment
            });

            // 2. Success Sooner Update
            loadingSooner.update({
                title: "Review Updated!",
                description: "Changes saved. Page will refresh.",
                variant: "success",
                duration: 3000
            });

            setEditingReviewId(null);
            setTimeout(() => window.location.reload(), 1000);

        } catch (err) {

            // 3. Error Sooner Update
            loadingSooner.update({
                title: "Update Failed",
                description: err.response?.data?.message || "Error updating review.",
                variant: "destructive",
                duration: 5000
            });
        }
    };

    return (
        <div className="mt-24 border-t border-gray-200 dark:border-slate-800 pt-16">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-2">See what our partners are saying about this texture.</p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{product.rating || 0}</div>
                    <div className="flex text-yellow-400">{renderStars(product.rating || 0)}</div>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Based on {product.reviewCount} reviews</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* REVIEWS LIST */}
                <div className="lg:col-span-2 space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review, idx) => {
                            const isOwner = userInfo && (userInfo._id === review.user?._id || userInfo._id === review.user);

                            return (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group relative">

                                    {/* ADMIN HEART REACT BADGE */}
                                    {review.isLoved && (
                                        <div className="absolute -top-3 -right-3 z-20 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border border-red-100 dark:border-red-900/30 transform rotate-12" title="Loved by TS Hair Enterprise">
                                            <Heart className="h-5 w-5 text-red-500 fill-red-500 drop-shadow-sm" />
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                                                    {review.user?.name || "Verified Customer"}
                                                    {/* Verified Badge */}
                                                    <CheckCircle2 className="h-3 w-3 text-blue-500" />
                                                </h4>
                                                <p className="text-xs text-gray-400 dark:text-slate-500">{new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {editingReviewId === review._id ? (
                                            <select
                                                value={editRating}
                                                onChange={e => setEditRating(Number(e.target.value))}
                                                className="border rounded p-1 text-sm bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                                            >
                                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                            </select>
                                        ) : (
                                            <div className="flex">{renderStars(review.rating)}</div>
                                        )}
                                    </div>

                                    {editingReviewId === review._id ? (
                                        <div className="mt-2 space-y-3">
                                            <Textarea
                                                value={editComment}
                                                onChange={e => setEditComment(e.target.value)}
                                                className="bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                                            />
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleUpdateReview(review._id)}>Save</Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingReviewId(null)}>Cancel</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 dark:text-slate-300 italic text-base leading-relaxed">"{review.comment}"</p>
                                    )}

                                    {/* Action Buttons (Edit/Delete) - Position adjusted to not overlap heart */}
                                    {isOwner && !editingReviewId && (
                                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => {
                                                setEditingReviewId(review._id);
                                                setEditComment(review.comment);
                                                setEditRating(review.rating);
                                            }} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"><Pencil className="h-3 w-3" /> Edit</button>

                                            <button onClick={() => handleDeleteReview(review._id)} className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>
                                        </div>
                                    )}

                                    {/* Admin Reply Box */}
                                    {review.adminReply && (
                                        <div className="mt-4 pl-4 border-l-4 border-purple-100 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-r-xl">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Admin</span>
                                                <span className="text-xs font-bold text-gray-900 dark:text-white">TS Hair Enterprise</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">"{review.adminReply}"</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                            <div className="bg-gray-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Reviews Yet</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm">Be the first to share your experience with this product.</p>
                        </div>
                    )}
                </div>

                {/* WRITE REVIEW FORM */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-lg shadow-gray-100 dark:shadow-none sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Write a Review</h3>

                        {userInfo ? (
                            <form className="space-y-5" onSubmit={submitReview}>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Rating</label>
                                    <Select onValueChange={setRating} defaultValue={rating}>
                                        <SelectTrigger className="w-full h-12 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 dark:text-white">
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
                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Your Feedback</label>
                                    <Textarea
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full rounded-xl border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 p-4 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white dark:placeholder:text-slate-500"
                                        placeholder="How is the texture? Quality?"
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={reviewLoading} className="w-full h-12 rounded-xl bg-gray-900 dark:bg-primary text-white hover:bg-primary font-bold shadow-lg transition-all">
                                    {reviewLoading ? <Loader2 className='animate-spin mr-2 h-5 w-5' /> : "Submit Review"}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-slate-400 mb-6">Please sign in to share your feedback.</p>
                                <Button className="w-full rounded-full dark:bg-slate-800 dark:text-white dark:border-slate-700" variant="outline" onClick={() => navigate('/admin/login')}>
                                    Sign In to Review
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