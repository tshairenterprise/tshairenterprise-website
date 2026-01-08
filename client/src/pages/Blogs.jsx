import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { useNavigate } from 'react-router-dom';
import { Loader2, Calendar, ArrowRight, Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import SEO from '../components/SEO';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await api.get('/blogs');
                setBlogs(data);
                setFilteredBlogs(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching blogs");
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        const results = blogs.filter(blog =>
            blog.title.toLowerCase().includes(search.toLowerCase()) ||
            blog.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredBlogs(results);
    }, [search, blogs]);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 relative overflow-hidden pt-24 pb-20 transition-colors duration-500">

            <SEO
                title="Hair Industry Insights & Care Tips | TS Hair Enterprise Blog"
                description="Expert guides on maintaining raw Indian hair, industry trends, and manufacturing secrets directly from our factory in Beldanga, Murshidabad."
                keywords="Raw hair care tips, human hair industry blog, hair extension maintenance guide, TS Hair Enterprise blog, Indian hair export news"
                url={window.location.href}
            />

            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-200 dark:bg-pink-900/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/20 rounded-full blur-[100px] -z-10"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 px-4 py-1.5 rounded-full shadow-sm mb-6 backdrop-blur-md">
                        <BookOpen className="h-4 w-4 text-pink-600" />
                        <span className="text-xs font-bold tracking-wider uppercase text-gray-600 dark:text-slate-400">Knowledge Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
                        Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Stories</span>
                    </h1>

                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                        <Input
                            placeholder="Search articles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-14 rounded-full bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-lg focus:ring-2 focus:ring-pink-500/20 text-lg"
                        />
                    </div>
                </div>

                {/* --- BLOG GRID --- */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-pink-500" /></div>
                ) : filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog) => (
                            <div
                                key={blog._id}
                                onClick={() => navigate(`/blog/${blog.slug}`)}
                                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                            >
                                <div className="relative h-64 w-full overflow-hidden">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white shadow-lg">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {blog.tags?.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                                        {blog.excerpt}
                                    </p>
                                    <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors mt-auto">
                                        Read Full Story <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 dark:text-slate-400">No articles found matching your search.</div>
                )}

            </div>
        </div>
    );
};

export default Blogs;