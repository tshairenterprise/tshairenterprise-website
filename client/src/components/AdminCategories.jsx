import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, FolderKanban, Tag, Layers, Sparkles, X } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sooner } from "@/components/ui/use-sooner.jsx";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            sooner.error("Fetch Error", "Failed to load categories list.");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const actionType = editingId ? "Updating" : "Creating";
        const loadingSooner = sooner.loading(
            `${actionType} Category`,
            `Saving ${name} to the database...`
        );

        setLoading(true);
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, { name });
            } else {
                await api.post('/categories', { name });
            }

            loadingSooner.update({
                title: "Success!",
                description: `Category '${name}' was saved successfully.`,
                variant: "success",
                duration: 3000
            });

            setIsOpen(false);
            setName('');
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to save category.";

            loadingSooner.update({
                title: "Action Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cat) => {
        setName(cat.name);
        setEditingId(cat._id);
        setIsOpen(true);
    };

    const handleDelete = async (id, name) => {

        // 1. Interactive Confirmation Sooner
        const confirmationSooner = sooner.error(
            "Confirm Deletion",
            `Are you sure you want to delete category: '${name}'? This action is irreversible and may affect linked products.`,
            Infinity // Persistent
        );

        confirmationSooner.update({
            action: (
                <>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                            confirmationSooner.dismiss();
                            const deleteLoading = sooner.loading("Deleting...", `Removing category ${name}...`);

                            try {
                                await api.delete(`/categories/${id}`);

                                deleteLoading.update({
                                    title: "Deleted!",
                                    description: `Category '${name}' successfully removed.`,
                                    variant: "success",
                                    duration: 3000
                                });

                                fetchCategories();
                            } catch (error) {
                                deleteLoading.update({
                                    title: "Deletion Failed",
                                    description: error.response?.data?.message || "Error deleting category.",
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

    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            setName('');
            setEditingId(null);
        }
    };

    return (
        <div className="space-y-8 relative">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Categories</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Organize your inventory structure.</p>
                </div>

                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-none rounded-2xl h-12 px-6 font-bold transition-transform hover:-translate-y-0.5">
                            <Plus className="mr-2 h-5 w-5" /> Add Category
                        </Button>
                    </DialogTrigger>

                    {/* --- MODAL --- */}
                    <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl rounded-3xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {editingId ? <Pencil className="h-5 w-5 text-primary" /> : <Sparkles className="h-5 w-5 text-primary" />}
                                {editingId ? "Edit Category" : "New Category"}
                            </DialogTitle>
                            <DialogDescription className="dark:text-slate-400">
                                Create a descriptive name for this collection.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-slate-300 font-semibold">Category Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Bulk Hair, Wavy Textures"
                                    required
                                    className="h-12 rounded-xl bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-primary transition-all dark:text-white"
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-purple-700 font-bold shadow-lg">
                                {loading ? "Saving..." : (editingId ? "Update Category" : "Create Category")}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* --- CATEGORIES GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        className="group bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 dark:hover:shadow-purple-900/20 transition-all duration-300 relative overflow-hidden flex flex-col"
                    >
                        {/* Decorative Background Pattern */}
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full group-hover:bg-purple-50 dark:group-hover:bg-slate-800 transition-colors duration-500"></div>

                        {/* Content */}
                        <div className="p-6 flex-1 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <FolderKanban className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{cat.name}</h3>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-0.5 flex items-center gap-1">
                                        <Tag className="h-3 w-3" /> Collection
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex justify-between gap-2">
                            <button
                                onClick={() => handleEdit(cat)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 bg-transparent transition-colors"
                            >
                                <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                            <div className="w-px bg-gray-200 dark:bg-slate-700 my-1"></div>
                            <button
                                onClick={() => handleDelete(cat._id)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 bg-transparent transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {categories.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                        <div className="bg-gray-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layers className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Categories Yet</h3>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 mb-4">Start organizing your products by creating categories.</p>
                        <Button variant="outline" onClick={() => setIsOpen(true)}>Create First Category</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;