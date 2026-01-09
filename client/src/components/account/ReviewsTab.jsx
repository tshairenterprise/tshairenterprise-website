import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Trash2, Pencil, Star, X, Check, Globe, ShoppingBag, Heart, MessageCircle } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

const ReviewsTab = ({ user }) => {
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
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
        } catch (error) { sooner.error("Error", "Failed to load reviews."); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        // Simple confirmation prompt logic (kept simple for UI code)
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await api.delete(`/reviews/${id}`);
            setMyReviews(prev => prev.filter(r => r._id !== id));
            sooner.success("Deleted", "Review removed.");
        } catch (error) { sooner.error("Error", "Could not delete review."); }
    };

    const startEditing = (review) => {
        setEditingId(review._id);
        setEditRating(String(review.rating));
        setEditComment(review.comment);
    };

    const saveEdit = async () => {
        try {
            await api.put(`/reviews/${editingId}`, { rating: editRating, comment: editComment });
            setMyReviews(prev => prev.map(r => r._id === editingId ? { ...r, rating: Number(editRating), comment: editComment } : r));
            setEditingId(null);
            sooner.success("Updated", "Review updated.");
        } catch (error) { sooner.error("Error", "Update failed."); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Your Reviews</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Feedback you've shared with us.</p>
                </div>
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/20">
                    {myReviews.length} Total
                </span>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-400 animate-pulse">Loading feedback...</div>
            ) : myReviews.length === 0 ? (
                <div className="py-20 text-center bg-gray-50/50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-800">
                    <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
                        <MessageCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">You haven't written any reviews yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {myReviews.map((review) => (
                        <div key={review._id} className="relative group bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">

                            {/* Actions (Floating) */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {editingId === review._id ? (
                                    <>
                                        <Button size="icon" className="h-8 w-8 bg-green-500 rounded-lg hover:bg-green-600" onClick={saveEdit}><Check className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-slate-800" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20" onClick={() => startEditing(review)}><Pencil className="h-3.5 w-3.5" /></Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20" onClick={() => handleDelete(review._id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                    </>
                                )}
                            </div>

                            {/* Header */}
                            <div className="flex gap-4 mb-4 pr-12">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${review.reviewType === 'website' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'}`}>
                                    {review.reviewType === 'website' ? <Globe className="h-6 w-6" /> : <ShoppingBag className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                        {review.reviewType === 'website' ? 'Website Feedback' : review.product?.name || "Product"}
                                    </h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        {editingId === review._id ? (
                                            <Select value={editRating} onValueChange={setEditRating}>
                                                <SelectTrigger className="h-7 w-24 text-xs"><SelectValue /></SelectTrigger>
                                                <SelectContent>{[5, 4, 3, 2, 1].map(r => <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>)}</SelectContent>
                                            </Select>
                                        ) : (
                                            [...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-slate-700"}`} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            {editingId === review._id ? (
                                <Textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} className="bg-gray-50 dark:bg-slate-800 border-none" />
                            ) : (
                                <div className="bg-gray-50/50 dark:bg-slate-900/50 p-4 rounded-xl">
                                    <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">"{review.comment}"</p>
                                </div>
                            )}

                            {/* Admin Reply */}
                            {review.adminReply && (
                                <div className="mt-4 flex gap-3 pl-4 border-l-2 border-primary/30">
                                    <Heart className="h-4 w-4 text-primary shrink-0 mt-1" />
                                    <div>
                                        <p className="text-xs font-bold text-primary uppercase mb-1">Admin Response</p>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 italic">"{review.adminReply}"</p>
                                    </div>
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