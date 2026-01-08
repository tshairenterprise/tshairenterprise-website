import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Inbox,
    Clock,
    User,
    MessageSquare,
    CheckCircle2,
    Eye,
    EyeOff,
    RefreshCw,
    Archive,
    Trash2,
    ArrowUpRight,
    Search,
    Loader2
} from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('unread');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
            fetchMessages();
        }
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const loadingSooner = sooner.loading("Fetching Messages", "Loading latest contact submissions...");

        try {
            const { data } = await api.get('/messages');
            setMessages(data);

            loadingSooner.update({
                title: "Messages Loaded!",
                description: `${data.length} total messages retrieved.`,
                variant: "success",
                duration: 3000
            });
        } catch (error) {
            loadingSooner.update({
                title: "Fetch Failed",
                description: "Could not load messages. Check API access.",
                variant: "destructive",
                duration: 5000
            });
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id, currentStatus) => {
        const action = currentStatus ? "Marking Unread" : "Marking Read";
        const loadingSooner = sooner.loading(action, `Updating status of message ID: ${id.slice(-4)}...`);

        try {
            const { data } = await api.patch(`/messages/${id}/read`, { isRead: !currentStatus });

            setMessages(prev => prev.map(m => m._id === id ? data : m));

            loadingSooner.update({
                title: "Status Updated!",
                description: `Message marked as ${data.isRead ? 'read' : 'unread'}.`,
                variant: "default",
                duration: 3000
            });
        } catch (error) {
            loadingSooner.update({
                title: "Update Failed",
                description: "Could not update message read status.",
                variant: "destructive",
                duration: 5000
            });
        }
    };

    const filteredMessages = messages.filter(m => {
        if (filter === 'all') return true;
        return filter === 'read' ? m.isRead : !m.isRead;
    });

    // Helper to get time elapsed since submission
    const getTimeElapsed = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diff = now - created;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    };


    if (!user || loading) return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-gray-500 dark:text-slate-400 font-medium">
                {loading ? "Loading Messages..." : "Access Denied / Redirecting"}
            </p>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Inbox className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Customer Inquiries
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Message <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Inbox</span>
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium max-w-lg">
                        Manage all contact form submissions from your website visitors.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    {['unread', 'read', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${filter === f
                                ? 'bg-gray-900 dark:bg-primary text-white shadow-md'
                                : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {f} ({messages.filter(m => f === 'all' || (f === 'read' ? m.isRead : !m.isRead)).length})
                        </button>
                    ))}
                </div>
            </div>


            {/* --- MESSAGE LIST --- */}
            <div className="grid grid-cols-1 gap-4">
                {filteredMessages.length > 0 ? (
                    filteredMessages.map(message => (
                        <div
                            key={message._id}
                            className={cn(
                                "group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                                message.isRead
                                    ? "border-gray-100 dark:border-slate-800 opacity-80"
                                    : "border-blue-200 dark:border-blue-900/40 shadow-blue-500/10"
                            )}
                        >
                            {/* Inner Content Grid */}
                            <div className="flex justify-between items-start">
                                <div className="flex-1 space-y-3">

                                    {/* Sender Info & Status */}
                                    <div className="flex items-center gap-3">
                                        {message.user && message.user.avatar ? (
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={message.user.avatar} className="object-cover" />
                                                <AvatarFallback className="bg-blue-600 text-white font-bold">
                                                    {message.user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm", message.isRead ? "bg-gray-500" : "bg-blue-600")}>
                                                {message.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{message.name}</h3>
                                                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", message.isRead ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-700")}>
                                                    {message.isRead ? "READ" : "NEW"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">{message.email}</p>
                                        </div>
                                    </div>

                                    {/* Subject and Time */}
                                    <div className="pl-1 pt-2">
                                        <p className="font-semibold text-gray-700 dark:text-slate-300 mb-1">
                                            {message.subject || "No Subject"}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                                            <Clock className="h-3 w-3" /> {getTimeElapsed(message.createdAt)}
                                        </p>
                                    </div>

                                    {/* Message Snippet */}
                                    <div className="pt-3 border-t border-dashed border-gray-100 dark:border-slate-800">
                                        <p className="text-gray-600 dark:text-slate-300 text-sm italic line-clamp-3">
                                            "{message.message}"
                                        </p>
                                    </div>

                                    {/* WhatsApp Link */}
                                    <a
                                        href={`https://wa.me/${message.whatsappNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 hover:underline mt-2"
                                        onClick={() => sooner.info("External Link", "Opening WhatsApp chat in a new tab.", 3000)}
                                    >
                                        <MessageSquare className="h-3 w-3" /> Chat on WhatsApp ({message.whatsappNumber})
                                    </a>

                                </div>

                                {/* Actions (Mark Read/Unread) */}
                                <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className={cn(
                                            "h-9 px-4 rounded-xl text-xs font-bold transition-all",
                                            message.isRead ? "bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-slate-400" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                        )}
                                        onClick={() => handleMarkRead(message._id, message.isRead)}
                                    >
                                        {message.isRead ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                        {message.isRead ? 'Mark Unread' : 'Mark Read'}
                                    </Button>

                                    {/* Optional: View full details button */}
                                    <Button size="icon" variant="ghost" className="h-9 w-9 text-gray-400 hover:text-primary">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800">
                        <Inbox className="h-10 w-10 text-gray-300 dark:text-slate-600 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Messages Found</h3>
                        <p className="text-gray-500 dark:text-slate-400 mt-2">Try changing the filter settings.</p>
                    </div>
                )}
            </div>

            {/* Refresh button at the bottom */}
            <div className="text-center pt-8">
                <Button
                    onClick={() => fetchMessages(user.token)}
                    disabled={loading}
                    className="rounded-full h-12 px-8 bg-white dark:bg-slate-800 text-gray-700 dark:text-white border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-lg transition-all hover:scale-105"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Inbox
                </Button>
            </div>

        </div>
    );
};

export default AdminMessages;