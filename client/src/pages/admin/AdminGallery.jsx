import React, { useEffect, useState } from 'react';
import api from "@/lib/axios";
import {
    Trash2, Plus, Image as ImageIcon, Pencil, Loader2,
    UploadCloud, Sparkles, RefreshCw, X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { sooner } from "@/components/ui/use-sooner.jsx";

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Upload Form States
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [altText, setAltText] = useState("");

    // Edit States
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingImage, setEditingImage] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setFetchLoading(true);
        try {
            const { data } = await api.get('/gallery');
            setImages(data);
        } catch (error) {
            console.error("Error fetching images");
        } finally {
            setFetchLoading(false);
        }
    };

    // --- HANDLERS ---

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                sooner.error("File Too Large", "Max size is 5MB");
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            sooner.error("Missing Image", "Please select a file first.");
            return;
        }

        setLoading(true);
        const loadingSooner = sooner.loading("Uploading", "Optimizing & saving to cloud...");

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('altText', altText || "TS Hair Collection");

            const { data } = await api.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setImages([data, ...images]);

            // Reset
            setFile(null);
            setPreview("");
            setAltText("");

            loadingSooner.update({
                title: "Success!",
                description: "Image added to gallery.",
                variant: "success",
                duration: 3000
            });

        } catch (error) {
            loadingSooner.update({
                title: "Upload Failed",
                description: "Something went wrong.",
                variant: "destructive",
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubmit = async () => {
        if (!editingImage) return;
        setLoading(true);
        const loadingSooner = sooner.loading("Updating", "Saving changes...");

        try {
            const formData = new FormData();
            formData.append('altText', altText);
            if (file) formData.append('image', file);

            const { data } = await api.put(`/gallery/${editingImage._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setImages(images.map(img => img._id === data._id ? data : img));
            setIsEditOpen(false);
            setFile(null); // Clear file selection after update

            loadingSooner.update({
                title: "Updated",
                description: "Image details saved.",
                variant: "success",
                duration: 3000
            });
        } catch (error) {
            loadingSooner.update({
                title: "Error",
                description: "Update failed.",
                variant: "destructive",
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmSooner = sooner.error(
            "Delete Image?",
            "This action is permanent and cannot be undone.",
            Infinity
        );

        confirmSooner.update({
            action: (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                            confirmSooner.dismiss();
                            const delLoad = sooner.loading("Deleting...", "Removing asset...");
                            try {
                                await api.delete(`/gallery/${id}`);
                                setImages(images.filter(img => img._id !== id));
                                delLoad.update({ title: "Deleted", description: "Asset removed.", variant: "success", duration: 3000 });
                            } catch (e) {
                                delLoad.update({ title: "Error", description: "Delete failed.", variant: "destructive", duration: 3000 });
                            }
                        }}
                    >
                        Confirm
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => confirmSooner.dismiss()}>Cancel</Button>
                </div>
            ),
            variant: "interactive",
            duration: Infinity
        });
    };

    const openEdit = (img) => {
        setEditingImage(img);
        setAltText(img.altText);
        setPreview(img.imageUrl);
        setFile(null);
        setIsEditOpen(true);
    };

    return (
        <div className="relative min-h-screen pb-32">

            {/* --- 1. AMBIENT ADMIN BACKGROUND --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[100px] -z-10"></div>
            </div>

            <div className="relative z-10 space-y-8">

                {/* --- 2. HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-purple-100 dark:border-purple-900/30">
                                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                                Visual Assets
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Gallery <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Manager</span>
                        </h1>
                        <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
                            Manage showcase images. Optimized automatically for performance.
                        </p>
                    </div>

                    <Button onClick={fetchImages} variant="outline" className="hidden md:flex gap-2 rounded-xl border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800">
                        <RefreshCw className={`h-4 w-4 ${fetchLoading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>

                {/* --- 3. UPLOAD CARD (Modern Glassmorphism) --- */}
                <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 dark:border-slate-800 shadow-2xl shadow-purple-500/5 dark:shadow-none">
                    <form onSubmit={handleAddSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

                        {/* Left: Drag & Drop Area */}
                        <div className="lg:col-span-4">
                            <div className={`relative aspect-square w-full rounded-3xl border-2 border-dashed transition-all duration-300 group overflow-hidden ${preview ? 'border-purple-500 dark:border-purple-400' : 'border-gray-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'}`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                />

                                {preview ? (
                                    <div className="relative w-full h-full">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-300">
                                            <RefreshCw className="h-8 w-8 text-white mb-2" />
                                            <span className="text-white font-bold text-sm">Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <UploadCloud className="h-8 w-8 text-purple-500" />
                                        </div>
                                        <p className="font-bold text-gray-700 dark:text-slate-200">Click to Upload</p>
                                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or WebP (Max 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Inputs & Actions */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Add New Media</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400">Images are crucial for customer engagement. Ensure high quality.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide ml-1">Alt Text / Description</label>
                                    <Input
                                        value={altText}
                                        onChange={(e) => setAltText(e.target.value)}
                                        placeholder="e.g. Raw Curly Hair Bundle 24 inch"
                                        className="h-14 rounded-2xl bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500/20 transition-all text-base px-5"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <Button
                                    type="submit"
                                    disabled={loading || !file}
                                    className="h-14 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                >
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                                    Upload to Gallery
                                </Button>
                                {file && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => { setFile(null); setPreview(""); }}
                                        className="h-14 px-6 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* --- 4. GALLERY GRID --- */}
                <div>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-gray-400" /> Library ({images.length})
                        </h3>
                    </div>

                    {fetchLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {images.map((img) => (
                                <div key={img._id} className="group relative aspect-square rounded-[1.5rem] overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-slate-800">
                                    <img
                                        src={img.imageUrl}
                                        alt={img.altText}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Glass Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-4">
                                        <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <button
                                                onClick={() => openEdit(img)}
                                                className="h-10 w-10 bg-white/20 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(img._id)}
                                                className="h-10 w-10 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-white/90 text-xs font-medium text-center line-clamp-2 px-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            {img.altText}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- EDIT MODAL --- */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Edit Image</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 py-4">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-950 border-2 border-dashed border-gray-300 dark:border-slate-700 group cursor-pointer hover:border-purple-500 transition-colors">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                            <img src={preview} alt="Edit" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <p className="text-white text-sm font-bold flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Replace</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Alt Text</label>
                            <Input
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                className="h-12 rounded-xl bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button onClick={handleUpdateSubmit} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6">
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default AdminGallery;