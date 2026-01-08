import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

const Forgot = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            sooner.error("Email Required", "Please enter your registered email address.", 3000);
            return;
        }

        const loadingSooner = sooner.loading(
            "Sending Reset Link",
            "Verifying email and generating secure token..."
        );

        setLoading(true);

        try {
            await api.post("/users/forgotpassword", { email });

            loadingSooner.update({
                title: "Email Sent!",
                description: `Password reset instructions sent to ${email}. Check your inbox (and spam).`,
                variant: "success",
                duration: 5000
            });

            setEmailSent(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";

            loadingSooner.update({
                title: "Request Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500 px-4">

            {/* --- AMBIENT BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow delay-1000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">

                {/* --- GLASS CARD --- */}
                <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden p-8 md:p-10">

                    {/* Header Decoration */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-primary to-blue-500"></div>

                    {emailSent ? (
                        // Success View
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Check your mail</h2>
                            <p className="text-gray-500 dark:text-slate-400 mb-8 leading-relaxed">
                                We have sent a password recover instructions to your email.
                            </p>
                            <Button
                                onClick={() => window.open('https://gmail.com', '_blank')}
                                className="w-full h-12 rounded-xl bg-primary hover:bg-purple-700 text-white font-bold mb-4"
                            >
                                Open Gmail
                            </Button>
                            <Link to="/admin/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Skip, I'll confirm later
                            </Link>
                        </div>
                    ) : (
                        // Form View
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl mb-4 shadow-inner">
                                    <KeyRound className="h-8 w-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                    Forgot Password?
                                </h2>
                                <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm font-medium">
                                    No worries, we'll send you reset instructions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20 dark:shadow-none bg-gradient-to-r from-gray-900 to-gray-800 dark:from-primary dark:to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                                </Button>
                            </form>

                            <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-slate-800">
                                <Link
                                    to="/admin/login"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" /> Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forgot;