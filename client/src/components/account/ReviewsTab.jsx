import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Trash2, Pencil, Star, X, Check, Globe, ShoppingBag, Heart } from "lucide-react";
import { sooner, useSooner } from "@/components/ui/use-sooner.jsx";

const ReviewsTab = ({ user }) => {
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editRating, setEditRating] = useState("0");
    const [editComment, setEditComment] = useState("");

    useEffect(() => {
        if (user?.token) fetchMyReviews();
    }, [user]);

    const fetchMyReviews = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/reviews/myreviews');
            setMyReviews(data);
        } catch (error) {
            sooner.error("Fetch Error", "Failed to load your past reviews.");
        }
        finally { setLoading(false); }
    };

    const handleDeleteReview = async (id) => {

        const confirmationSooner = sooner.info(
            "Confirm Deletion",
            "Are you sure you want to permanently delete this review? This action cannot be undone.",
            Infinity
        );

        const reviewToDelete = myReviews.find(r => r._id === id);

        confirmationSooner.update({
            action: (
                <>
                    <Button
                        size="sm"
                        variant="destructive"
                        className='w-full sm:w-auto'
                        onClick={async () => {
                            confirmationSooner.dismiss();

                            const deleteLoading = sooner.loading("Deleting Review", `Removing review for ${reviewToDelete?.product?.name || 'Website'}...`);

                            try {
                                await api.delete(`/reviews/${id}`);
                                setMyReviews(prev => prev.filter(r => r._id !== id));

                                deleteLoading.update({
                                    title: "Deleted!",
                                    description: "Your review was successfully removed.",
                                    variant: "success",
                                    duration: 3000
                                });

                            } catch (error) {
                                deleteLoading.update({
                                    title: "Deletion Failed",
                                    description: "Could not remove the review. Please try again.",
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
                        Cancel
                    </Button>
                </>
            ),
            variant: "interactive",
            duration: Infinity
        });
    };

    const startEditing = (review) => {
        setEditingId(review._id);
        setEditRating(String(review.rating));
        setEditComment(review.comment);
    };

    const saveEdit = async () => {

        const updateLoading = sooner.loading("Updating Review", "Saving changes to your feedback...");

        try {
            await api.put(`/reviews/${editingId}`, {
                rating: editRating,
                comment: editComment
            });

            setMyReviews(prev => prev.map(r => r._id === editingId ? { ...r, rating: Number(editRating), comment: editComment } : r));
            setEditingId(null);

            updateLoading.update({
                title: "Updated!",
                description: "Your review changes have been saved successfully.",
                variant: "success",
                duration: 3000
            });

        } catch (error) {
            updateLoading.update({
                title: "Update Failed",
                description: error.response?.data?.message || "Could not save your changes. Try again.",
                variant: "destructive",
                duration: 5000
            });
        }
    };

    const renderStars = (rating) => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-slate-600"}`} />
            ))}
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Your Reviews</h3>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    {myReviews.length}
                </span>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-400 dark:text-slate-500 animate-pulse">Loading...</div>
            ) : (
                <div className="space-y-4 pb-10">
                    {myReviews.length === 0 && (
                        <div className="text-center py-16 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                            <FileText className="h-8 w-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-slate-400 font-medium text-sm">No reviews yet.</p>
                        </div>
                    )}

                    {myReviews.map((review) => (
                        <div key={review._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm relative group">

                            {/* ADMIN LOVE REACT BADGE */}
                            {review.isLoved && (
                                <div className="absolute -top-2 -right-2 z-20 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-md border border-red-100 dark:border-red-900/30 transform rotate-12" title="Loved by Admin">
                                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                                </div>
                            )}

                            {/* Edit Buttons (Position adjusted to not overlap heart) */}
                            <div className="absolute top-4 right-8 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                {editingId === review._id ? (
                                    <>
                                        <Button size="icon" className="h-8 w-8 bg-green-500 hover:bg-green-600 rounded-lg" onClick={saveEdit}><Check className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg" onClick={() => startEditing(review)}><Pencil className="h-3.5 w-3.5" /></Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg" onClick={() => handleDeleteReview(review._id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-3 mb-3 pr-16">
                                <div className={`p-2.5 rounded-xl shrink-0 ${review.reviewType === 'website' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                                    {review.reviewType === 'website' ? <Globe className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                        {review.reviewType === 'website' ? 'TS Hair Enterprise' : review.product?.name || "Product Removed"}
                                    </h4>
                                    <div className="flex gap-2 items-center mt-1">
                                        {editingId === review._id ? (
                                            <Select value={editRating} onValueChange={setEditRating}>
                                                <SelectTrigger className="w-[90px] h-7 text-xs border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-lg dark:text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[5, 4, 3, 2, 1].map(r => <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        ) : renderStars(review.rating)}
                                    </div>
                                </div>
                            </div>

                            {editingId === review._id ? (
                                <Textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} className="min-h-[80px] text-sm bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 dark:text-white" />
                            ) : (
                                <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed bg-gray-50/50 dark:bg-slate-800/50 p-3 rounded-xl">"{review.comment}"</p>
                            )}

                            {/* Admin Reply Display */}
                            {review.adminReply && (
                                <div className="mt-3 pl-3 border-l-2 border-primary/20">
                                    <p className="text-xs font-bold text-primary mb-0.5">Response:</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 italic">"{review.adminReply}"</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsTab;