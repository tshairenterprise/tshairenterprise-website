import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, BookOpen, Sparkles } from "lucide-react";

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await api.get('/blogs');
                setBlogs(data.slice(0, 3));
            } catch (error) { console.error("Error fetching blogs"); }
        };
        fetchBlogs();
    }, []);

    if (blogs.length === 0) return null;

    return (
        <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">

            {/* --- BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-pink-100/50 dark:bg-pink-900/10 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-normal"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-orange-100/50 dark:bg-orange-900/10 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-normal"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-left space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 backdrop-blur-sm">
                            <BookOpen className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                            <span className="text-[11px] font-bold tracking-widest uppercase text-pink-700 dark:text-pink-300">Our Journal</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                            Latest From <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">The Blog</span>
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 font-medium text-lg">
                            Expert tips, hair care guides, and industry insights curated for you.
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate('/blogs')}
                        variant="outline"
                        className="hidden md:flex h-12 px-8 rounded-full border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:border-pink-500 dark:hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400 bg-transparent transition-all hover:shadow-lg"
                    >
                        View All Posts
                    </Button>
                </div>

                {/* --- BLOG GRID (1 ROW) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            onClick={() => navigate(`/blog/${blog.slug}`)}
                            className="group cursor-pointer flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-pink-500/10 dark:hover:shadow-pink-900/20 transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Image */}
                            <div className="relative h-60 w-full overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Date Badge */}
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 shadow-lg">
                                    <Calendar className="h-3 w-3 text-pink-500" />
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    {blog.tags && blog.tags[0] && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-md">
                                            {blog.tags[0]}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                                        <User className="h-3 w-3" /> By Admin
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                    {blog.title}
                                </h3>

                                <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                    {blog.excerpt}
                                </p>

                                <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors mt-auto">
                                    Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Button */}
                <div className="mt-12 md:hidden">
                    <Button onClick={() => navigate('/blogs')} className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl">
                        Explore Blog
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default BlogSection;