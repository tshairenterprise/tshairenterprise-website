import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Loader2, User, ShieldCheck, Phone, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { sooner } from "@/components/ui/use-sooner.jsx";

const Login = () => {
    const [role, setRole] = useState("user");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [adminExists, setAdminExists] = useState(true); // Default to true for safety

    const navigate = useNavigate();
    const location = useLocation();

    // Check Admin Existence on Mount
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const { data } = await api.get("/users/admin-exists");
                setAdminExists(data.exists);
            } catch (error) {
                console.error("Failed to check admin status");
            }
        };
        checkAdminStatus();
    }, []);

    useEffect(() => {
        const userInfoRaw = localStorage.getItem("userInfo");
        if (!userInfoRaw) return;
        try {
            const user = JSON.parse(userInfoRaw);
            if (user.isAdmin) navigate("/admin/dashboard");
            else navigate("/");
        } catch { localStorage.removeItem("userInfo"); }
    }, [navigate]);

    // Reset registration mode when switching roles
    const handleRoleSwitch = (newRole) => {
        setRole(newRole);
        setIsRegistering(false);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const loadingSooner = sooner.loading(
            isRegistering ? "Creating Account..." : "Signing In...",
            `Attempting login for ${email}. Please wait.`
        );

        setLoading(true);

        try {
            // ✅ FIX: 'isAdminLogin' wala unused variable hata diya hai.

            // URL Logic: Login ke liye alag, Register ke liye alag
            let url = "/users/login";
            if (isRegistering) url = "/users";

            // Payload Logic
            let payload = { email, password };
            if (isRegistering) {
                payload = { ...payload, name, whatsappNumber };
            }

            const { data } = await api.post(url, payload);

            // ✅ Security Check: Agar 'Admin' tab se login kar rahe hain, par user admin nahi hai
            if (role === "admin" && !data.isAdmin) {
                throw new Error("Access Denied: Not an admin account.");
            }

            localStorage.setItem("userInfo", JSON.stringify(data));

            loadingSooner.update({
                title: isRegistering ? "Account Created!" : "Login Successful!",
                description: `Welcome, ${data.name.split(' ')[0]}. Redirecting now.`,
                variant: "success",
                duration: 3000
            });

            setLoading(false);

            if (data.isAdmin) navigate("/admin/dashboard");
            else {
                const origin = location.state?.from?.pathname || "/";
                navigate(origin);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong.";
            loadingSooner.update({
                title: "Authentication Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });

            setLoading(false);
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">

            {/* --- AMBIENT BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal animate-pulse-slow delay-1000"></div>
            </div>

            <div className="w-full max-w-md relative z-10 px-4">

                {/* --- GLASS CARD --- */}
                <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">

                    {/* Header Decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-blue-500"></div>

                    <div className="p-8 md:p-10">

                        {/* Brand Logo / Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl mb-4 shadow-inner">
                                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                {role === "admin" ? "Admin Portal" : isRegistering ? "Create Account" : "Welcome Back"}
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm font-medium">
                                {role === "admin" ? "Secure access for management" : "Enter your details to continue"}
                            </p>
                        </div>

                        {/* --- ROLE TOGGLE (Pill Shape) --- */}
                        <div className="relative flex p-1.5 bg-gray-100 dark:bg-slate-950/50 rounded-full border border-gray-200 dark:border-slate-800 mb-8">
                            <div
                                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-800 rounded-full shadow-sm transition-all duration-300 ease-out ${role === "admin" ? "left-[calc(50%+3px)]" : "left-1.5"}`}
                            ></div>

                            <button
                                type="button"
                                onClick={() => handleRoleSwitch("user")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 relative z-10 text-sm font-bold transition-colors duration-300 ${role === "user" ? "text-primary dark:text-white" : "text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"}`}
                            >
                                <User className="h-4 w-4" /> Customer
                            </button>

                            <button
                                type="button"
                                onClick={() => handleRoleSwitch("admin")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 relative z-10 text-sm font-bold transition-colors duration-300 ${role === "admin" ? "text-primary dark:text-white" : "text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"}`}
                            >
                                <ShieldCheck className="h-4 w-4" /> Admin
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        {/* --- FORM --- */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {isRegistering && (
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)}
                                        className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
                                    />
                                </div>
                            )}

                            {isRegistering && (
                                <div className="space-y-1">
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-green-500 transition-colors" />
                                        <Input
                                            type="tel" placeholder="WhatsApp (e.g. 917047163936)" required value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)}
                                            className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-green-500/20 focus:border-green-500 transition-all dark:text-white"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 dark:text-slate-500 pl-4">Include country code, no spaces.</p>
                                </div>
                            )}

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
                                    />
                                </div>

                                {/* Forgot Password Link - Only show in Login mode */}
                                {!isRegistering && (
                                    <div className="flex justify-end pr-1">
                                        <Link
                                            to="/forgotpassword"
                                            className="text-xs font-bold text-primary hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20 dark:shadow-none bg-gradient-to-r from-gray-900 to-gray-800 dark:from-primary dark:to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-2"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {isRegistering ? "Create Account" : "Sign In"}
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Footer Link (Conditional Logic) */}
                        {/* Show registration toggle ONLY if:
                            1. Role is 'user' (Always allow)
                            OR
                            2. Role is 'admin' AND no admin exists yet (Allow first admin registration)
                        */}
                        {(role === "user" || (role === "admin" && !adminExists)) && (
                            <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-slate-800">
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    {isRegistering ? "Already have an account?" :
                                        role === "admin" ? "Setup Admin Account" : "New to TS Hair Enterprise?"}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsRegistering((prev) => !prev)}
                                    className="mt-2 text-primary dark:text-white font-bold hover:underline decoration-2 underline-offset-4 transition-all"
                                >
                                    {isRegistering ? "Sign In Instead" : "Create New Account"}
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;