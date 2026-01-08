import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userInfo || !userInfo.isAdmin) {
            navigate('/admin/login', { replace: true });
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 relative overflow-hidden font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">

            {/* --- ADMIN BACKGROUND BLOBS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[100px] -z-10"></div>
            </div>

            <div className="flex h-screen relative z-10">

                {/* --- DESKTOP SIDEBAR --- */}
                <aside
                    className={`hidden lg:block transition-all duration-500 ease-in-out m-4 mr-0 rounded-3xl border border-white/50 dark:border-slate-800 shadow-2xl shadow-purple-100/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden ${isSidebarOpen ? 'w-72' : 'w-24'}`}
                >
                    <AdminSidebar isSidebarOpen={isSidebarOpen} />
                </aside>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">

                    {/* Navbar */}
                    <header className="px-6 pt-4 pb-2">
                        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/60 dark:border-slate-800 shadow-sm px-6 h-16 flex items-center justify-between transition-colors duration-300">
                            <AdminNavbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                        </div>
                    </header>

                    {/* Content Scroll Area */}
                    <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Outlet />
                        </div>
                    </main>
                </div>

            </div>
        </div>
    );
};

export default AdminLayout;