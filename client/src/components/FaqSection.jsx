import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircleQuestion, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const FaqSection = () => {
    const [faqs, setFaqs] = useState([]);
    const navigate = useNavigate();

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
        <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">

            {/* --- BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-violet-200/40 dark:bg-violet-900/10 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-fuchsia-100/40 dark:bg-fuchsia-900/10 rounded-full blur-[100px] -z-10"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* --- LEFT: TITLE & STICKY INFO --- */}
                    <div className="lg:col-span-4 text-left">
                        <div className="sticky top-32">
                            <div className="inline-flex items-center gap-2 mb-6 bg-violet-50 dark:bg-slate-900 px-4 py-1.5 rounded-full border border-violet-100 dark:border-slate-800 w-fit backdrop-blur-sm">
                                <MessageCircleQuestion className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">Help Center</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6">
                                Commonly Asked <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Questions</span>
                            </h2>

                            <p className="text-lg text-gray-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                                Find answers to common questions about our hair origins, shipping policies, and wholesale partnership program.
                            </p>

                            {/* Contact Box */}
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl shadow-violet-100/50 dark:shadow-none relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100 dark:bg-violet-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 relative z-10">Still need help?</h4>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 relative z-10">
                                    Our team is available 24/7 on WhatsApp to assist you with custom orders.
                                </p>
                                <Button
                                    onClick={() => navigate('/contact')}
                                    className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-200 dark:shadow-none"
                                >
                                    Contact Support <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT: ACCORDION LIST --- */}
                    <div className="lg:col-span-8">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={faq._id}
                                    value={`item-${index}`}
                                    className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:border-violet-200 dark:data-[state=open]:border-violet-900 data-[state=open]:bg-violet-50/30 dark:data-[state=open]:bg-violet-900/10 data-[state=open]:shadow-lg transition-all duration-300"
                                >
                                    <AccordionTrigger className="text-left text-lg font-bold text-gray-800 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 hover:no-underline py-6">
                                        <div className="flex gap-4">
                                            <span className="text-violet-300 dark:text-slate-700 font-mono text-sm">0{index + 1}</span>
                                            {faq.question}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 dark:text-slate-400 leading-relaxed text-base pb-6 pl-10">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FaqSection;