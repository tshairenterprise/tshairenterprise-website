import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "theme-preference";

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === "light" || stored === "dark" || stored === "system") {
                return stored;
            }
        }
        return "system";
    });

    const [resolvedTheme, setResolvedTheme] = useState("light");

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = (choice) => {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            const effective = choice === "system" ? systemTheme : choice;

            setResolvedTheme(effective);

            // Clean slate approach
            root.classList.remove("light", "dark");
            root.classList.add(effective);
        };

        applyTheme(theme);
        window.localStorage.setItem(STORAGE_KEY, theme);

        // System Theme Listener
        if (theme === "system") {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            const listener = () => applyTheme("system");
            mq.addEventListener("change", listener);
            return () => mq.removeEventListener("change", listener);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
};