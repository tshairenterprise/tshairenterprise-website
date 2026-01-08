import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import {
    ArrowLeft, Calendar, User, Clock, Share2,
    Loader2, Heart, Check, Twitter, Facebook, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SEO from '../components/SEO';

const BlogDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await api.get(`/blogs/${slug}`);
                setBlog(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching blog");
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    // --- SCROLL PROGRESS ---
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(Number(scroll));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const getReadTime = (content) => {
        const text = content.replace(/<[^>]+>/g, '');
        const words = text.trim().split(/\s+/).length;
        return `${Math.ceil(words / 200)} min read`;
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <div className="relative">
                <div className="absolute inset-0 bg-pink-500 blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="h-12 w-12 text-pink-600 animate-spin relative z-10" />
            </div>
            <p className="text-gray-500 dark:text-slate-400 font-medium mt-4 tracking-widest uppercase text-xs">Loading Story...</p>
        </div>
    );

    if (!blog) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-red-500 font-bold">Article Not Found</div>;

    // --- ADVANCED SEO & SCHEMA GENERATION START ---

    // 1. Dynamic Meta Tags
    const seoTitle = `${blog.title} - Expert Guide by TS Hair Enterprise`;
    const seoDesc = blog.excerpt || `Read this expert guide on ${blog.title}. TS Hair Enterprise shares insights from Beldanga, India.`;
    const seoKeywords = `${blog.tags?.join(', ')}, hair care advice, TS Hair Enterprise guide, ${blog.title}`;

    // 2. Structured Data (JSON-LD) for AI Overview & Google Discover
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        },
        "headline": blog.title,
        "description": seoDesc,
        "image": blog.image,
        "author": {
            "@type": "Organization",
            "name": "TS Hair Enterprise",
            "url": "https://tshairenterprise.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "TS Hair Enterprise",
            "logo": {
                "@type": "ImageObject",
                "url": "https://tshairenterprise.com/logo.webp"
            }
        },
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt || blog.createdAt,
    };
    // --- SEO END ---

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 font-sans selection:bg-pink-100 dark:selection:bg-pink-900/30">

            <SEO
                title={seoTitle}
                description={seoDesc}
                keywords={seoKeywords}
                image={blog.image}
                url={window.location.href}
                type="article"          // ✅ IMPORTANT: Tells Google this is an Article
                schema={articleSchema}  // ✅ IMPORTANT: Passes specific Blog Schema
            />

            {/* --- READING PROGRESS BAR --- */}
            <div className="fixed top-0 left-0 h-1 z-50 w-full bg-transparent">
                <div
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-all duration-100 ease-out"
                    style={{ width: `${scrollProgress * 100}%` }}
                ></div>
            </div>

            {/* --- FLOATING BACK BUTTON --- */}
            <button
                onClick={() => navigate('/blogs')}
                className="fixed top-24 left-4 z-40 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 shadow-lg text-gray-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:scale-110 transition-all duration-300 group hidden xl:flex items-center gap-2"
            >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="w-0 overflow-hidden group-hover:w-12 transition-all duration-300 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100">Back</span>
            </button>

            {/* --- MAIN CONTAINER --- */}
            <article className="pt-32 pb-24">

                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-12">

                    {/* Tags */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {blog.tags?.map(tag => (
                            <span key={tag} className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                        {blog.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 ring-2 ring-pink-100 dark:ring-pink-900/30">
                                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white text-xs font-bold">JH</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">Published By</p>
                                <p className="text-xs">{blog.author || "TS Hair Enterprise"}</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-gray-200 dark:bg-slate-800"></div>
                        <div className="text-left">
                            <p className="flex items-center gap-1.5 text-xs font-medium"><Calendar className="h-3 w-3" /> {new Date(blog.createdAt).toLocaleDateString()}</p>
                            <p className="flex items-center gap-1.5 text-xs font-medium text-pink-600 dark:text-pink-400 mt-0.5"><Clock className="h-3 w-3" /> {getReadTime(blog.content)}</p>
                        </div>
                    </div>
                </div>

                {/* 2. PARALLAX IMAGE WRAPPER */}
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-16 md:mb-24">
                    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] shadow-2xl dark:shadow-none border-4 border-white dark:border-slate-800 group">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </div>

                {/* 3. CONTENT LAYOUT WITH STICKY SIDEBAR */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-12 relative">

                    {/* --- LEFT: STICKY ACTION DOCK (Desktop) --- */}
                    <div className="hidden lg:flex flex-col gap-6 sticky top-32 h-fit w-16 items-center">
                        <div className="flex flex-col gap-3 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-gray-200 dark:border-slate-800">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isLiked ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600' : 'text-gray-400 hover:text-pink-600 dark:text-slate-500'}`}
                            >
                                <Heart className={`h-5 w-5 ${isLiked ? 'fill-pink-600' : ''}`} />
                            </button>
                            <div className="h-px w-6 bg-gray-200 dark:bg-slate-800 mx-auto"></div>
                            <button onClick={handleCopyLink} className="p-3 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 relative group">
                                {copySuccess ? <Check className="h-5 w-5 text-green-500" /> : <LinkIcon className="h-5 w-5" />}
                                <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Copy Link</span>
                            </button>
                            <button className="p-3 rounded-full text-gray-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-300">
                                <Twitter className="h-5 w-5" />
                            </button>
                            <button className="p-3 rounded-full text-gray-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                                <Facebook className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* --- CENTER: RICH CONTENT --- */}
                    <div className="flex-1 max-w-3xl mx-auto">

                        {/* Article Body */}
                        <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white 
                            prose-p:text-gray-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed 
                            prose-a:text-pink-600 dark:prose-a:text-pink-400 prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-3xl prose-img:shadow-xl
                            prose-blockquote:border-l-4 prose-blockquote:border-pink-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
                            first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 dark:first-letter:text-white first-letter:mr-3 first-letter:float-left
                            rich-text-content">

                            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                        </div>

                        {/* --- FOOTER: AUTHOR CARD --- */}
                        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-slate-800">
                            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 p-8 rounded-3xl border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left shadow-sm">
                                <div className="relative shrink-0">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full blur opacity-30"></div>
                                    <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-900 relative">
                                        <AvatarFallback className="bg-gray-900 text-white font-bold text-2xl">JH</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest mb-1">Written By</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">TS Hair Enterprise</h3>
                                    <p className="text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                                        We are a premium exporter of raw Indian human hair. Our mission is to provide authentic, ethically sourced textures to stylists and brands globally.
                                    </p>
                                    <Button onClick={() => navigate('/shop')} variant="outline" className="rounded-full border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm">
                                        Explore Our Collection
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* --- RIGHT: EMPTY (For Centering Balance) --- */}
                    <div className="hidden lg:block w-16"></div>

                </div>

            </article>
        </div>
    );
};

export default BlogDetails;