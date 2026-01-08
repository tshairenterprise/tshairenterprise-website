import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Minus, X, UploadCloud, Image as ImageIcon, Tag, Layers, DollarSign, Palette, FileText, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sooner } from "@/components/ui/use-sooner.jsx";

// Helper for Section Headers
const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">{title}</h3>
    </div>
);

const ProductForm = ({
    formData,
    setFormData,
    images,
    setImages,
    categories,
    onSubmit,
    onCancel,
    loading,
    isEditing,
    productData
}) => {

    // --- HANDLERS ---
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Stock Handlers
    const incrementStock = () => handleChange('stock', Number(formData.stock) + 1);
    const decrementStock = () => handleChange('stock', Math.max(0, Number(formData.stock) - 1));

    // Variant Handlers
    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        handleChange('variants', newVariants);
    };
    const addVariant = () => {
        const lastVariant = formData.variants[formData.variants.length - 1];
        if (lastVariant.length === '' || lastVariant.price === '') {
            sooner.info("Fill Current Variant", "Please fill the current length and price before adding a new variant.", 4000);
            return;
        }
        handleChange('variants', [...formData.variants, { length: '', price: '' }]);
    }
    const removeVariant = (index) => handleChange('variants', formData.variants.filter((_, i) => i !== index));

    // Color Handlers
    const handleColorChange = (index, value) => {
        const newColors = [...formData.colors];
        newColors[index] = value;
        handleChange('colors', newColors);
    };
    const addColor = () => {
        const lastColor = formData.colors[formData.colors.length - 1];
        if (lastColor === '') {
            sooner.info("Fill Current Color", "Please enter a name for the current color before adding a new one.", 4000);
            return;
        }
        handleChange('colors', [...formData.colors, '']);
    }
    const removeColor = (index) => handleChange('colors', formData.colors.filter((_, i) => i !== index));

    // Image Handlers
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImages(prev => ({ ...prev, main: file, previewMain: URL.createObjectURL(file) }));
        else setImages(prev => ({ ...prev, main: null }));
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            sooner.error("Too Many Images", "You can only upload a maximum of 5 gallery images.", 5000);
            e.target.value = null; // Clear the input
            return;
        }
        if (files.length > 0) {
            setImages(prev => ({ ...prev, gallery: files }));
        }
    };

    // Check if the main image is missing (only for initial creation)
    const isMainImageMissing = !isEditing && !images.main && !images.previewMain;


    return (
        <form id="product-form" onSubmit={onSubmit} className="flex flex-col h-full overflow-y-auto">

            {/* Scrollable content with horizontal and top padding */}
            <div className="flex-1 custom-scrollbar">

                {/* Apply padding directly to the grid container to ensure scroll stability */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 px-8">

                    {/* --- LEFT COLUMN (Main Info) --- */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Basic Info */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-5">
                            <SectionHeader icon={Tag} title="Basic Information" />
                            <div className="space-y-2">
                                <Label className="text-gray-600 dark:text-slate-300 font-semibold">Product Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    placeholder="e.g., Raw Indian Wavy Hair"
                                    className="h-12 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-600 dark:text-slate-300 font-semibold">Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                    placeholder="Detailed description..."
                                    rows={4}
                                    className="bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 dark:text-white resize-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Rich Text Highlights */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                            <SectionHeader icon={FileText} title="Product Highlights (Rich Text)" />
                            <div className="bg-white rounded-xl overflow-hidden text-gray-900 border border-gray-200">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.highlights}
                                    onChange={(val) => handleChange('highlights', val)}
                                    className="h-48"
                                    placeholder="• write features here..."
                                />
                            </div>
                        </div>

                        {/* Media Gallery */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                            <SectionHeader icon={ImageIcon} title="Media Gallery" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Main Image */}
                                <div className={`border-2 border-dashed ${isMainImageMissing ? 'border-red-500/50' : 'border-primary/30'} bg-primary/5 dark:bg-primary/10 rounded-2xl h-48 flex flex-col items-center justify-center text-center relative group cursor-pointer overflow-hidden hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors`}>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleMainImageChange} />
                                    {(images.main || images.previewMain) ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={images.main instanceof File ? URL.createObjectURL(images.main) : images.previewMain}
                                                alt="Main"
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        // Upload Icon/Text rendered safely
                                        <span className='flex flex-col items-center'>
                                            <UploadCloud className={`h-10 w-10 mb-2 ${isMainImageMissing ? 'text-red-500' : 'text-primary'}`} />
                                            <span className={`text-sm font-bold ${isMainImageMissing ? 'text-red-500' : 'text-primary'}`}>Upload Main Image</span>
                                        </span>
                                    )}
                                </div>

                                {/* Gallery Images */}
                                <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl h-48 flex flex-col items-center justify-center text-center relative cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleGalleryChange} />
                                    <ImageIcon className="h-10 w-10 text-gray-400 dark:text-slate-500 mb-2" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">Additional Images</span>
                                    <span className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                                        {images.gallery.length > 0 ? `${images.gallery.length} new files selected` : (isEditing && productData?.gallery?.length > 0 ? `${productData.gallery.length} existing images` : "Up to 5 images")}
                                    </span>
                                </div>
                            </div>
                            {isMainImageMissing && <p className="text-xs text-red-500 mt-2 font-semibold">⚠️ Main Image is required for new products.</p>}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN (Settings) --- */}
                    <div className="lg:col-span-4 space-y-6 pb-6">

                        {/* Organization */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-5">
                            <SectionHeader icon={Layers} title="Organization" />
                            <div className="space-y-2">
                                <Label className="text-gray-600 dark:text-slate-300 font-semibold">Category</Label>
                                <Select onValueChange={(val) => handleChange('category', val)} value={formData.category}>
                                    <SelectTrigger className="h-12 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-xl dark:text-white">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-600 dark:text-slate-300 font-semibold">Stock Count</Label>
                                <div className="flex items-center justify-between border border-gray-200 dark:border-slate-800 rounded-xl h-12 bg-gray-50 dark:bg-slate-950 overflow-hidden">
                                    <button type="button" onClick={decrementStock} className="w-12 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"><Minus className="h-4 w-4 text-gray-600 dark:text-slate-400" /></button>
                                    <input type="number" value={formData.stock} onChange={e => handleChange('stock', e.target.value)} className="flex-1 text-center bg-transparent border-none font-bold text-gray-900 dark:text-white outline-none" />
                                    <button type="button" onClick={incrementStock} className="w-12 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"><Plus className="h-4 w-4 text-gray-600 dark:text-slate-400" /></button>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Variants */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                            <SectionHeader icon={DollarSign} title="Pricing & Sizes" />
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {formData.variants.map((v, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input
                                            placeholder="Size (e.g. 10 inch)"
                                            value={v.length}
                                            onChange={e => handleVariantChange(i, 'length', e.target.value)}
                                            className="h-10 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-lg text-sm dark:text-white"
                                            required
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Price (e.g. 150)"
                                            value={v.price}
                                            onChange={e => handleVariantChange(i, 'price', e.target.value)}
                                            className="h-10 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-lg text-sm dark:text-white"
                                            required
                                        />
                                        {formData.variants.length > 1 && (
                                            <Button type="button" size="icon" variant="ghost" onClick={() => removeVariant(i)} className="h-10 w-10 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" size="sm" variant="secondary" onClick={addVariant} className="w-full mt-2 h-9 text-xs font-bold uppercase tracking-wide text-primary bg-primary/10 hover:bg-primary/20 border-0">
                                    <Plus className="h-4 w-4 mr-1" /> Add Variant
                                </Button>
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                            <SectionHeader icon={Palette} title="Colors" />
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {formData.colors.map((c, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input
                                            placeholder="Color Name (e.g. Natural Black)"
                                            value={c}
                                            onChange={e => handleColorChange(i, e.target.value)}
                                            className="h-10 bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-lg text-sm dark:text-white"
                                        />
                                        {formData.colors.length > 1 && (
                                            <Button type="button" size="icon" variant="ghost" onClick={() => removeColor(i)} className="h-10 w-10 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" size="sm" variant="secondary" onClick={addColor} className="w-full mt-2 h-9 text-xs font-bold uppercase tracking-wide text-primary bg-primary/10 hover:bg-primary/20 border-0">
                                    <Plus className="h-4 w-4 mr-1" /> Add Color
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer Buttons (Fixed at bottom) */}
            <div className="sticky bottom-0 left-0 right-0 mt-4 px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur flex justify-end gap-4 z-10">
                <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-8 rounded-xl border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 font-semibold hover:bg-gray-100 dark:hover:bg-slate-800">
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="h-12 px-10 rounded-xl bg-primary hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-200 dark:shadow-none">
                    {loading ? <Loader2 className='animate-spin mr-2 h-5 w-5' /> : <Save className='h-5 w-5 mr-2' />}
                    {loading ? "Saving..." : (isEditing ? "Update Product" : "Publish Product")}
                </Button>
            </div>
        </form >
    );
};

export default ProductForm;