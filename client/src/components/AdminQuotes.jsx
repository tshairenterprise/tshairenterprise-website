import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
    Clock,
    User,
    ShoppingBag,
    Mail,
    CheckCircle2,
    AlertCircle,
    MessageCircle,
    ExternalLink,
    RefreshCw,
    Inbox
} from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

const EXPIRY_HOURS = 48;

const getRemainingTimeLabel = (createdAt, now) => {
    const created = new Date(createdAt).getTime();
    const expiry = created + EXPIRY_HOURS * 60 * 60 * 1000;
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
};

const AdminQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [now, setNow] = useState(Date.now());

    const fetchQuotes = async () => {

        // 1. Loading Sooner Start for Refresh
        const loadingSooner = sooner.loading(
            "Fetching Quotes",
            "Syncing real-time quote requests from the server..."
        );

        try {
            setLoading(true);
            const { data } = await api.get("/quotes/admin");
            setQuotes(data);

            // 2. Success Sooner Update
            loadingSooner.update({
                title: "Sync Complete",
                description: `${data.length} quotes loaded successfully.`,
                variant: "success",
                duration: 3000
            });

        } catch (error) {

            // 3. Error Sooner Update
            loadingSooner.update({
                title: "Fetch Failed",
                description: "Could not load quote data. Check admin privileges.",
                variant: "destructive",
                duration: 5000
            });

            console.error("Error fetching quotes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkContacted = async (id) => {

        // 1. Loading Sooner Start for Status Update
        const loadingSooner = sooner.loading(
            "Updating Status",
            "Marking quote as 'Contacted'..."
        );

        try {
            const { data } = await api.put(
                `/quotes/${id}/status`,
                { status: "Contacted" }
            );
            setQuotes((prev) => prev.map((q) => (q._id === id ? data : q)));

            // 2. Success Sooner Update
            loadingSooner.update({
                title: "Quote Closed!",
                description: "Quote status updated to 'Contacted'. Good job!",
                variant: "success",
                duration: 3000
            });

        } catch (error) {

            // 3. Error Sooner Update
            loadingSooner.update({
                title: "Update Failed",
                description: error.response?.data?.message || "Failed to update status.",
                variant: "destructive",
                duration: 5000
            });

            console.error(error);
        }
    };

    const buildWhatsappUrl = (rawNumber, text) => {
        if (!rawNumber) return null;
        const phone = String(rawNumber).replace(/[^\d]/g, "");
        if (!phone) return null;
        return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    };

    const handleContactWhatsapp = (quote) => {
        const number = quote.user?.whatsappNumber;

        if (!number) {
            // Sooner Error for Missing WhatsApp
            sooner.error(
                "Missing Contact Info",
                "User has not provided a WhatsApp number in their profile.",
                5000
            );
            return;
        }

        const text =
            `New Quote Request from TS Hair Website ✨\n\n` +
            `👤 Customer: ${quote.user?.name || "Unknown"}\n` +
            `📧 Email: ${quote.user?.email || "-"}\n\n` +
            `💇‍♀️ Product Details:\n` +
            `- Name: ${quote.product?.name || "Unknown Product"}\n` +
            `- Length: ${quote.selectedDetails?.length || "-"}\n` +
            `- Shade: ${quote.selectedDetails?.color || "-"}\n` +
            `- Price Idea: ${quote.selectedDetails?.price || "-"}\n\n` +
            `Please reply with best price + live video.`;

        const url = buildWhatsappUrl(number, text);
        if (!url) {
            // Sooner Error for Invalid WhatsApp
            sooner.error(
                "Invalid Number",
                "WhatsApp URL could not be generated. Check the user's saved number format.",
                5000
            );
            return;
        }
        window.open(url, "_blank");

        // Sooner Info for External Link
        sooner.info(
            "Opening WhatsApp Chat",
            `Starting chat with ${quote.user?.name || 'Customer'}. Remember to mark the quote as contacted.`,
            4000
        );
    };

    return (
        <div className="relative min-h-screen pb-20">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                            <Inbox className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                            Live Requests
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Quotes <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">Inbox</span>
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium max-w-lg">
                        Real-time pricing requests from customers. Quotes auto-expire in {EXPIRY_HOURS} hours to keep data fresh.
                    </p>
                </div>

                <Button
                    onClick={fetchQuotes}
                    disabled={loading}
                    className="rounded-xl h-12 px-6 bg-white dark:bg-slate-800 text-gray-700 dark:text-white border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-all hover:scale-105"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* --- LIST SECTION --- */}
            <div className="grid grid-cols-1 gap-5 relative z-10">
                {quotes.map((quote) => {
                    const remaining = getRemainingTimeLabel(quote.createdAt, now);
                    const isExpired = remaining === "Expired";
                    const isPending = quote.status === "Pending";

                    const productName = quote.product?.name || "Unknown Product";
                    const productImage = quote.product?.image || "";
                    const userName = quote.user?.name || "Unknown User";
                    const userEmail = quote.user?.email || "";
                    const userWhatsapp = quote.user?.whatsappNumber || "";

                    return (
                        <div
                            key={quote._id}
                            className={`group relative bg-white dark:bg-slate-900 rounded-[2rem] p-1 border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl 
                            ${isPending
                                    ? "border-orange-100 dark:border-orange-900/30 hover:border-orange-200 dark:hover:border-orange-800"
                                    : "border-gray-100 dark:border-slate-800"
                                }`}
                        >
                            {/* Inner Card Content */}
                            <div className="bg-white dark:bg-slate-900 rounded-[1.8rem] p-5 md:p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between h-full relative z-10">

                                {/* 1. Product & Status */}
                                <div className="flex-1 flex flex-col sm:flex-row gap-5">
                                    {/* Thumbnail with Timer Badge */}
                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shrink-0 shadow-inner">
                                        {productImage ? (
                                            <img src={productImage} alt={productName} className="w-full h-full object-cover transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="h-8 w-8 text-gray-300" /></div>
                                        )}

                                        {/* Timer Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1 flex items-center justify-center gap-1">
                                            <Clock className="h-3 w-3 text-white" />
                                            <span className={`text-[10px] font-bold ${isExpired ? "text-red-400" : "text-white"}`}>
                                                {remaining}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {productName}
                                            </h2>
                                            <span
                                                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm uppercase tracking-wider ${isPending
                                                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/30"
                                                    : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                                                    }`}
                                            >
                                                {isPending ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                                {quote.status}
                                            </span>
                                        </div>

                                        {/* Specs Grid */}
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <div className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-slate-300">
                                                <span className="text-gray-400 dark:text-slate-500 text-xs mr-1">Length:</span>
                                                <span className="font-bold">{quote.selectedDetails?.length}</span>
                                            </div>
                                            <div className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-slate-300">
                                                <span className="text-gray-400 dark:text-slate-500 text-xs mr-1">Shade:</span>
                                                <span className="font-bold">{quote.selectedDetails?.color}</span>
                                            </div>
                                            <div className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-slate-300">
                                                <span className="text-gray-400 dark:text-slate-500 text-xs mr-1">Est. Price:</span>
                                                <span className="font-bold text-green-600 dark:text-green-400">{quote.selectedDetails?.price}</span>
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-slate-400 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center"><User className="h-3 w-3" /></div>
                                                <span className="font-medium">{userName}</span>
                                            </div>
                                            {userEmail && (
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="h-3.5 w-3.5" /> {userEmail}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Actions */}
                                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-slate-800 pt-4 md:pt-0 mt-2 md:mt-0">
                                    <Button
                                        size="sm"
                                        className="w-full md:w-auto rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-none border border-green-600"
                                        disabled={!userWhatsapp}
                                        onClick={() => handleContactWhatsapp(quote)}
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        WhatsApp Chat
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className={`w-full md:w-auto rounded-xl border ${quote.status === "Contacted"
                                            ? "border-emerald-100 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/30"
                                            : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                                            }`}
                                        disabled={quote.status === "Contacted" || isExpired}
                                        onClick={() => handleMarkContacted(quote._id)}
                                    >
                                        {quote.status === "Contacted" ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Deal Closed</> : "Mark Contacted"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {quotes.length === 0 && !loading && (
                    <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-900/10 mb-6">
                            <Inbox className="h-10 w-10 text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Caught Up!</h3>
                        <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                            No active quote requests at the moment. Check back later or promote your products.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminQuotes;