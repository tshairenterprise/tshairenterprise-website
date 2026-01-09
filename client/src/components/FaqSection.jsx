import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircleQuestion, Sparkles, HelpCircle } from 'lucide-react';

const FaqSection = () => {
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const { data } = await api.get('/faqs');
                setFaqs(data);
            } catch (error) { console.error("Error fetching FAQs"); }
        };
        fetchFaqs();
    }, []);

    if (faqs.length === 0) return null;

    return (
        <section className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">

            {/* --- BACKGROUND BLOBS (Hero Sync) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Top Right - Purple Blob */}
                <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                {/* Bottom Left - Blue Blob */}
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

                {/* Floating Icon (Decorative) */}
                <div className="absolute top-20 left-10 text-primary/5 dark:text-primary/10 animate-bounce-slow">
                    <MessageCircleQuestion className="h-24 w-24 rotate-12" />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- HEADER --- */}
                <div className="text-center mb-16 animate-in slide-in-from-bottom-10 duration-700 fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
                        <HelpCircle className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" />
                        <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Support Center</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">Questions</span>
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                        Everything you need to know about our sourcing, shipping, and quality guarantees.
                    </p>
                </div>

                {/* --- MODERN ACCORDION --- */}
                <div className="grid gap-4 animate-in slide-in-from-bottom-20 duration-1000 delay-100 fade-in">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={faq._id}
                                value={`item-${index}`}
                                className="group border border-gray-100 dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-6 transition-all duration-300 data-[state=open]:border-primary/30 data-[state=open]:bg-white dark:data-[state=open]:bg-slate-900 data-[state=open]:shadow-xl data-[state=open]:shadow-primary/5"
                            >
                                <AccordionTrigger className="hover:no-underline py-6">
                                    <div className="flex gap-5 text-left items-center">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-slate-500 group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors duration-300 font-mono">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                                            {faq.question}
                                        </span>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="text-gray-600 dark:text-slate-400 leading-relaxed text-base md:text-lg pb-6 pl-[3.25rem]">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* --- FOOTER HINT --- */}
                <div className="mt-16 text-center animate-in fade-in duration-700 delay-300">
                    <p className="text-gray-500 dark:text-slate-500 font-medium flex items-center justify-center gap-2">
                        Still have questions?
                        <span className="text-primary font-bold flex items-center gap-1">
                            <Sparkles className="h-4 w-4" /> Chat with us
                        </span>
                    </p>
                </div>

            </div>
        </section>
    );
};

export default FaqSection;