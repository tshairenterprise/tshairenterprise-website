import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, BookOpen, Image as ImageIcon, Tag, Eye, X } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from "@/components/ui/dialog";
import { sooner } from "@/components/ui/use-sooner.jsx";

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        image: null,
        previewImage: ''
    });

    const fetchBlogs = async () => {
        try {
            const { data } = await api.get('/blogs/admin');
            setBlogs(data);
        } catch (error) {
            sooner.error("Fetch Error", "Failed to load the list of blog posts.");
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const resetForm = () => {
        setFormData({ title: '', excerpt: '', content: '', tags: '', image: null, previewImage: '' });
        setEditingId(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file, previewImage: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const actionType = editingId ? "Updating" : "Publishing";
        const loadingSooner = sooner.loading(
            `${actionType} Blog Post`,
            `Processing content and image upload... This may take a moment.`
        );

        setLoading(true);
        try {
            const data = new FormData();

            data.append('title', formData.title);
            data.append('excerpt', formData.excerpt);
            data.append('content', formData.content);

            // Convert comma separated tags to JSON array
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
            data.append('tags', JSON.stringify(tagsArray));

            if (formData.image) data.append('image', formData.image);
            else if (!editingId && !formData.previewImage) {
                // Check if main image is missing during creation
                loadingSooner.update({
                    title: "Missing Image",
                    description: "Please select a cover image for the blog post.",
                    variant: "destructive",
                    duration: 5000
                });
                setLoading(false);
                return;
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editingId) {
                await api.put(`/blogs/${editingId}`, data, config);
            } else {
                await api.post('/blogs', data, config);
            }

            loadingSooner.update({
                title: "Blog Saved!",
                description: `Post '${formData.title}' was successfully ${editingId ? 'updated' : 'published'}.`,
                variant: "success",
                duration: 3000
            });

            setIsOpen(false);
            resetForm();
            fetchBlogs();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error saving blog post.";

            loadingSooner.update({
                title: "Action Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {

        const confirmationSooner = sooner.error(
            "Confirm Deletion",
            `Are you sure you want to delete the blog post: "${title}"?`,
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
                            const deleteLoading = sooner.loading("Deleting...", `Removing blog post: ${title}...`);

                            try {
                                await api.delete(`/blogs/${id}`);

                                deleteLoading.update({
                                    title: "Deleted!",
                                    description: `Blog post successfully removed.`,
                                    variant: "success",
                                    duration: 3000
                                });

                                fetchBlogs();
                            } catch (error) {
                                deleteLoading.update({
                                    title: "Deletion Failed",
                                    description: error.response?.data?.message || "Error deleting blog post.",
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

    const handleEdit = (blog) => {
        setEditingId(blog._id);
        setFormData({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            tags: blog.tags ? blog.tags.join(', ') : '',
            image: null,
            previewImage: blog.image
        });
        setIsOpen(true);
    };

    const handleToggle = async (id, currentStatus, title) => {
        const action = currentStatus ? "Unpublishing" : "Publishing";
        const loadingSooner = sooner.loading(
            `${action} Post`,
            `Changing status of '${title}'...`
        );

        try {
            await api.put(`/blogs/${id}`, { isActive: !currentStatus });

            loadingSooner.update({
                title: "Status Updated!",
                description: `'${title}' is now ${currentStatus ? 'a Draft' : 'Published'}.`,
                variant: "success",
                duration: 3000
            });

            fetchBlogs();
        } catch (error) {
            loadingSooner.update({
                title: "Toggle Failed",
                description: "Could not change blog post status.",
                variant: "destructive",
                duration: 5000
            });
        }
    };

    return (
        <div className="relative min-h-screen pb-20">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg text-pink-600 dark:text-pink-400">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                            Content Marketing
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Manager</span>
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
                        Create SEO-rich articles to engage your customers.
                    </p>
                </div>

                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl h-12 px-6 bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-200 dark:shadow-none transition-all hover:scale-105">
                            <Plus className="mr-2 h-5 w-5" /> Write New Blog
                        </Button>
                    </DialogTrigger>

                    {/* --- BLOG FORM MODAL --- */}
                    <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col bg-gray-50 dark:bg-slate-950 p-0 rounded-3xl border-0 shadow-2xl">
                        <DialogHeader className="px-8 py-6 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {editingId ? <Pencil className="h-6 w-6 text-pink-500" /> : <Plus className="h-6 w-6 text-pink-500" />}
                                {editingId ? "Edit Blog Post" : "Create New Post"}
                            </DialogTitle>
                            <DialogDescription className="dark:text-slate-400">
                                Fill in the content below. Rich text and SEO tags supported.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">

                                {/* Title & Tags */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Blog Title</label>
                                        <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. 5 Tips for Raw Hair Care" required className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Tags (Comma Separated)</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="hair care, raw hair, styling" className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 dark:text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Cover Image</label>
                                    <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl h-40 flex flex-col items-center justify-center relative cursor-pointer hover:border-pink-300 transition-colors group overflow-hidden">
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                        {formData.previewImage ? (
                                            <img src={formData.previewImage} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2 group-hover:text-pink-500 transition-colors" />
                                                <span className="text-sm text-gray-500 dark:text-slate-400">Click to upload cover image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Short Excerpt (Summary)</label>
                                    <Textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Brief summary for the card view..." required className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 dark:text-white resize-none h-20" />
                                </div>

                                {/* Rich Text Editor */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Full Content</label>
                                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 text-gray-900">
                                        <ReactQuill theme="snow" value={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} className="h-64 mb-12" placeholder="Write your amazing blog here..." />
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-4 flex-shrink-0">
                            <Button variant="outline" onClick={() => setIsOpen(false)} className="dark:text-slate-300 dark:border-slate-700">Cancel</Button>
                            <Button form="blog-form" type="submit" disabled={loading} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                                {loading ? "Saving..." : (editingId ? "Update Post" : "Publish Post")}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* --- BLOGS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {blogs.map((blog) => (
                    <div key={blog._id} className="group bg-white dark:bg-slate-900 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

                        {/* Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-gray-100 dark:border-slate-700">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                                {blog.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                                {blog.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 mt-auto">
                                <div className="flex items-center gap-2">
                                    <Switch checked={blog.isActive} onCheckedChange={() => handleToggle(blog._id, blog.isActive, blog.title)} className="scale-75 data-[state=checked]:bg-green-500" />
                                    <span className={`text-[10px] font-bold uppercase ${blog.isActive ? 'text-green-600' : 'text-gray-400'}`}>{blog.isActive ? 'Published' : 'Draft'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(blog)} className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"><Pencil className="h-3.5 w-3.5" /></Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(blog._id, blog.title)} className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {blogs.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-800">
                        <BookOpen className="h-10 w-10 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Blogs Yet</h3>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Start writing your first article.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBlogs;