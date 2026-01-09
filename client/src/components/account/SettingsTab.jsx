import React from 'react';
import { Sun, Moon, Laptop, CheckCircle2, Palette } from "lucide-react";
import { useTheme } from '../../context/ThemeContext';
import { cn } from "@/lib/utils";

// ✅ FIX: Component Extracted Outside
const ThemeOption = ({ value, icon: Icon, label, gradient, currentTheme, onSelect }) => {
    const isActive = currentTheme === value;
    return (
        <button
            onClick={() => onSelect(value)}
            className={cn(
                "relative group w-full p-4 rounded-[1.5rem] border transition-all duration-300 text-left overflow-hidden",
                isActive
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50"
            )}
        >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", gradient)}></div>

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm text-white", gradient)}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{label}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                            {value === 'system' ? 'Auto-detects OS preference' : `Switch to ${value} mode`}
                        </p>
                    </div>
                </div>

                <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isActive ? "border-primary bg-primary text-white" : "border-gray-300 dark:border-slate-700"
                )}>
                    {isActive && <CheckCircle2 className="h-4 w-4" />}
                </div>
            </div>
        </button>
    );
};

const SettingsTab = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                    Appearance <Palette className="h-6 w-6 text-primary" />
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Customize how the application looks on your device.</p>
            </div>

            <div className="grid gap-4">
                <ThemeOption
                    value="light"
                    label="Light Mode"
                    icon={Sun}
                    gradient="bg-gradient-to-br from-amber-400 to-orange-500"
                    currentTheme={theme}
                    onSelect={setTheme}
                />
                <ThemeOption
                    value="dark"
                    label="Dark Mode"
                    icon={Moon}
                    gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                    currentTheme={theme}
                    onSelect={setTheme}
                />
                <ThemeOption
                    value="system"
                    label="System Default"
                    icon={Laptop}
                    gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                    currentTheme={theme}
                    onSelect={setTheme}
                />
            </div>
        </div>
    );
};

export default SettingsTab;