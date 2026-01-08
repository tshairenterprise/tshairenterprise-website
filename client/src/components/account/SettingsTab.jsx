import React from 'react';
import { Sun, Moon, Laptop, CheckCircle2, Palette } from "lucide-react";
import { useTheme } from '../../context/ThemeContext';
import { cn } from "@/lib/utils";

const SettingsTab = () => {
    const { theme, resolvedTheme, setTheme } = useTheme();

    // Helper to render cards
    const ThemeCard = ({ value, label, icon: Icon, description, gradientClass, iconColorClass }) => {
        const isActive = theme === value;

        return (
            <button
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                    "relative group flex flex-col items-center p-1 rounded-[1.5rem] transition-all duration-300 ease-out",
                    "hover:scale-[1.02] focus:outline-none",
                    isActive ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 shadow-xl" : "hover:shadow-lg opacity-80 hover:opacity-100"
                )}
            >
                {/* Active Badge */}
                {isActive && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 shadow-md z-20">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>
                )}

                {/* Card Content */}
                <div className={cn(
                    "w-full h-full flex flex-col items-center justify-center gap-3 p-5 rounded-[1.25rem] border border-transparent transition-all overflow-hidden relative",
                    "bg-white dark:bg-slate-800",
                    gradientClass
                )}>

                    {/* Decorative Blob inside card */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                    {/* Icon Container */}
                    <div className={cn(
                        "p-3 rounded-full bg-white/90 dark:bg-slate-950/50 shadow-sm backdrop-blur-sm transition-transform group-hover:scale-110",
                        iconColorClass
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-0.5 z-10">
                        <span className={cn("block text-sm font-bold", isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-slate-300")}>
                            {label}
                        </span>
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 p-2">

            {/* --- Header Section --- */}
            <div className="text-center mb-10 space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 dark:bg-primary/20 rounded-full mb-2 shadow-sm border border-primary/5">
                    <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Personalize Your View
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Choose a theme that matches your style or syncs automatically with your system.
                </p>
            </div>

            {/* --- Theme Selection Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">

                {/* Light Mode */}
                <ThemeCard
                    value="light"
                    label="Light Mode"
                    icon={Sun}
                    gradientClass="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-800 border-amber-100/50"
                    iconColorClass="text-amber-500"
                />

                {/* Dark Mode */}
                <ThemeCard
                    value="dark"
                    label="Dark Mode"
                    icon={Moon}
                    gradientClass="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700"
                    iconColorClass="text-indigo-500 dark:text-indigo-400"
                />

                {/* System Mode */}
                <ThemeCard
                    value="system"
                    label="System Sync"
                    icon={Laptop}
                    gradientClass="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border-blue-100/50"
                    iconColorClass="text-blue-500"
                />
            </div>

            {/* --- Footer Info --- */}
            <div className="mt-10 flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider border border-gray-200 dark:border-slate-700">
                    Active Theme: <span className="text-primary ml-1">{resolvedTheme}</span>
                </span>
            </div>

        </div>
    );
};

export default SettingsTab;