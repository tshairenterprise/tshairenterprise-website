import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

const Reset = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            sooner.error("Mismatch", "Passwords do not match. Please try again.", 4000);
            return;
        }

        if (password.length < 6) {
            sooner.error("Weak Password", "Password must be at least 6 characters long.", 4000);
            return;
        }

        const loadingSooner = sooner.loading(
            "Reseting Password",
            "Verifying token and updating your security credentials..."
        );

        setLoading(true);

        try {
            const { data } = await api.put(
                `/users/resetpassword/${resetToken}`,
                { password }
            );

            // Auto Login feature: Backend returns a new token
            localStorage.setItem("userInfo", JSON.stringify(data));

            loadingSooner.update({
                title: "Success!",
                description: "Your password has been reset. You are now logged in.",
                variant: "success",
                duration: 3000
            });

            // Redirect based on role (simple check, or default to home)
            navigate("/");

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Invalid or Expired Token.";

            loadingSooner.update({
                title: "Reset Failed",
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
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 dark:bg-indigo-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow delay-1000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">

                {/* --- GLASS CARD --- */}
                <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden p-8 md:p-10">

                    {/* Header Decoration */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 shadow-inner text-indigo-600 dark:text-indigo-400">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            New Password
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm font-medium">
                            Create a strong password to secure your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-4">
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-indigo-500/20 dark:shadow-none bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                        </Button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Reset;