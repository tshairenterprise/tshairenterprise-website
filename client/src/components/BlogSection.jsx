import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, BookOpen, Sparkles, MoveRight } from "lucide-react";

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await api.get('/blogs');
                setBlogs(data.slice(0, 3)); // Only show latest 3
            } catch (error) { console.error("Error fetching blogs"); }
        };
        fetchBlogs();
    }, []);

    if (blogs.length === 0) return null;

    return (
        <section className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">

            {/* --- BACKGROUND BLOBS (Hero Consistent) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Top Left - Purple Blob */}
                <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                {/* Bottom Right - Blue Blob */}
                <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">
                    <div className="text-left space-y-4 max-w-2xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                            <BookOpen className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" />
                            <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Industry Insights</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                            Latest From <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">The Journal</span>
                        </h2>

                        <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                            Expert hair care tips, sourcing secrets, and trends directly from the manufacturer.
                        </p>
                    </div>

                    {/* Desktop Button */}
                    <Button
                        onClick={() => navigate('/blogs')}
                        variant="outline"
                        className="hidden md:flex h-12 px-8 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all hover:scale-105"
                    >
                        View All Posts <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* --- BLOG GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <div
                            key={blog._id}
                            onClick={() => navigate(`/blog/${blog.slug}`)}
                            className="group cursor-pointer flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 animate-in fade-in zoom-in-95"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image Container */}
                            <div className="relative h-64 w-full overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Floating Date Badge */}
                                <div className="absolute top-5 left-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 shadow-lg border border-white/20">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                    {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 flex flex-col flex-1">
                                {/* Tags & Author */}
                                <div className="flex items-center gap-3 mb-4">
                                    {blog.tags && blog.tags[0] && (
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                                            {blog.tags[0]}
                                        </span>
                                    )}
                                    <span className="text-xs font-medium text-gray-400 dark:text-slate-500 flex items-center gap-1">
                                        <User className="h-3 w-3" /> Admin
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {blog.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                    {blog.excerpt}
                                </p>

                                {/* Read More Link */}
                                <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mt-auto">
                                    Read Article <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Button */}
                <div className="mt-12 md:hidden">
                    <Button onClick={() => navigate('/blogs')} className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl">
                        Explore All Articles
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default BlogSection;