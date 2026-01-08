import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, HelpCircle, MessageCircleQuestion, Eye, EyeOff, X } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { sooner } from "@/components/ui/use-sooner.jsx";

const AdminFaqs = () => {
    const [faqs, setFaqs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ question: "", answer: "" });
    const [loading, setLoading] = useState(true);

    const fetchFaqs = async () => {
        try {
            const { data } = await api.get('/faqs/admin');
            setFaqs(data);
            setLoading(false);
        } catch (error) {
            sooner.error("Fetch Error", "Failed to load FAQs list."); // ✅ Fetch Error
            setLoading(false);
        }
    };

    useEffect(() => { fetchFaqs(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const actionType = editingId ? "Updating" : "Creating";
        const loadingSooner = sooner.loading(
            `${actionType} FAQ`,
            `Saving question: ${formData.question.substring(0, 30)}...`
        );

        try {
            if (editingId) {
                await api.put(`/faqs/${editingId}`, formData);
            } else {
                await api.post('/faqs', formData);
            }

            loadingSooner.update({
                title: "Success!",
                description: `FAQ was saved successfully.`,
                variant: "success",
                duration: 3000
            });

            setIsOpen(false);
            setFormData({ question: "", answer: "" });
            setEditingId(null);
            fetchFaqs();
        } catch (error) {
            loadingSooner.update({
                title: "Action Failed",
                description: error.response?.data?.message || "Failed to save FAQ.",
                variant: "destructive",
                duration: 5000
            });
        }
    };

    const handleToggle = async (id, currentStatus) => {
        const action = currentStatus ? "Hiding" : "Publishing";
        const loadingSooner = sooner.loading(
            `${action} FAQ`,
            `Changing visibility status...`
        );

        try {
            await api.put(`/faqs/${id}`, { isActive: !currentStatus });

            loadingSooner.update({
                title: "Status Updated!",
                description: `FAQ is now ${currentStatus ? 'Hidden' : 'Visible'} to public.`,
                variant: "success",
                duration: 3000
            });

            fetchFaqs();
        } catch (error) {
            loadingSooner.update({
                title: "Toggle Failed",
                description: "Could not change FAQ visibility status.",
                variant: "destructive",
                duration: 5000
            });
        }
    };

    const handleDelete = async (id, question) => {

        const confirmationSooner = sooner.error(
            "Confirm Deletion",
            `Are you sure you want to delete the question: "${question.substring(0, 30)}..."?`,
            Infinity
        );

        confirmationSooner.update({
            action: (
                <>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                            confirmationSooner.dismiss();
                            const deleteLoading = sooner.loading("Deleting...", `Removing question...`);

                            try {
                                await api.delete(`/faqs/${id}`);

                                deleteLoading.update({
                                    title: "Deleted!",
                                    description: `Question successfully removed.`,
                                    variant: "success",
                                    duration: 3000
                                });

                                fetchFaqs();
                            } catch (error) {
                                deleteLoading.update({
                                    title: "Deletion Failed",
                                    description: error.response?.data?.message || "Error deleting question.",
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
                        className='text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/10'
                        onClick={() => confirmationSooner.dismiss()}
                    >
                        <X className='h-4 w-4 mr-1' /> Cancel
                    </Button>
                </>
            ),
            variant: "interactive",
            duration: Infinity
        });
    };

    const openEdit = (faq) => {
        setEditingId(faq._id);
        setFormData({ question: faq.question, answer: faq.answer });
        setIsOpen(true);
    };

    return (
        <div className="relative min-h-screen pb-20">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg text-violet-600 dark:text-violet-400">
                            <MessageCircleQuestion className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                            Knowledge Base
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        FAQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Manager</span>
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium max-w-lg">
                        Manage common questions to help your customers find answers quickly.
                    </p>
                </div>

                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) { setEditingId(null); setFormData({ question: "", answer: "" }); }
                }}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 dark:shadow-none transition-all hover:scale-105">
                            <Plus className="mr-2 h-5 w-5" /> Add Question
                        </Button>
                    </DialogTrigger>

                    {/* Modal Content */}
                    <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {editingId ? <Pencil className="h-5 w-5 text-violet-500" /> : <Plus className="h-5 w-5 text-violet-500" />}
                                {editingId ? "Edit Question" : "New Question"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Question</label>
                                <Input
                                    value={formData.question}
                                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                                    placeholder="e.g., What is the shipping time?"
                                    required
                                    className="h-12 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl focus:ring-violet-500 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Answer</label>
                                <Textarea
                                    value={formData.answer}
                                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                    placeholder="e.g., We usually ship within 3-5 business days."
                                    required
                                    rows={5}
                                    className="bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl focus:ring-violet-500 dark:text-white resize-none"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base">
                                {editingId ? "Update FAQ" : "Save FAQ"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* --- LIST SECTION --- */}
            <div className="grid gap-5 relative z-10">
                {faqs.map((faq) => (
                    <div
                        key={faq._id}
                        className="group bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 relative overflow-hidden"
                    >
                        {/* Decorative side bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${faq.isActive ? 'bg-violet-500' : 'bg-gray-200 dark:bg-slate-700'}`}></div>

                        <div className="flex-1">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-800 text-violet-600 dark:text-violet-400 shrink-0 mt-1">
                                    <HelpCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 pl-4 md:pl-0 md:border-l border-gray-100 dark:border-slate-800 min-w-[140px]">

                            {/* Status Toggle */}
                            <div className="flex flex-col items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${faq.isActive ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700'}`}>
                                    {faq.isActive ? 'Visible' : 'Hidden'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <EyeOff className={`h-3 w-3 ${!faq.isActive ? 'text-gray-400' : 'text-gray-300'}`} />
                                    <Switch
                                        checked={faq.isActive}
                                        onCheckedChange={() => handleToggle(faq._id, faq.isActive)}
                                        className="data-[state=checked]:bg-green-500 scale-90"
                                    />
                                    <Eye className={`h-3 w-3 ${faq.isActive ? 'text-green-500' : 'text-gray-300'}`} />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => openEdit(faq)}
                                    className="h-9 w-9 rounded-full bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(faq._id, faq.question)}
                                    className="h-9 w-9 rounded-full bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {faqs.length === 0 && !loading && (
                    <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-800">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 dark:bg-slate-800 mb-6">
                            <HelpCircle className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No FAQs Added</h3>
                        <p className="text-gray-500 dark:text-slate-400 mt-2">Start building your knowledge base today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFaqs;