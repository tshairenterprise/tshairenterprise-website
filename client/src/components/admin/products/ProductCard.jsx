import React from 'react';
import { Pencil, Trash2, ArrowUpRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const ProductCard = ({ product, onEdit, onDelete, onToggleBestSeller }) => {
    // Calculates the minimum price from the variants array
    const minPrice = product.variants?.length
        ? Math.min(...product.variants.map(v => Number(v.price)))
        : 0;

    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-purple-100/50 dark:hover:shadow-purple-900/20 transition-all duration-500 overflow-hidden">

            {/* Best Seller Toggle */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 pr-3 rounded-full shadow-sm border border-white/50 dark:border-slate-700 transition-all hover:bg-white dark:hover:bg-slate-900">
                <Switch
                    checked={product.isBestSeller}
                    // onToggleBestSeller will handle API call in parent (AdminProducts)
                    onCheckedChange={() => onToggleBestSeller(product._id, product.isBestSeller, product.name)}
                    className="data-[state=checked]:bg-yellow-400 scale-75"
                />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${product.isBestSeller ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-slate-500'}`}>
                    {product.isBestSeller ? 'Featured' : 'Hidden'}
                </span>
            </div>

            {/* Action Buttons (Edit/Delete) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300 ease-out">
                <button
                    onClick={(e) => onEdit(product, e)}
                    className="p-2.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <button
                    // We pass product.name because parent (AdminProducts) needs it for the delete confirmation sooner
                    onClick={(e) => onDelete(product._id, product.name, e)}
                    className="p-2.5 bg-white dark:bg-slate-800 text-red-500 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Image Area */}
            <div className="relative aspect-[4/3] bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <p className="text-white text-xs font-medium opacity-90 line-clamp-2">{product.description}</p>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800 mt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wide">Starting From</span>
                        <span className="text-lg font-extrabold text-gray-900 dark:text-white">${minPrice}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${product.stock > 5 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30'}`}>
                        {product.stock} In Stock
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;