import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Search, PackageOpen, Pencil, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { sooner } from "@/components/ui/use-sooner.jsx";
import ProductCard from './admin/products/ProductCard';
import ProductForm from './admin/products/ProductForm';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // --- PARENT STATE FOR FORM ---
    const initialFormState = {
        name: '', category: '', description: '', stock: 0, highlights: '',
        variants: [{ length: '', price: '' }], colors: ['']
    };
    const [formData, setFormData] = useState(initialFormState);
    const [images, setImages] = useState({ main: null, gallery: [], previewMain: '' });

    // Fetch Data
    const fetchData = async () => {
        try {
            const prodRes = await api.get('/products');
            const catRes = await api.get('/categories');
            setProducts(prodRes.data);
            setCategoriesList(catRes.data);
        } catch (error) {
            sooner.error("Fetch Error", "Failed to load product and category data.");
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- HANDLERS ---
    const resetForm = () => {
        setFormData(initialFormState);
        setImages({ main: null, gallery: [], previewMain: '' });
        setEditingId(null);
    };

    const handleEditClick = (product, e) => {
        e.stopPropagation();
        setEditingId(product._id);
        setFormData({
            name: product.name,
            category: product.category,
            description: product.description,
            stock: product.stock,
            highlights: product.highlights,
            variants: product.variants?.length ? product.variants : [{ length: '', price: '' }],
            colors: product.colors?.length ? product.colors : ['']
        });
        setImages({ main: null, gallery: [], previewMain: product.image });
        setIsAddOpen(true);
    };

    const handleDelete = async (id, name, e) => {
        e.stopPropagation();

        // 1. Interactive Confirmation Sooner
        const confirmationSooner = sooner.error(
            "Confirm Deletion",
            `Are you sure you want to delete product: "${name}"? This will delete associated reviews too.`,
            Infinity // Persistent
        );

        confirmationSooner.update({
            action: (
                <>
                    <Button
                        size="sm"
                        variant="destructive"
                        className='w-full sm:w-auto'
                        onClick={async () => {
                            confirmationSooner.dismiss();
                            const deleteLoading = sooner.loading("Deleting Product", `Removing ${name} and its data...`);

                            try {
                                await api.delete(`/products/${id}`);

                                deleteLoading.update({
                                    title: "Product Removed!",
                                    description: `Product '${name}' and all reviews were deleted.`,
                                    variant: "success",
                                    duration: 3000
                                });

                                fetchData();
                            } catch (error) {
                                deleteLoading.update({
                                    title: "Deletion Failed",
                                    description: error.response?.data?.message || "Error deleting product (check server logs).",
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
                </>
            ),
            variant: "interactive",
            duration: Infinity
        });
    };

    const handleToggleBestSeller = async (id, currentStatus, name) => {
        const action = currentStatus ? "Removing" : "Featuring";
        const loadingSooner = sooner.loading(
            `${action} Best Seller`,
            `Changing status of product '${name}'...`
        );

        try {
            await api.patch(`/products/${id}/bestseller`, {});

            loadingSooner.update({
                title: "Status Updated!",
                description: `Product is now ${currentStatus ? 'Hidden from Best Sellers' : 'Featured on Home Page'}.`,
                variant: "success",
                duration: 3000
            });

            fetchData();
        } catch (error) {
            loadingSooner.update({
                title: "Toggle Failed",
                description: "Could not change best seller status.",
                variant: "destructive",
                duration: 5000
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const actionType = editingId ? "Updating" : "Adding New";
        const loadingSooner = sooner.loading(
            `${actionType} Product`,
            `Processing data and image uploads... This may take a moment.`
        );

        try {
            const apiFormData = new FormData();

            // Append all fields
            Object.keys(formData).forEach(key => {
                if (key === 'variants' || key === 'colors') {
                    apiFormData.append(key, JSON.stringify(formData[key]));
                } else {
                    apiFormData.append(key, formData[key]);
                }
            });

            if (images.main) apiFormData.append('image', images.main);
            if (images.gallery.length > 0) {
                images.gallery.forEach((file) => apiFormData.append('gallery', file));
            }

            // Validation check (optional, but good practice)
            if (!editingId && !images.main) {
                loadingSooner.update({
                    title: "Missing Image",
                    description: "Main product image is required.",
                    variant: "destructive",
                    duration: 5000
                });
                setLoading(false);
                return;
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editingId) {
                await api.put(`/products/${editingId}`, apiFormData, config);
            } else {
                await api.post('/products', apiFormData, config);
            }

            loadingSooner.update({
                title: "Product Saved!",
                description: `${formData.name} was successfully ${editingId ? 'updated' : 'added to inventory'}.`,
                variant: "success",
                duration: 3000
            });

            setLoading(false);
            setIsAddOpen(false);
            fetchData();
            resetForm();
        } catch (error) {
            console.error(error);

            loadingSooner.update({
                title: "Saving Failed",
                description: error.response?.data?.message || "Error saving product. Check file sizes/fields.",
                variant: "destructive",
                duration: 5000
            });

            setLoading(false);
        }
    };

    const onOpenChange = (open) => {
        if (!open) resetForm();
        setIsAddOpen(open);
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-8 relative">
            <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Inventory</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Manage your collection, stock levels, and pricing.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-72 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-primary/20 dark:text-white transition-all"
                        />
                    </div>

                    {/* Add Button & Modal */}
                    <Dialog open={isAddOpen} onOpenChange={onOpenChange}>
                        <DialogTrigger asChild>
                            <Button onClick={resetForm} className="bg-primary hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-none rounded-2xl h-11 px-6 font-bold transition-transform hover:-translate-y-0.5">
                                <Plus className="mr-2 h-5 w-5" /> Add Product
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col bg-gray-50 dark:bg-slate-950 p-0 rounded-3xl border-0 shadow-2xl">
                            <DialogHeader className="px-8 py-6 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
                                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {editingId ? <Pencil className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
                                    {editingId ? "Edit Product" : "Add New Product"}
                                </DialogTitle>
                                <DialogDescription className="dark:text-slate-400">Fill in the details below to update your inventory.</DialogDescription>
                            </DialogHeader>

                            {/* Render Clean Form Component */}
                            <ProductForm
                                formData={formData}
                                setFormData={setFormData}
                                images={images}
                                setImages={setImages}
                                categories={categoriesList}
                                onSubmit={handleSubmit}
                                onCancel={() => onOpenChange(false)}
                                loading={loading}
                                isEditing={!!editingId}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* --- PRODUCT GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    // Render Clean Card Component
                    <ProductCard
                        key={product._id}
                        product={product}
                        onEdit={handleEditClick}
                        onDelete={(id, name, e) => handleDelete(id, name, e)} onToggleBestSeller={(id) => handleToggleBestSeller(id, product.isBestSeller, product.name)}
                    />
                ))}

                {products.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                        <div className="bg-gray-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PackageOpen className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Products Found</h3>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Add a new product to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;